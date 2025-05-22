import React from 'react';
import Icon from './Icon';

function OrderItem({ order }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-item fade-in">
      <div className="order-header">
        <h3>
          <Icon name="order" color="var(--primary-color)" size={20} /> 
          Заказ #{order.id}
        </h3>
        <div>
          <p style={{ color: 'var(--text-gray)', marginBottom: '8px' }}>
            <Icon name="calendar" color="var(--text-gray)" size={14} style={{ marginRight: '6px' }} />
            {formatDate(order.created_at)}
          </p>
          <p className="order-total">Итого: {order.total.toFixed(2)} ₽</p>
        </div>
      </div>
      
      <div>
        <h4 style={{ marginBottom: '12px', color: 'var(--text-dark)' }}>
          <Icon name="cart" color="var(--secondary-color)" size={16} style={{ marginRight: '6px' }} />
          Товары:
        </h4>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {order.items.map(item => (
            <li key={item.id} className="slide-in" style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon name="chevronRight" color="var(--secondary-color)" size={16} style={{ marginRight: '8px' }} />
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-dark)' }}>{item.name}</p>
                  <p style={{ color: 'var(--text-gray)' }}>
                    {item.quantity} x {item.price.toFixed(2)} ₽
                  </p>
                </div>
              </div>
              <p style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                {(item.quantity * item.price).toFixed(2)} ₽
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderItem; 