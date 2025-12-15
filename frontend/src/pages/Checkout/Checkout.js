import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import './Checkout.css'; //  use this CSS file for styling

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderProcessing, setOrderProcessing] = useState(false);
  const [dbOrderId, setDbOrderId] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const rawClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID || '';
  const paypalClientId = rawClientId.trim();
  const isValidClientId = paypalClientId && paypalClientId.length > 20 && !paypalClientId.includes(' ');

  const subtotal = getCartTotal();
  const shipping = 5.00;
  const tax = subtotal * 0.1;
  // Make sure total calculation is rounded for display/API, though toFixed is used later
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const createOrder = async (data, actions) => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
      alert('Please fill out all shipping information before proceeding.');
      throw new Error('Missing shipping information');
    }

    try {
      const isValidObjectId = (id) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
      const invalid = items.filter(it => !isValidObjectId(it._id));
      if (invalid.length > 0) {
        alert('Some cart items are from demo data. Please re-add products from the catalog.');
        throw new Error('Invalid product IDs in cart');
      }

      const orderItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: Array.isArray(item.images) ? (item.images[0]?.url || '') : (item.image || ''),
        price: item.price,
        product: item._id
      }));

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: shippingInfo,
          paymentMethod: 'paypal',
          itemsPrice: subtotal,
          taxPrice: tax,
          shippingPrice: shipping,
          totalPrice: total
        })
      });

      const createdOrder = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(createdOrder.message || 'Failed to create order');
      }
      setDbOrderId(createdOrder._id);

      const ppRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({ amount: total, currency: 'GBP', description: 'TDB' })
      });
      const ppData = await ppRes.json();
      if (!ppRes.ok || !ppData.id) {
        throw new Error(ppData.message || 'Failed to create PayPal order');
      }
      return ppData.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      alert('Could not initiate payment. Please try again.');
      throw error;
    }
  };

  const onApprove = async (data) => {
    setOrderProcessing(true);
    try {
      const capRes = await fetch('/api/payments/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({ orderID: data.orderID })
      });
      const capture = await capRes.json();
      if (!capRes.ok) {
        throw new Error(capture.message || 'Failed to capture PayPal order');
      }

      const updateTime = capture?.purchase_units?.[0]?.payments?.captures?.[0]?.update_time || new Date().toISOString();

      const updRes = await fetch(`/api/orders/${dbOrderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          id: capture.id,
          status: capture.status,
          update_time: updateTime,
          payer: capture.payer
        })
      });
      const updatedOrder = await updRes.json();
      if (!updRes.ok) {
        throw new Error(updatedOrder.message || 'Payment status update failed');
      }

      clearCart();
      navigate(`/order-success/${updatedOrder._id}`);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

  const onError = (err) => {
    console.error('PayPal Checkout Error:', err);
    alert('There was an error with your payment. Please try again.');
  };

  // Redirect users if not logged in or cart is empty
  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>
      
      <div style={styles.checkoutContent}>
        {/* Shipping Information */}
        <div style={styles.shippingSection}>
          <h2 style={styles.sectionTitle}>Shipping Information</h2>
          {/* Note: In a real app, this form should likely submit a handler function */}
          <form style={styles.shippingForm} onSubmit={(e) => e.preventDefault()}> 
            <div style={styles.formGroup}>
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  required
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleShippingChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={shippingInfo.country}
                onChange={handleShippingChange}
                required
                style={styles.input}
              />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div style={styles.orderSummary}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          
          <div style={styles.orderItems}>
            {items.map(item => (
              <div key={item._id} style={styles.orderItem}>
                <img 
                  src={Array.isArray(item.images) ? (item.images[0]?.url || item.image || 'https://via.placeholder.com/60x60') : (item.image || 'https://via.placeholder.com/60x60')} 
                  alt={item.name}
                  style={styles.itemImage}
                />
                <div style={styles.itemDetails}>
                  <h4 style={styles.itemName}>{item.name}</h4>
                  <p style={styles.itemPrice}>
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div style={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.priceBreakdown}>
            <div style={styles.priceRow}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.priceRow}>
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div style={styles.priceRow}>
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{...styles.priceRow, ...styles.total}}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* PayPal Button */}
          <div style={styles.paymentSection}>
            <h3 style={styles.paymentTitle}>Payment Method</h3>
            <p style={styles.paymentNote}>
              {isValidClientId ? 'Pay securely with PayPal' : 'PayPal is in test mode. Configure a valid client ID.'}
            </p>
            
            <PayPalScriptProvider 
              options={{ 
                "client-id": isValidClientId ? paypalClientId : "test",
                components: "buttons",
                intent: "capture",
                currency: "GBP",
                "disable-funding": "card,credit"
              }}
            >
              <div style={styles.paypalButton}>
                <PayPalButtons
                  style={{ 
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "paypal"
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                  // Disable the button until shipping info is filled out
                  disabled={orderProcessing || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country}
                />
              </div>
            </PayPalScriptProvider>
            
            {orderProcessing && (
              <div style={styles.processing}>
                Processing your order...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Styles Object ---
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
  checkoutContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'start'
  },
  shippingSection: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    margin: '0 0 1.5rem 0',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '0.5rem'
  },
  shippingForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  orderSummary: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content'
  },
  orderItems: {
    marginBottom: '1.5rem'
  },
  orderItem: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr auto',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid #eee'
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  itemDetails: {
    flex: 1
  },
  itemName: {
    margin: '0 0 0.25rem 0',
    fontSize: '0.9rem',
    color: '#333'
  },
  itemPrice: {
    margin: 0,
    color: '#666',
    fontSize: '0.8rem'
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#333'
  },
  priceBreakdown: {
    borderTop: '2px solid #eee',
    paddingTop: '1rem',
    marginBottom: '2rem'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    color: '#666'
  },
  total: {
    borderTop: '1px solid #eee',
    paddingTop: '0.5rem',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#333'
  },
  paymentSection: {
    borderTop: '2px solid #eee',
    paddingTop: '1.5rem'
  },
  paymentTitle: {
    margin: '0 0 1rem 0',
    color: '#333'
  },
  paymentNote: {
    color: '#666',
    marginBottom: '1rem'
  },
  paypalButton: {
    marginBottom: '1rem'
  },
  processing: {
    textAlign: 'center',
    padding: '1rem',
    background: '#e7f3ff',
    color: '#007bff',
    borderRadius: '4px',
    fontWeight: 'bold'
  }
};

export default Checkout;
