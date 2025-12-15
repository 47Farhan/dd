const API_URL = '/api/admin';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Dashboard API
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// **ADD THIS: Products API - GET ALL PRODUCTS**
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Orders API
export const getAllOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Mock data for development (remove when backend is ready)
export const getMockProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            _id: '1',
            name: 'Wireless Headphones',
            price: 99.99,
            category: 'Electronics',
            countInStock: 25,
            image: 'https://via.placeholder.com/50'
          },
          {
            _id: '2',
            name: 'Running Shoes',
            price: 79.99,
            category: 'Sports',
            countInStock: 50,
            image: 'https://via.placeholder.com/50'
          },
          {
            _id: '3',
            name: 'Coffee Maker',
            price: 129.99,
            category: 'Home',
            countInStock: 15,
            image: 'https://via.placeholder.com/50'
          }
        ]
      });
    }, 500);
  });
};

// Export as default object for backward compatibility
const adminProductAPI = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts, // Added this
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getMockProducts // Added for development
};

export default adminProductAPI;