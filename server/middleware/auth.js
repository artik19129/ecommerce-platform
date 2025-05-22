const jwt = require('jsonwebtoken');
const db = require('../db');
const logger = require('../utils/logger');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function authenticateToken(req, res, next) {
  const accessToken = req.cookies?.access_token;
  
  if (!accessToken) {
    return res.status(401).json({ message: 'Требуется аутентификация' });
  }
  
  jwt.verify(accessToken, JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ 
        message: 'Сессия истекла, необходимо повторно войти',
        expired: true 
      });
    }
    req.user = user;
    next();
  });
}

async function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Требуется аутентификация' });
  }

  try {
    const user = await db('users').where({ id: req.user.userId }).first();
    
    if (!user || !user.is_admin) {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
    }
    
    next();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}

function generateTokens(user) {
  const tokenPayload = { 
    userId: user.userId || user.id, 
    username: user.username, 
    isAdmin: user.is_admin 
  };

  const accessToken = jwt.sign(
    tokenPayload,
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    tokenPayload,
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

function refreshAccessToken(req, res) {
  const refreshToken = req.cookies?.refresh_token;
  
  if (!refreshToken) {
    return res.status(401).json({ message: 'Отсутствует токен обновления' });
  }
  
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, user) => {
    if (err) {
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      return res.status(401).json({ message: 'Необходима повторная аутентификация' });
    }
    
    try {
      const userFromDb = await db('users').where({ id: user.userId }).first();
      
      if (!userFromDb) {
        return res.status(401).json({ message: 'Пользователь не существует' });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(userFromDb);

      setCookies(res, accessToken, newRefreshToken);

      res.json({ 
        message: 'Токен успешно обновлен',
        user: {
          id: userFromDb.id,
          username: userFromDb.username,
          isAdmin: userFromDb.is_admin
        }
      });
    } catch (error) {
      logger.error('Ошибка при обновлении токена:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });
}

function setCookies(res, accessToken, refreshToken) {
  const secureCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  res.cookie('access_token', accessToken, {
    ...secureCookieOptions,
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refresh_token', refreshToken, {
    ...secureCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

module.exports = {
  authenticateToken,
  isAdmin,
  generateTokens,
  refreshAccessToken,
  setCookies,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET
}; 