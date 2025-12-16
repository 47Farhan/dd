import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AddProduct from './AddProduct';
import ProductManagement from './ProductManagement';
import EditProduct from './EditProduct';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Users from './Users';
import Orders from './Orders';

const PrivateRoute = ({ children }) => {
  const adminRaw = localStorage.getItem('adminUser');
  const userRaw = localStorage.getItem('userData') || localStorage.getItem('user');
  let user = null;
  try {
    if (adminRaw) user = JSON.parse(adminRaw);
    else if (userRaw) user = JSON.parse(userRaw);
  } catch (e) {
    user = null;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route 
        path="" 
        element={
          <PrivateRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="add-product" 
        element={
          <PrivateRoute>
            <AdminLayout>
              <AddProduct />
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="products" 
        element={
          <PrivateRoute>
            <AdminLayout>
              <ProductManagement />
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="products/edit/:id" 
        element={
          <PrivateRoute>
            <AdminLayout>
              <EditProduct />
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="orders" 
        element={
          <PrivateRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      <Route
        path="users"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
