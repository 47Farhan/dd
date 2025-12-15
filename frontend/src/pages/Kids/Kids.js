import React, { useState, useEffect } from 'react';

import ProductCard from '../../components/ProductCard/ProductCard';



const Kids = () => {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    fetchKidsProducts();

  }, []);



  const fetchKidsProducts = async () => {

    try {

      // Mock kids' products - replace with actual API call

      const kidsProducts = [

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

          brand: 'Carter\'s',

          rating: 4.5,

          numReviews: 42,

          countInStock: 60

        },

        {

          _id: '15',

          name: 'Kids Shoes',

          images: ['https://images.unsplash.com/photo-1584564515943-b54cbb61836b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],

          description: 'Lightweight and comfortable shoes for kids',

          price: 34.99,

          category: 'Kids',

          brand: 'Nike',

          rating: 4.3,

          numReviews: 28,

          countInStock: 35

        },

        {

          _id: '16',

          name: 'Kids Toy Set',

          images: ['https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],

          description: 'Educational toy set for children 3+ years',

          price: 29.99,

          category: 'Kids',

          brand: 'Fisher-Price',

          rating: 4.6,

          numReviews: 67,

          countInStock: 45

        },

        {

          _id: '17',

          name: 'Kids Winter Jacket',

          images: ['https://images.unsplash.com/photo-1662787271649-8843cc38454a?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],

          description: 'Warm winter jacket with waterproof material',

          price: 49.99,

          category: 'Kids',

          brand: 'Columbia',

          rating: 4.4,

          numReviews: 23,

          countInStock: 25

        },

        {

          _id: '18',

          name: 'Kids Story Books',

          images: ['https://images.unsplash.com/photo-1696563541384-bf48ecbaac45?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],

          description: 'Set of 5 illustrated story books for children',

          price: 24.99,

          category: 'Kids',

          brand: 'Disney',

          rating: 4.7,

          numReviews: 89,

          countInStock: 50

        }

      ];



      setProducts(kidsProducts);

    } catch (error) {

      console.error('Error fetching kids\' products:', error);

    } finally {

      setLoading(false);

    }

  };



  if (loading) {

    return <div style={styles.loading}>Loading kids collection...</div>;

  }



  return (

    <div style={styles.container}>

      <div style={styles.header}>

        <h1 style={styles.title}>Kids Collection</h1>

        <p style={styles.subtitle}>Find adorable and comfortable items for your little ones</p>

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



export default Kids;