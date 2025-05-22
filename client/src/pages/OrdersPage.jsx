import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import OrderItem from '../components/OrderItem';
import Icon from '../components/Icon';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrders();
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
        if (err.response && err.response.status === 401) {
          setError('Вы должны войти в систему, чтобы просматривать заказы.');
        } else {
          setError('Не удалось загрузить заказы. Пожалуйста, повторите попытку позже.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px', 
        color: 'var(--primary-color)',
        fontSize: '1.2rem'
      }}>
        Загрузка заказов...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1 className="section-title">Ваши заказы</h1>
        <div className="error-message">
          <Icon name="warning" color="var(--danger-color)" size={18} style={{ marginRight: '8px' }} />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="section-title">Ваши заказы</h1>
      
      {orders.length === 0 ? (
        <div className="fade-in" style={{ 
          textAlign: 'center', 
          padding: '60px 40px', 
          backgroundColor: 'var(--background-white)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px var(--shadow-color)'
        }}>
          <Icon name="order" color="var(--text-light)" size={64} style={{ marginBottom: '24px' }} />
          <p style={{ color: 'var(--text-gray)', marginBottom: '24px', fontSize: '1.1rem' }}>
            У вас пока нет заказов.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            <Icon name="home" color="var(--primary-color)" size={18} />
            Перейти к покупкам
          </button>
        </div>
      ) : (
        <div className="fade-in">
          {orders.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage; 