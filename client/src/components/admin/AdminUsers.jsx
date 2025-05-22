import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import Icon from '../Icon';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && users.length === 0) {
    return <div className="admin-loading">Загрузка пользователей...</div>;
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
    <div className="admin-users">
      <div className="admin-section-header">
        <h2>Управление пользователями</h2>
      </div>

      {users.length === 0 ? (
        <div className="admin-empty-state">
          <Icon name="user" color="var(--text-light)" size={48} style={{ marginBottom: '16px' }} />
          <p>Нет пользователей для отображения</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя пользователя</th>
                <th>Дата регистрации</th>
                <th>Роль</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="slide-in">
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <span className={`user-role ${user.is_admin ? 'admin-role' : 'user-role'}`}>
                      {user.is_admin ? 'Администратор' : 'Пользователь'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers; 