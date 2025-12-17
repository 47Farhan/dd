import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productAPI } from '../../services/api';

const Women = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWomenProducts();
  }, []);

  const fetchWomenProducts = async () => {
    try {
      let resp;
      try {
        resp = await productAPI.getByCategory('women');
      } catch (err) {
        console.warn('Failed to fetch women products from API, falling back to mock', err);
      }

      const womenProducts = (resp && resp.data) ? resp.data : [
        {
          _id: '7',
          name: "Women's Summer Dress",
          images: ['https://images.unsplash.com/photo-1500016105938-ff8d87ed0368?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Elegant summer dress made from high-quality cotton',
          price: 49.99,
          category: 'Women',
          brand: 'Zara',
          rating: 4.7,
          numReviews: 42,
          countInStock: 30
        },
        {
          _id: '8',
          name: "Women's Handbag",
          images: ['https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Stylish leather handbag with multiple compartments',
          price: 79.99,
          category: 'Women',
          brand: 'Michael Kors',
          rating: 4.8,
          numReviews: 56,
          countInStock: 18
        },
        {
          _id: '9',
          name: "Women's Heels",
          images: ['https://images.unsplash.com/photo-1747852631328-0f04fdd70005?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Elegant high heels for special occasions',
          price: 89.99,
          category: 'Women',
          brand: 'Steve Madden',
          rating: 4.3,
          numReviews: 29,
          countInStock: 22
        }
      ];

      setProducts(womenProducts);
    } catch (error) {
      console.error("Error fetching women's products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading women's collection...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Women's Collection</h1>
        <p style={styles.subtitle}>Discover the latest in women's fashion</p>
      </div>

      <div style={styles.productsGrid}>
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  title: { fontSize: '2.5rem', color: '#333', marginBottom: '0.5rem' },
  subtitle: { fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }
};

export default Women;