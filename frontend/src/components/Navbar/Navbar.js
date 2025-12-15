import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/images/logo.png" alt="Logo" className="logo" />
          The Digital Bazar
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/men" className="nav-link">
              Men
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/women" className="nav-link">
              Women
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/kids" className="nav-link">
              Kids
            </Link>
          </li>
        </ul>
        <div className="nav-icons">

          <Link to="/products" className="icon-btn" aria-label="Search">
          <img src="/images/search.png" alt="Favorite" className="search-image" />
          </Link>

          <button className="icon-btn" aria-label="Wishlist">
          <img src="/images/favorite_serc.png" alt="Favorite" className="icon-image" />
          </button>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
          <img src="/images/cart.png" alt="Favorite" className="cart-image" />
            <span className="cart-count">{getCartItemsCount()}</span>
          </Link>

          {/* User Auth Section */}
          <div className="user-auth">
            {user ? (
              <div className="user-menu">
                <span className="user-name">Hello, {user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn login-btn">Sign In</Link>
                <Link to="/register" className="auth-btn register-btn">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;