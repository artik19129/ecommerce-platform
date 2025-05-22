import React from 'react';
import Icon from './Icon';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="cart-item slide-in">
      <div className="cart-item-image-info">
        <img 
          src={item.image_url} 
          alt={item.name}
          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <div className="cart-item-info">
          <h4>{item.name}</h4>
          <p className="cart-item-price">{item.price.toFixed(2)} ₽</p>
        </div>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="btn-icon"
          >
            <Icon name="minus" color="white" size={14} />
          </button>
          <span>{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="btn-icon"
          >
            <Icon name="plus" color="white" size={14} />
          </button>
        </div>
        
        <div style={{ marginLeft: '20px', textAlign: 'right' }}>
          <p style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '1.1rem' }}>
            {(item.price * item.quantity).toFixed(2)} ₽
          </p>
          <button 
            onClick={() => onRemove(item.id)}
            className="btn-danger"
            style={{ marginTop: '8px' }}
          >
            <Icon name="trash" color="white" size={14} />
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem; 