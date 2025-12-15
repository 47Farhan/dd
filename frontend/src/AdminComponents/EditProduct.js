import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, updateProduct } from '../services/adminAPI';
import { productAPI } from '../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      const product = response.data;
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || '',
          brand: product.brand || '',
          countInStock: typeof product.inventory === 'number' ? product.inventory : (product.countInStock || ''),
          image: Array.isArray(product.images) ? (product.images[0]?.url || '') : (product.image || '')
        });
      }
    } catch (error) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand,
        inventory: Number(formData.countInStock),
        images: formData.image ? [{ url: formData.image, alt: formData.name }] : []
      };
      await updateProduct(id, payload);
      navigate('/admin/products');
    } catch (error) {
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit Product</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Copy the same form fields from AddProduct.js */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Stock Quantity:</label>
          <input
            type="number"
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Image URL:</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/admin/products')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
