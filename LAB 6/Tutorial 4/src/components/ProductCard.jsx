import React from 'react';

function ProductCard({ icon, name, price, description }) {
  return (
    <div className="product-card">
      <div className="product-image">{icon}</div>
      <h3 className="product-name">{name}</h3>
      <p className="product-price">${price}</p>
      <p className="product-desc">{description}</p>
      <button className="buy-btn">Buy Now</button>
    </div>
  );
}

export default ProductCard;
