import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

function Header({ isAuthenticated, user, onLogout, cartItemsCount }) {
  return (
    <header className="header">
      <div>
        <h1>
          <Icon name="home" color="#5D55FA" size={24} />
          Интернет-магазин
        </h1>
      </div>
      <nav>
        <Link to="/" className="slide-in">
          <Icon name="home" color="currentColor" size={18} />
          Товары
        </Link>
        <Link to="/purchase" className="slide-in">
          <Icon name="cart" color="currentColor" size={18} />
          Корзина {cartItemsCount > 0 && (
            <span className="pulse" style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {cartItemsCount}
            </span>
          )}
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/orders" className="slide-in">
              <Icon name="order" color="currentColor" size={18} />
              Мои заказы
            </Link>
            { user && user.isAdmin && (
              <Link to="/admin" className="slide-in" style={{ color: 'var(--primary-color)' }}>
                <Icon name="chart" color="var(--primary-color)" size={18} />
                Админ-панель
              </Link>
            )}
            <button 
              onClick={onLogout} 
              className="btn-secondary slide-in"
              style={{ marginLeft: '8px' }}
            >
              <Icon name="logout" color="var(--primary-color)" size={18} />
              {user?.username}
            </button>
          </>
        ) : (
          <Link to="/auth" className="slide-in">
            <Icon name="login" color="currentColor" size={18} />
            Вход / Регистрация
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header; 