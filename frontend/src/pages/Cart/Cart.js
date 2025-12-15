import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyCart}>
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart</p>
          <Link to="/" style={styles.continueShopping}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>
      
      <div style={styles.cartContent}>
        <div style={styles.cartItems}>
          {items.map(item => (
            <div key={item._id} style={styles.cartItem}>
              <img 
                src={item.image} 
                alt={item.name}
                style={styles.productImage}
              />
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{item.name}</h3>
                <p style={styles.productPrice}>${item.price}</p>
              </div>
              <div style={styles.quantityControls}>
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  style={styles.quantityBtn}
                >
                  -
                </button>
                <span style={styles.quantity}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  style={styles.quantityBtn}
                >
                  +
                </button>
              </div>
              <div style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => removeFromCart(item._id)}
                style={styles.removeBtn}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div style={styles.cartSummary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping:</span>
            <span>$5.00</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax:</span>
            <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
          </div>
          <div style={{...styles.summaryRow, ...styles.total}}>
            <span>Total:</span>
            <span>${(getCartTotal() + 5 + getCartTotal() * 0.1).toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            style={styles.checkoutBtn}
          >
            Proceed to Checkout
          </button>
          <button 
            onClick={clearCart}
            style={styles.clearBtn}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333'
  },
  emptyCart: {
    textAlign: 'center',
    padding: '4rem'
  },
  continueShopping: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    marginTop: '1rem'
  },
  cartContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr auto auto auto',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  productImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  productInfo: {
    flex: 1
  },
  productName: {
    margin: '0 0 0.5rem 0',
    color: '#333'
  },
  productPrice: {
    margin: 0,
    color: '#666',
    fontWeight: 'bold'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  quantityBtn: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    background: 'white',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  quantity: {
    padding: '0 1rem',
    fontWeight: 'bold'
  },
  itemTotal: {
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem'
  },
  cartSummary: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content'
  },
  summaryTitle: {
    margin: '0 0 1rem 0',
    color: '#333'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #eee'
  },
  total: {
    borderBottom: 'none',
    borderTop: '2px solid #333',
    paddingTop: '0.5rem',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  checkoutBtn: {
    width: '100%',
    padding: '1rem',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  clearBtn: {
    width: '100%',
    padding: '0.75rem',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Cart;