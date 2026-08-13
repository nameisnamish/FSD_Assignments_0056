import React from 'react';
import ProductCard from './ProductCard';

function ProductSection() {
  const products = [
    {
      id: 1,
      icon: '🎧',
      name: 'Wireless Headphones',
      price: 99.99,
      description: 'High quality noise canceling wireless over-ear headphones.'
    },
    {
      id: 2,
      icon: '⌚',
      name: 'Smart Watch',
      price: 149.99,
      description: 'Fitness tracker with heart rate monitor and AMOLED display.'
    },
    {
      id: 3,
      icon: '💻',
      name: 'Gaming Mouse',
      price: 49.99,
      description: 'RGB ergonomic gaming mouse with customizable DPI options.'
    }
  ];

  return (
    <section className="product-section">
      <h2 className="section-title">Featured Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            icon={product.icon}
            name={product.name}
            price={product.price}
            description={product.description}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
