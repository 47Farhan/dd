import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Pending replace with actual API call
      const mockFeaturedProducts = [
        {
          _id: '19',
          name: 'Wireless Bluetooth Headphones',
          images: ['https://plus.unsplash.com/premium_photo-1680346529160-549ad950bd1f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Premium wireless headphones with noise cancellation',
          price: 199.99,
          category: 'Electronics',
          brand: 'Sony',
          rating: 4.8,
          numReviews: 156,
          featured: true
        },
        {
          _id: '20',
          name: 'Smart Fitness Watch',
          images: ['https://images.unsplash.com/photo-1656955003707-9a86ad069bb3?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Track your fitness with this advanced smartwatch',
          price: 299.99,
          category: 'Electronics',
          brand: 'Fitbit',
          rating: 4.6,
          numReviews: 234,
          featured: true
        },
        {
          _id: '21',
          name: 'Designer Handbag',
          images: ['https://images.unsplash.com/photo-1761646238175-5d25cf3566f7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'Luxury designer handbag with premium leather',
          price: 399.99,
          category: 'Women',
          brand: 'Gucci',
          rating: 4.9,
          numReviews: 89,
          featured: true
        },
        {
          _id: '22',
          name: 'Gaming Laptop',
          images: ['https://images.unsplash.com/photo-1630794180018-433d915c34ac?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
          description: 'High-performance gaming laptop with RTX graphics',
          price: 1499.99,
          category: 'Electronics',
          brand: 'ASUS',
          rating: 4.7,
          numReviews: 312,
          featured: true
        }
      ];

      const mockCategories = [
        {
          id: 1,
          name: "Men's Fashion",
          image: 'https://plus.unsplash.com/premium_photo-1669688174622-0393f5c6baa2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          count: 156,
          link: '/men'
        },
        {
          id: 2,
          name: "Women's Fashion",
          image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          count: 234,
          link: '/women'
        },
        {
          id: 3,
          name: 'Kids & Toys',
          image: 'https://images.unsplash.com/photo-1626187429639-7a77bfad0523?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          count: 189,
          link: '/kids'
        },
        {
          id: 4,
          name: 'Electronics',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          count: 312,
          link: '/products?category=electronics'
        }
      ];

      setFeaturedProducts(mockFeaturedProducts);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to The Digital Bazar</h1>
          <p style={styles.heroSubtitle}>
            Discover amazing products at unbeatable prices. Shop the latest trends in fashion, and more.
          </p>
          <Link to="/products" style={styles.heroButton}>
            Shop Now
          </Link>
        </div>
        <div style={styles.heroImage}>
          <img 
            src="/images/hero-banner.jpg" 
            alt="Shopping"
            style={styles.heroImg}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Shop by Category</h2>
        <div style={styles.categoriesGrid}>
          {categories.map(category => (
            <Link key={category.id} to={category.link} style={styles.categoryCard}>
              <img 
                src={category.image} 
                alt={category.name}
                style={styles.categoryImage}
              />
              <div style={styles.categoryContent}>
                <h3 style={styles.categoryName}>{category.name}</h3>
                <p style={styles.categoryCount}>{category.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <div style={styles.productsGrid}>
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div style={styles.viewAllContainer}>
          <Link to="/products" style={styles.viewAllButton}>
            View All Products →
          </Link>
        </div>
      </section>

      {/* Banner Section */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <h2 style={styles.bannerTitle}>Summer Sale Up to 50% Off</h2>
          <p style={styles.bannerText}>
            Don't miss out on our biggest sale of the season. Limited time offer!
          </p>
          <Link to="/products?category=sale" style={styles.bannerButton}>
            Shop Sale
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🚚</div>
          <h3 style={styles.featureTitle}>Free Shipping</h3>
          <p style={styles.featureText}>On orders over $50</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>↩️</div>
          <h3 style={styles.featureTitle}>30-Day Returns</h3>
          <p style={styles.featureText}>Easy returns policy</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🔒</div>
          <h3 style={styles.featureTitle}>Secure Payment</h3>
          <p style={styles.featureText}>100% secure transactions</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>📞</div>
          <h3 style={styles.featureTitle}>24/7 Support</h3>
          <p style={styles.featureText}>Customer service available</p>
        </div>
      </section>
    </div>
  );
};

// --- Styles Object ---
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem'
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    padding: '4rem 1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    margin: '2rem 1rem',
    color: 'white'
  },
  heroContent: {
    padding: '2rem'
  },
  heroTitle: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9
  },
  heroButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: 'white',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'transform 0.2s'
  },
  heroImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroImg: {
    width: '100%',
    maxWidth: '600px',
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  section: {
    padding: '4rem 1rem',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    marginBottom: '3rem',
    color: '#333'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  categoryCard: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  categoryImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block'
  },
  categoryContent: {
    padding: '1.5rem',
    background: 'white'
  },
  categoryName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.3rem',
    color: '#333'
  },
  categoryCount: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  viewAllContainer: {
    textAlign: 'center',
    marginTop: '2rem'
  },
  viewAllButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  banner: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
    borderRadius: '12px',
    padding: '4rem',
    textAlign: 'center',
    color: 'white',
    margin: '2rem 1rem'
  },
  bannerTitle: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontWeight: 'bold'
  },
  bannerText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: 0.9
  },
  bannerButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    background: 'white',
    color: '#ff6b6b',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  featuresSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    padding: '4rem 1rem',
    textAlign: 'center'
  },
  feature: {
    padding: '2rem'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  featureText: {
    color: '#666',
    margin: 0
  }
};

export default Home;