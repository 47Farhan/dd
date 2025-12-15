import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AddProduct from './AddProduct';
import ProductManagement from './ProductManagement';
import EditProduct from './EditProduct'; // Add this

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('adminUser'));
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

const OrdersStub = () => (
  <div style={{padding: '2rem'}}><h1>Orders Management</h1><p>Order management functionality goes here.</p></div>
);

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route 
        path="" 
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="add-product" 
        element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        } 
      />
      <Route 
        path="products" 
        element={
          <PrivateRoute>
            <ProductManagement />
          </PrivateRoute>
        } 
      />
      <Route 
        path="products/edit/:id" 
        element={
          <PrivateRoute>
            <EditProduct />
          </PrivateRoute>
        } 
      />
      <Route 
        path="orders" 
        element={
          <PrivateRoute>
            <OrdersStub />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
