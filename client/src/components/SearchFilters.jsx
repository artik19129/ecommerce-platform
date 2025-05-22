import React, { useState } from 'react';
import Icon from './Icon';

function SearchFilters({ onSearch }) {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const filters = {
      search: search.trim(),
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortField,
      sortOrder
    };
    
    onSearch(filters);
  };
  
  const handleReset = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSortField('id');
    setSortOrder('asc');
    
    onSearch({});
  };
  
  return (
    <div className="search-filters-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <Icon name="search" size={18} color="white" />
          </button>
        </div>
        
        <button 
          type="button" 
          className="filter-toggle-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter" size={16} color="currentColor" />
          Фильтры
        </button>
      </form>
      
      {showFilters && (
        <div className="filters-panel fade-in">
          <div className="filters-row">
            <div className="filter-group">
              <label>Цена от</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Мин. цена"
              />
            </div>
            
            <div className="filter-group">
              <label>Цена до</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Макс. цена"
              />
            </div>
            
            <div className="filter-group">
              <label>Сортировать по</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="id">ID</option>
                <option value="name">Названию</option>
                <option value="price">Цене</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Порядок</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
              </select>
            </div>
          </div>
          
          <div className="filters-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleReset}
            >
              <Icon name="refresh" size={16} color="currentColor" />
              Сбросить
            </button>
            
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleSubmit}
            >
              <Icon name="search" size={16} color="white" />
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilters; 