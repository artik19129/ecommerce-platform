const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');
const { 
  authenticateToken, 
  generateTokens, 
  setCookies,
  refreshAccessToken
} = require('../middleware/auth');
const logger = require('../utils/logger');

router.post('/refresh', refreshAccessToken);

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Требуется имя пользователя и пароль' });
    }
    
    const existingUser = await db('users').where({ username }).first();
    if (existingUser) {
      return res.status(409).json({ message: 'Имя пользователя уже существует' });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const [userId] = await db('users').insert({
      username,
      password: hashedPassword,
    });

    const newUser = await db('users').where({ id: userId }).first();
    
    const tokens = generateTokens({ userId, username });
    
    setCookies(res, tokens.accessToken, tokens.refreshToken);
    
    res.json({
      message: 'Регистрация успешна',
      user: { 
        id: userId,
        username,
        isAdmin: false
      }
    });
  } catch (err) {
    logger.error('Ошибка при регистрации:', err);
    res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Требуется имя пользователя и пароль' });
    }
    
    const user = await db('users').where({ username }).first();
    if (!user) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }
    
    const tokens = generateTokens({ userId: user.id, username: user.username, role: user.role });
    
    setCookies(res, tokens.accessToken, tokens.refreshToken);
    
    res.json({ 
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin,
        role: user.role
      }
    });
  } catch (err) {
    logger.error('Ошибка при входе:', err);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  
  res.json({ message: 'Выход выполнен успешно' });
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Недействительный токен пользователя' });
    }
    
    const userId = req.user.userId;
    
    const user = await db('users')
      .where({ id: userId })
      .select('id', 'username', 'is_admin', 'created_at')
      .first();
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.is_admin === 1 || user.is_admin === true,
      created_at: user.created_at
    });
  } catch (err) {
    logger.error('Ошибка при получении информации о пользователе:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 