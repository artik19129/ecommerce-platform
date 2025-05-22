const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const db = require('../db');
const logger = require('../utils/logger');

router.use(authenticateToken);
router.use(isAdmin);

router.get('/stats', async (req, res) => {
  try {
    const userCount = await db('users').count('* as count').first();
    const productCount = await db('products').count('* as count').first();
    const orderCount = await db('orders').count('* as count').first();
    
    const totalRevenue = await db('orders')
      .sum('total as revenue')
      .first();
    
    res.json({
      users: userCount.count,
      products: productCount.count,
      orders: orderCount.count,
      revenue: totalRevenue.revenue || 0
    });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'username', 'is_admin', 'created_at')
      .orderBy('created_at', 'desc');
    
    res.json(users);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, price, description, image_url } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: 'Имя и цена товара обязательны' });
    }
    
    const [productId] = await db('products').insert({
      name,
      price,
      description,
      image_url
    });
    
    const product = await db('products').where({ id: productId }).first();
    
    res.status(201).json(product);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image_url } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: 'Имя и цена товара обязательны' });
    }
    
    const product = await db('products').where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    await db('products')
      .where({ id })
      .update({
        name,
        price,
        description,
        image_url
      });
    
    const updatedProduct = await db('products').where({ id }).first();
    
    res.json(updatedProduct);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await db('products').where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    const orderItems = await db('order_items').where({ product_id: id }).first();
    if (orderItems) {
      return res.status(400).json({ message: 'Нельзя удалить товар, который уже был заказан' });
    }
    
    await db('products').where({ id }).delete();
    
    res.json({ message: 'Товар успешно удален' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await db('orders')
      .join('users', 'orders.user_id', '=', 'users.id')
      .select(
        'orders.id',
        'orders.total',
        'orders.created_at',
        'users.username as user_username',
        'users.id as user_id'
      )
      .orderBy('orders.created_at', 'desc');
    
    for (let order of orders) {
      const items = await db('order_items')
        .join('products', 'order_items.product_id', '=', 'products.id')
        .where('order_items.order_id', order.id)
        .select(
          'order_items.id',
          'order_items.quantity',
          'order_items.price',
          'products.name',
          'products.image_url'
        );
      
      order.items = items;
    }
    
    res.json(orders);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 