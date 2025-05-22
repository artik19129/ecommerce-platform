import React, { useState, useEffect } from 'react';
import { productService, adminService } from '../../services/api';
import Icon from '../Icon';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image_url: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, isNewProduct = false) => {
    const { name, value } = e.target;
    if (isNewProduct) {
      setNewProduct({ ...newProduct, [name]: value });
    } else {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price)
      };

      await adminService.createProduct(productData);
      await fetchProducts();
      setIsAdding(false);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        image_url: ''
      });
    } catch (err) {
      console.error('Ошибка добавления товара:', err);
      setError('Не удалось добавить товар');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...editingProduct,
        price: parseFloat(editingProduct.price)
      };

      await adminService.updateProduct(editingProduct.id, productData);
      await fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      console.error('Ошибка обновления товара:', err);
      setError('Не удалось обновить товар');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      await adminService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error('Ошибка удаления товара:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Не удалось удалить товар');
      }
    }
  };

  if (loading && products.length === 0) {
    return <div className="admin-loading">Загрузка товаров...</div>;
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
    <div className="admin-products">
      <div className="admin-section-header">
        <h2>Управление товарами</h2>
        <button onClick={() => setIsAdding(true)} className="btn-primary">
          <Icon name="plus" color="white" size={18} />
          Добавить товар
        </button>
      </div>

      {isAdding && (
        <div className="admin-form-container fade-in">
          <h3>Добавить новый товар</h3>
          <form onSubmit={handleAddProduct} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Название товара</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={(e) => handleInputChange(e, true)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Цена</label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => handleInputChange(e, true)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image_url">URL изображения</label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={newProduct.image_url}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary">
                Отмена
              </button>
              <button type="submit" className="btn-success">
                Добавить товар
              </button>
            </div>
          </form>
        </div>
      )}

      {editingProduct && (
        <div className="admin-form-container fade-in">
          <h3>Редактировать товар</h3>
          <form onSubmit={handleEditProduct} className="admin-form">
            <div className="form-group">
              <label htmlFor="edit-name">Название товара</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={editingProduct.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-price">Цена</label>
              <input
                type="number"
                id="edit-price"
                name="price"
                step="0.01"
                value={editingProduct.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-description">Описание</label>
              <textarea
                id="edit-description"
                name="description"
                value={editingProduct.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="edit-image_url">URL изображения</label>
              <input
                type="text"
                id="edit-image_url"
                name="image_url"
                value={editingProduct.image_url}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setEditingProduct(null)} className="btn-secondary">
                Отмена
              </button>
              <button type="submit" className="btn-success">
                Сохранить изменения
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="slide-in">
                <td>{product.id}</td>
                <td>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  ) : (
                    <div className="no-image">Нет фото</div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.price.toFixed(2)} ₽</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => setEditingProduct(product)} 
                      className="btn-icon"
                      title="Редактировать"
                    >
                      <Icon name="edit" color="white" size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)} 
                      className="btn-icon btn-danger"
                      title="Удалить"
                    >
                      <Icon name="trash" color="white" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts; 