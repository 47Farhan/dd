



import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productAPI } from '../../services/api';

const Men = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenProducts();
  }, []);

  const fetchMenProducts = async () => {
    try {
      let resp;
      try {
        resp = await productAPI.getByCategory('men');
      } catch (err) {
        console.warn('Failed to fetch men products from API, falling back to mock', err);
      }

      const menProducts = (resp && resp.data) ? resp.data : [
        {
          _id: '1',
          name: "Men's Running Shoes",
          images: ['https://images.unsplash.com/photo-1654939438953-58dca903c976?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Lightweight running shoes with superior cushioning for men',
          price: 129.99,
          category: 'Men',
          brand: 'Nike',
          rating: 4.3,
          numReviews: 28,
          countInStock: 25
        },
        {
          _id: '2',
          name: "Men's Casual Shirt",
          images: ['https://images.unsplash.com/photo-1666358083648-68aff30bfbbc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Comfortable casual shirt made from premium cotton',
          price: 29.99,
          category: 'Men',
          brand: 'H&M',
          rating: 4.1,
          numReviews: 23,
          countInStock: 50
        },
        {
          _id: '3',
          name: "Men's Jeans",
          images: ['https://plus.unsplash.com/premium_photo-1688497831535-120bd47d9f9c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Slim fit jeans with stretch fabric for comfort',
          price: 59.99,
          category: 'Men',
          brand: "Levi's",
          rating: 4.4,
          numReviews: 45,
          countInStock: 30
        }
      ];

      setProducts(menProducts);
    } catch (error) {
      console.error('Error fetching men products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading men's collection...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Men's Collection</h1>
        <p style={styles.subtitle}>Comfortable and stylish picks for men</p>
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

export default Men;

