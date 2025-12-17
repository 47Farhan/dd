import React, { useState, useEffect } from 'react';

import ProductCard from '../../components/ProductCard/ProductCard';
import { productAPI } from '../../services/api';


const Kids = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKidsProducts();
  }, []);

  const fetchKidsProducts = async () => {
    try {
      let resp;
      try {
        resp = await productAPI.getByCategory('kids');
      } catch (err) {
        console.warn('Failed to fetch kids products from API, falling back to mock', err);
      }

      const kidsProducts = (resp && resp.data) ? resp.data : [
        {
          _id: '13',
          name: 'Kids Backpack',
          images: ['https://plus.unsplash.com/premium_photo-1722993519879-aadaa597ba3f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Durable and colorful backpack for kids',
          price: 39.99,
          category: 'Kids',
          brand: 'Adidas',
          rating: 4.2,
          numReviews: 15,
          countInStock: 20
        },
        {
          _id: '14',
          name: 'Kids T-Shirt',
          images: ['https://images.unsplash.com/photo-1754639488181-7eae9f6c06e0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Comfortable cotton t-shirt with fun prints',
          price: 14.99,
          category: 'Kids',
          brand: "Carter's",
          rating: 4.5,
          numReviews: 42,
          countInStock: 60
        }
      ];

      setProducts(kidsProducts);
    } catch (error) {
      console.error("Error fetching kids' products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading kids collection...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Kids Collection</h1>
        <p style={styles.subtitle}>Fun and durable products for kids</p>
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

export default Kids;