import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">My Product Store</h1>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
