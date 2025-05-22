import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import ProductItem from '../components/ProductItem';
import SearchFilters from '../components/SearchFilters';
import Icon from '../components/Icon';

function ProductsPage({ cart, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [isFiltered, setIsFiltered] = useState(false);
  
  const navigate = useNavigate();

  const fetchProducts = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const response = await productService.searchProducts(searchFilters);
      setProducts(response.data);
      setError(null);
      setIsFiltered(
        Object.keys(searchFilters).length > 0 && 
        (searchFilters.search || 
         searchFilters.minPrice || 
         searchFilters.maxPrice || 
         (searchFilters.sortField && searchFilters.sortField !== 'id') || 
         searchFilters.sortOrder === 'desc')
      );
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Не удалось загрузить товары. Пожалуйста, повторите попытку позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchProducts(searchFilters);
  };

  const handleViewCart = () => {
    navigate('/purchase');
  };

  if (loading && !products.length) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px', 
        color: 'var(--primary-color)',
        fontSize: '1.2rem'
      }}>
        Загрузка товаров...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="container">
      <div className="page-title-container">
        <h1 className="section-title">Товары</h1>
        {cartItemsCount > 0 && (
          <button onClick={handleViewCart}>
            <Icon name="cart" color="white" size={18} />
            Перейти в корзину ({cartItemsCount})
          </button>
        )}
      </div>
      
      <SearchFilters onSearch={handleSearch} />
      
      {products.length === 0 ? (
        <div className="fade-in" style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: 'var(--text-gray)',
          backgroundColor: 'var(--background-white)',
          borderRadius: '12px'
        }}>
          <Icon name="search" color="var(--text-light)" size={48} style={{ marginBottom: '16px' }} />
          <p>{isFiltered 
            ? 'По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.' 
            : 'Нет доступных товаров.'}
          </p>
          {isFiltered && (
            <button 
              onClick={() => handleSearch({})} 
              className="btn-secondary"
              style={{ marginTop: '16px' }}
            >
              <Icon name="refresh" color="var(--primary-color)" size={16} />
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <>
          {isFiltered && (
            <div className="search-results-info">
              <p>Найдено товаров: {products.length}</p>
              <button 
                onClick={() => handleSearch({})} 
                className="btn-secondary btn-sm"
              >
                <Icon name="refresh" color="var(--primary-color)" size={14} />
                Сбросить фильтры
              </button>
            </div>
          )}
          <div className="product-grid">
            {products.map(product => (
              <ProductItem 
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductsPage; 