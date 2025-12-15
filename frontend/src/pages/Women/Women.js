import React, { useState, useEffect } from 'react';

import ProductCard from '../../components/ProductCard/ProductCard';



const Women = () => {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    fetchWomenProducts();

  }, []);



  const fetchWomenProducts = async () => {

    try {

      // women's products -actual API call

      const womenProducts = [

        {

          _id: '7',

          name: 'Women\'s Summer Dress',

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

          name: 'Women\'s Handbag',

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

          name: 'Women\'s Heels',

          images: ['https://images.unsplash.com/photo-1747852631328-0f04fdd70005?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],

          description: 'Elegant high heels for special occasions',

          price: 89.99,

          category: 'Women',

          brand: 'Steve Madden',

          rating: 4.3,

          numReviews: 29,

          countInStock: 22

        },

        {

          _id: '10',

          name: 'Women\'s Blouse',

          images: ['https://images.unsplash.com/photo-1592645946522-1b166cfc18c0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],

          description: 'Silk blouse with delicate embroidery details',

          price: 39.99,

          category: 'Women',

          brand: 'H&M',

          rating: 4.4,

          numReviews: 34,

          countInStock: 40

        },

        {

          _id: '11',

          name: 'Women\'s Jewelry Set',

          images: ['https://images.unsplash.com/photo-1758995115682-1452a1a9e35b?q=80&w=990&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],

          description: 'Elegant necklace and earring set with crystals',

          price: 69.99,

          category: 'Women',

          brand: 'Swarovski',

          rating: 4.6,

          numReviews: 48,

          countInStock: 25

        },

        {

          _id: '12',

          name: 'Women\'s Athletic Wear',

          images: ['https://plus.unsplash.com/premium_photo-1668032525871-a53e0681c386?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],

          description: 'Comfortable and stylish athletic wear set',

          price: 59.99,

          category: 'Women',

          brand: 'Lululemon',

          rating: 4.7,

          numReviews: 52,

          countInStock: 35

        }

      ];



      setProducts(womenProducts);

    } catch (error) {

      console.error('Error fetching women\'s products:', error);

    } finally {

      setLoading(false);

    }

  };



  if (loading) {

    return <div style={styles.loading}>Loading women's collection...</div>;

  }



  return (

    <div style={styles.container}>

      <div style={styles.header}>

        <h1 style={styles.title}>Women's Collection</h1>

        <p style={styles.subtitle}>Explore our latest women\'s fashion and accessories</p>

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

  container: {

    maxWidth: '1400px',

    margin: '0 auto',

    padding: '2rem'

  },

  header: {

    textAlign: 'center',

    marginBottom: '3rem'

  },

  title: {

    fontSize: '2.5rem',

    color: '#333',

    marginBottom: '0.5rem'

  },

  subtitle: {

    fontSize: '1.1rem',

    color: '#666',

    maxWidth: '600px',

    margin: '0 auto'

  },

  productsGrid: {

    display: 'grid',

    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',

    gap: '2rem'

  },

  loading: {

    textAlign: 'center',

    padding: '4rem',

    fontSize: '1.2rem'

  }

};



export default Women;