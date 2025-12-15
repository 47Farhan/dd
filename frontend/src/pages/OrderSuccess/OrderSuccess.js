import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        
        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div style={styles.loading}>Loading order details...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>✅</div>
        <h1 style={styles.title}>Order Confirmed!</h1>
        <p style={styles.message}>
          Thank you for your purchase, {user?.name}! Your order has been successfully placed.
        </p>
        
        {order && (
          <div style={styles.orderDetails}>
            <h3 style={styles.detailsTitle}>Order Details</h3>
            <div style={styles.detailRow}>
              <span>Order ID:</span>
              <span>{order._id}</span>
            </div>
            <div style={styles.detailRow}>
              <span>Total Amount:</span>
              <span>${order.totalPrice?.toFixed(2)}</span>
            </div>
            <div style={styles.detailRow}>
              <span>Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div style={styles.detailRow}>
              <span>Order Status:</span>
              <span style={styles.status}>Confirmed</span>
            </div>
          </div>
        )}

        <div style={styles.actions}>
          <Link to="/" style={styles.continueShopping}>
            Continue Shopping
          </Link>
          <Link to="/orders" style={styles.viewOrders}>
            View My Orders
          </Link>
        </div>

        <p style={styles.contact}>
          Have questions? <Link to="/contact">Contact us</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '2rem',
    background: '#f8f9fa'
  },
  successCard: {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%'
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  title: {
    color: '#28a745',
    margin: '0 0 1rem 0',
    fontSize: '2rem'
  },
  message: {
    color: '#666',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  orderDetails: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'left'
  },
  detailsTitle: {
    margin: '0 0 1rem 0',
    color: '#333',
    textAlign: 'center'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #dee2e6'
  },
  status: {
    color: '#28a745',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  continueShopping: {
    padding: '0.75rem 1.5rem',
    background: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '500'
  },
  viewOrders: {
    padding: '0.75rem 1.5rem',
    background: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '500'
  },
  contact: {
    color: '#666',
    fontSize: '0.9rem'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem'
  }
};

export default OrderSuccess;