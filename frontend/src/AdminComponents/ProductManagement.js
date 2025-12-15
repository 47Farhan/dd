import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, getMockProducts } from '../services/adminAPI';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Try to get real products first, fallback to mock if API fails
      let productsData;
      try {
        const response = await getProducts();
        productsData = response.data || response.products || [];
      } catch (apiError) {
        console.log('API failed, using mock data');
        const mockResponse = await getMockProducts();
        productsData = mockResponse.data;
      }
      
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        // Remove from local state
        setProducts(products.filter(product => product._id !== productId));
      } catch (error) {
        setError('Failed to delete product');
        console.error('Delete error:', error);
      }
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <div>Loading products...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ margin: 0 }}>Product Management</h1>
        <Link 
          to="/admin/add-product" 
          style={{
            padding: '0.75rem 1.5rem',
            background: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          + Add New Product
        </Link>
      </div>

      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>No products found</h3>
          <p>Start by adding your first product</p>
          <Link 
            to="/admin/add-product"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'inline-block',
              marginTop: '1rem'
            }}
          >
            Add First Product
          </Link>
        </div>
      ) : (
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '600'
                  }}>Product</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '600'
                  }}>Category</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '600'
                  }}>Price</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '600'
                  }}>Stock</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '600'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                          src={(product.images && product.images[0] && product.images[0].url) || product.image || 'https://via.placeholder.com/50'} 
                          alt={product.name}
                          style={{ 
                            width: '50px', 
                            height: '50px', 
                            objectFit: 'cover', 
                            marginRight: '1rem',
                            borderRadius: '4px'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                            {product.name}
                          </div>
                          <div style={{ 
                            color: '#6c757d', 
                            fontSize: '0.875rem',
                            maxWidth: '300px'
                          }}>
                            {product.description || 'No description available'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: '#e9ecef',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem'
                      }}>
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        color: (product.inventory ?? 0) > 10 ? '#28a745' : 
                               (product.inventory ?? 0) > 0 ? '#ffc107' : '#dc3545',
                        fontWeight: 'bold'
                      }}>
                        {product.inventory ?? 0}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEdit(product._id)}
                          style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#17a2b8', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
