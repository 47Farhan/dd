import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div style={styles.card}>
      <Link to={`/product/${product._id}`} style={styles.link}>
        <img 
          // Assuming product.images is an array of objects, access the URL property
          src={product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/300x300'} 
          alt={product.name}
          style={styles.image}
        />
        <div style={styles.content}>
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.description}>{product.description?.substring(0, 60)}...</p>
          <div style={styles.info}>
            <span style={styles.price}>${product.price}</span>
            <span style={styles.category}>{product.category}</span>
          </div>
          <div style={styles.rating}>
            {'⭐'.repeat(Math.floor(product.rating || 0))}
            <span style={styles.reviewCount}>({product.numReviews || 0})</span>
          </div>
        </div>
      </Link>
      <button 
        onClick={handleAddToCart}
        style={styles.addButton}
        // Removed: disabled={typeof product.inventory === 'number' ? product.inventory <= 0 : false}
      >
        {/* Removed inventory check; button always says 'Add to Cart' */}
        Add to Cart
      </button>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative'
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block'
  },
  content: {
    padding: '1rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#333',
    minHeight: '2.5rem'
  },
  description: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0 0 1rem 0',
    flex: 1
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#007bff'
  },
  category: {
    background: '#f8f9fa',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    color: '#666'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginBottom: '1rem'
  },
  reviewCount: {
    fontSize: '0.8rem',
    color: '#666'
  },
  addButton: {
    margin: '0 1rem 1rem 1rem',
    padding: '0.75rem',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background 0.2s'
  }
};

export default ProductCard;