const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;
    
    const query = db('products').select('*');
    
    if (search) {
      query.where(function() {
        this.where('name', 'like', `%${search}%`)
            .orWhere('description', 'like', `%${search}%`);
      });
    }
    
    if (category) {
      query.where({ category });
    }
    
    if (sort) {
      const [field, order] = sort.split(':');
      query.orderBy(field || 'created_at', order || 'desc');
    } else {
      query.orderBy('created_at', 'desc');
    }
    
    const offset = (page - 1) * limit;
    query.limit(limit).offset(offset);
    
    const products = await query;
    
    res.json(products);
  } catch (err) {
    logger.error('Ошибка при получении товаров:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await db('products')
      .where({ id })
      .first();
    
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    
    res.json(product);
  } catch (err) {
    logger.error('Ошибка при получении товара:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 