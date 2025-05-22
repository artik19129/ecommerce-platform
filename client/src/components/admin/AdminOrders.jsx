import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import Icon from '../Icon';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  if (loading && orders.length === 0) {
    return <div className="admin-loading">Загрузка заказов...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <Icon name="warning" color="var(--danger-color)" size={18} style={{ marginRight: '8px' }} />
        {error}
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-section-header">
        <h2>Управление заказами</h2>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-state">
          <Icon name="order" color="var(--text-light)" size={48} style={{ marginBottom: '16px' }} />
          <p>Нет заказов для отображения</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Дата</th>
                <th>Сумма</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr className="slide-in">
                    <td>{order.id}</td>
                    <td>{order.user_username}</td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>{order.total.toFixed(2)} ₽</td>
                    <td>
                      <button 
                        onClick={() => toggleOrderDetails(order.id)} 
                        className="btn-secondary btn-sm"
                      >
                        {expandedOrderId === order.id ? 'Скрыть' : 'Подробнее'}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedOrderId === order.id && (
                    <tr className="order-details-row fade-in">
                      <td colSpan="5">
                        <div className="order-details">
                          <h4 style={{ marginBottom: '12px' }}>
                            <Icon name="cart" color="var(--secondary-color)" size={16} style={{ marginRight: '8px' }} />
                            Товары в заказе
                          </h4>
                          <table className="order-items-table">
                            <thead>
                              <tr>
                                <th>Товар</th>
                                <th>Количество</th>
                                <th>Цена</th>
                                <th>Сумма</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map(item => (
                                <tr key={item.id}>
                                  <td className="order-item-name">
                                    {item.image_url && (
                                      <img 
                                        src={item.image_url} 
                                        alt={item.name} 
                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }} 
                                      />
                                    )}
                                    {item.name}
                                  </td>
                                  <td>{item.quantity}</td>
                                  <td>{item.price.toFixed(2)} ₽</td>
                                  <td>{(item.price * item.quantity).toFixed(2)} ₽</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Итого:</td>
                                <td style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{order.total.toFixed(2)} ₽</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders; 