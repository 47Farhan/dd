import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Main Footer Content */}
        <div className="footer-content">
          
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-logo">FashionStore</h3>
            <p className="footer-description">
              Your one-stop destination for trendy and affordable fashion. 
              We offer the latest styles for men, women, and kids with 
              quality you can trust.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <span className="social-icon">📘</span>
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <span className="social-icon">📷</span>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" aria-label="Pinterest" className="social-link">
                <span className="social-icon">📌</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/men" className="footer-link">Men's Collection</Link></li>
              <li><Link to="/women" className="footer-link">Women's Collection</Link></li>
              <li><Link to="/kids" className="footer-link">Kids' Collection</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-title">Customer Service</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Shipping Information</a></li>
              <li><a href="#" className="footer-link">Returns & Exchanges</a></li>
              <li><a href="#" className="footer-link">Size Guide</a></li>
              <li><a href="#" className="footer-link">FAQs</a></li>
              <li><a href="#" className="footer-link">Track Your Order</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="footer-section">
            <h4 className="footer-title">Stay Updated</h4>
            <p className="newsletter-text">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
            
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@fashionstore.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Fashion St, Style City, SC 12345</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; 2024 FashionStore. All rights reserved.
            </p>
            <div className="payment-methods">
              <span className="payment-text">We accept:</span>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">🅿️</span>
                <span className="payment-icon">📱</span>
                <span className="payment-icon">🔷</span>
                <span className="payment-icon">🍎</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;