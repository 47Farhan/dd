import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { productAPI } from '../../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        const p = response.data || null;
        setProduct(p);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // In a real app, you would add the product AND quantity to the cart
    addToCart(product, quantity); 
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return <div style={styles.loading}>Loading product...</div>;
  }

  if (!product) {
    return <div style={styles.error}>Product not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.breadcrumb}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
      </div>

      <div style={styles.productDetail}>
        {/* Product Images */}
        <div style={styles.imageSection}>
          <div style={styles.mainImage}>
            <img 
              src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600x600'} 
              alt={product.name}
              style={styles.image}
            />
          </div>
          <div style={styles.thumbnailContainer}>
            {Array.isArray(product.images) && product.images.map((image, index) => (
              <img
                key={index}
                src={image?.url || 'https://via.placeholder.com/80x80'}
                alt={`${product.name} ${index + 1}`}
                style={{
                  ...styles.thumbnail,
                  ...(selectedImage === index ? styles.thumbnailActive : {})
                }}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div style={styles.infoSection}>
          <h1 style={styles.productName}>{product.name}</h1>
          <div style={styles.rating}>
            {'⭐'.repeat(Math.floor(typeof product.rating === 'number' ? product.rating : (product.rating?.average || 0)))}
            <span style={styles.ratingText}>({product.numReviews || product.rating?.count || 0} reviews)</span>
          </div>
          <p style={styles.price}>${product.price}</p>
          <p style={styles.description}>{product.description}</p>

          {/* Features */}
          <div style={styles.features}>
            <h3>Features:</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Stock Info */}
          <p 
            style={{
              ...styles.stock,
              color: (typeof product.inventory === 'number' ? product.inventory : product.countInStock) > 0 ? '#28a745' : '#dc3545',
            }}
          >
            {(() => {
              const qty = typeof product.inventory === 'number' ? product.inventory : product.countInStock;
              return qty > 0 ? `In Stock (${qty} available)` : 'Out of Stock';
            })()}
          </p>

          {/* Quantity and Actions */}
          {(typeof product.inventory === 'number' ? product.inventory : product.countInStock) > 0 && (
            <div style={styles.actionSection}>
              <div style={styles.quantitySelector}>
                <label>Quantity:</label>
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  style={styles.quantitySelect}
                >
                  {(() => {
                    const qty = typeof product.inventory === 'number' ? product.inventory : product.countInStock;
                    return [...Array(Math.min(qty, 10)).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              <div style={styles.actionButtons}>
                <button 
                  onClick={handleAddToCart}
                  style={styles.addToCartBtn}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  style={styles.buyNowBtn}
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
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
  breadcrumb: {
    marginBottom: '2rem'
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  productDetail: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'start'
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  mainImage: {
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  thumbnailContainer: {
    display: 'flex',
    gap: '0.5rem'
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '2px solid transparent'
  },
  thumbnailActive: {
    border: '2px solid #007bff'
  },
  infoSection: {
    padding: '1rem 0'
  },
  productName: {
    fontSize: '2rem',
    margin: '0 0 1rem 0',
    color: '#333'
  },
  rating: {
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  ratingText: {
    color: '#666',
    fontSize: '0.9rem'
  },
  price: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '0 0 1rem 0'
  },
  description: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  features: {
    marginBottom: '2rem'
  },
  // Note: The original 'stock' style had a function for color, which is invalid for a static style object. 
  // We'll update how it's used in the JSX, and keep the basic definition here.
  stock: {
    fontWeight: 'bold',
    marginBottom: '2rem'
  },
  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  quantitySelect: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem'
  },
  addToCartBtn: {
    flex: 1,
    padding: '1rem 2rem',
    background: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  buyNowBtn: {
    flex: 1,
    padding: '1rem 2rem',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem'
  },
  error: {
    textAlign: 'center',
    padding: '4rem',
    color: '#dc3545',
    fontSize: '1.2rem'
  }
};

export default ProductDetail;
