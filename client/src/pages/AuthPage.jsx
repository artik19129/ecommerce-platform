import React, { useState } from 'react';
import { authService } from '../services/api';
import Icon from '../components/Icon';

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      if (isLogin) {
        try {
          const response = await authService.login(username, password);
          setSuccess('Вход выполнен успешно!');
          onLogin(response.data.user);
        } catch (loginErr) {
          console.error('Ошибка входа:', loginErr);
          if (loginErr.response?.data?.message) {
            setError(loginErr.response.data.message);
          } else {
            setError('Неверное имя пользователя или пароль');
          }
        }
      } else {
        try {
          const response = await authService.register(username, password);
          setSuccess('Регистрация выполнена успешно! Теперь вы можете войти в систему.');
          setIsLogin(true);
        } catch (registerErr) {
          console.error('Ошибка регистрации:', registerErr);
          if (registerErr.response?.data?.message) {
            setError(registerErr.response.data.message);
          } else {
            setError('Не удалось зарегистрировать пользователя');
          }
        }
      }
    } catch (err) {
      console.error('Ошибка аутентификации:', err);
      setError('Произошла ошибка. Пожалуйста, попробуйте снова позже.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container fade-in">
      <h1>{isLogin ? 'Вход в систему' : 'Регистрация'}</h1>
      
      {error && (
        <div className="error-message">
          <Icon name="warning" color="var(--danger-color)" size={18} style={{ marginRight: '8px' }} />
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <Icon name="check" color="var(--success-color)" size={18} style={{ marginRight: '8px' }} />
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input 
            type="text" 
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'} 
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary-color)', 
            cursor: 'pointer',
            padding: '0 5px',
            display: 'inline'
          }}
        >
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </p>
    </div>
  );
}

export default AuthPage; 