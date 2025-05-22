import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { adminService } from '../services/api';
import Icon from '../components/Icon';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';

function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
      setError('Не удалось загрузить данные статистики');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <AdminUsers />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="admin-loading">
          <p>Загрузка статистики...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <Icon name="warning" color="var(--danger-color)" size={18} />
          {error}
        </div>
      );
    }

    if (!stats) return null;

    return (
      <div className="admin-dashboard">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Icon name="user" color="var(--primary-color)" size={32} />
            </div>
            <div className="admin-stat-content">
              <h3>Пользователей</h3>
              <p className="admin-stat-value">{stats.users}</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Icon name="cart" color="var(--secondary-color)" size={32} />
            </div>
            <div className="admin-stat-content">
              <h3>Товаров</h3>
              <p className="admin-stat-value">{stats.products}</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Icon name="order" color="var(--success-color)" size={32} />
            </div>
            <div className="admin-stat-content">
              <h3>Заказов</h3>
              <p className="admin-stat-value">{stats.orders}</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Icon name="chart" color="var(--primary-dark)" size={32} />
            </div>
            <div className="admin-stat-content">
              <h3>Доход</h3>
              <p className="admin-stat-value">{Number(stats.revenue).toFixed(2)} ₽</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container admin-container">
      <h1 className="section-title">Панель администратора</h1>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'dashboard' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Icon name="chart" size={18} color="currentColor" />
          Статистика
        </button>
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Icon name="cart" size={18} color="currentColor" />
          Товары
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Icon name="order" size={18} color="currentColor" />
          Заказы
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'admin-tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Icon name="user" size={18} color="currentColor" />
          Пользователи
        </button>
      </div>

      <div className="admin-content fade-in">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage; 