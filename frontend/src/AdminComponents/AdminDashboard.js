import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/adminAPI';
// Create a simple AuthContext hook or remove if not needed
const useAuth = () => {
  // For now, return a dummy user - replace with your actual auth context
  return {
    user: JSON.parse(localStorage.getItem('adminUser')) || null
  };
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Replace with your actual API call
      const response = await getDashboardStats();
      setStats(response.data || response);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default stats for demo
      setStats({
        totalProducts: 12,
        totalOrders: 48,
        totalUsers: 23,
        totalRevenue: 12450.75
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="admin-container" style={{ padding: '2rem' }}>Loading dashboard...</div>;
  }

  const styles = {
    adminContainer: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    adminHeader: {
      marginBottom: '2rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: '#fff',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    statIcon: {
      fontSize: '2rem'
    },
    statInfo: {
      flex: 1
    },
    adminActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    adminActionCard: {
      background: '#fff',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
      transition: 'transform 0.2s'
    }
  };

  return (
    <div style={styles.adminContainer}>
      <div style={styles.adminHeader}>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user.name || 'Admin'}!</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statInfo}>
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🛒</div>
          <div style={styles.statInfo}>
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statInfo}>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statInfo}>
            <h3>${stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div style={styles.adminActions}>
        <Link to="/admin/products" style={styles.adminActionCard}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>➕</div>
          <h3>Manage Products</h3>
          <p>Add, edit, or delete products</p>
        </Link>

        <Link to="/admin/orders" style={styles.adminActionCard}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
          <h3>Manage Orders</h3>
          <p>View and update order status</p>
        </Link>

        <Link to="/admin/add-product" style={styles.adminActionCard}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🆕</div>
          <h3>Add New Product</h3>
          <p>Create a new product listing</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;