import React from 'react';
import Icon from './Icon';

function ProductItem({ product, onAddToCart }) {
  return (
    <div className="product-card fade-in">
      <img 
        src={product.image_url} 
        alt={product.name}
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">{product.price.toFixed(2)} ₽</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-actions">
          <button 
            onClick={() => onAddToCart(product)}
          >
            <Icon name="cart" color="white" size={16} />
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductItem; 