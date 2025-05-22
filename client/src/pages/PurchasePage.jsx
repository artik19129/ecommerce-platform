import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import Icon from '../components/Icon';
import { orderService } from '../services/api';

function PurchasePage({ cart, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Ваша корзина пуста');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      await orderService.createOrder(orderItems);
      
      onClearCart();
      
      setSuccess('Заказ успешно оформлен!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      console.error('Ошибка оформления заказа:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Не удалось оформить заказ. Пожалуйста, попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="section-title">Ваша корзина</h1>
      
      {error && <div className="error-message">
        <Icon name="warning" color="var(--danger-color)" size={18} style={{ marginRight: '8px' }} />
        {error}
      </div>}
      
      {success && <div className="success-message">
        <Icon name="check" color="var(--success-color)" size={18} style={{ marginRight: '8px' }} />
        {success}
      </div>}
      
      {cart.length === 0 ? (
        <div className="fade-in" style={{ 
          textAlign: 'center', 
          padding: '80px 40px', 
          backgroundColor: 'var(--background-white)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px var(--shadow-color)'
        }}>
          <Icon name="cart" color="var(--text-light)" size={64} style={{ marginBottom: '24px' }} />
          <p style={{ color: 'var(--text-gray)', marginBottom: '24px', fontSize: '1.1rem' }}>
            Ваша корзина пуста.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            <Icon name="home" color="var(--primary-color)" size={18} />
            Продолжить покупки
          </button>
        </div>
      ) : (
        <div className="fade-in">
          <div style={{ 
            backgroundColor: 'var(--background-white)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px var(--shadow-color)'
          }}>
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))}
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '2px solid var(--border-color)',
              paddingTop: '24px',
              marginTop: '16px'
            }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                Итого:
              </span>
              <span style={{ 
                fontSize: '1.5rem', 
                color: 'var(--primary-color)', 
                fontWeight: '700' 
              }}>
                {calculateTotal()} ₽
              </span>
            </div>
            
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <button 
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                <Icon name="home" color="var(--primary-color)" size={18} />
                Продолжить покупки
              </button>
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="btn-success"
              >
                <Icon name="check" color="white" size={18} />
                {loading ? 'Обработка...' : 'Оформить заказ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchasePage; 