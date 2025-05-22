const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Недействительный токен пользователя' });
    }
    
    const userId = req.user.userId;
    
    const orders = await db('orders')
      .where({ user_id: userId })
      .select('*');
    
    const ordersWithItems = await Promise.all(orders.map(async order => {
      const items = await db('order_items')
        .join('products', 'order_items.product_id', 'products.id')
        .where({ order_id: order.id })
        .select(
          'order_items.id',
          'order_items.quantity',
          'order_items.price',
          'products.id as product_id',
          'products.name',
          'products.description',
          'products.image_url'
        );
      
      return {
        ...order,
        items
      };
    }));
    
    res.json(ordersWithItems);
  } catch (err) {
    logger.error('Ошибка при получении заказов:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Недействительный токен пользователя' });
    }
    
    const userId = req.user.userId;
    const { id } = req.params;
    
    const order = await db('orders')
      .where({ id, user_id: userId })
      .first();
    
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    
    const items = await db('order_items')
      .join('products', 'order_items.product_id', 'products.id')
      .where({ order_id: id })
      .select(
        'order_items.id',
        'order_items.quantity',
        'order_items.price',
        'products.id as product_id',
        'products.name',
        'products.description',
        'products.image_url'
      );
    
    res.json({
      ...order,
      items
    });
  } catch (err) {
    logger.error('Ошибка при получении заказа:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Недействительный токен пользователя' });
    }
    
    const userId = req.user.userId;
    const { items } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Необходимо указать товары для заказа' });
    }
    
    const productIds = items.map(item => item.productId);
    const products = await db('products')
      .whereIn('id', productIds)
      .select('*');
    
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product;
    });
    
    let total = 0;
    const orderItems = items.map(item => {
      const product = productMap[item.productId];
      if (!product) {
        throw new Error(`Товар с id ${item.productId} не найден`);
      }
      
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      return {
        product_id: item.productId,
        quantity: item.quantity,
        price: product.price
      };
    });
    
    const result = await db.transaction(async trx => {
      const [orderId] = await trx('orders').insert({
        user_id: userId,
        total: parseFloat(total.toFixed(2))
      });
      
      await Promise.all(
        orderItems.map(item => 
          trx('order_items').insert({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          })
        )
      );
      
      return orderId;
    });
    
    res.status(201).json({ 
      message: 'Заказ успешно создан',
      orderId: result 
    });
  } catch (err) {
    logger.error('Ошибка при создании заказа:', err);
    res.status(500).json({ message: err.message || 'Ошибка сервера' });
  }
});

module.exports = router; 