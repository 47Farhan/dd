


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
// Pages
import Home from './pages/Home/Home';
import Men from './pages/Men/Men';
import Women from './pages/Women/Women';
import Kids from './pages/Kids/Kids';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';

// Admin components - Note: AdminLayout import is now removed as requested
import AdminLogin from './AdminComponents/AdminLogin';
import AdminDashboard from './AdminComponents/AdminDashboard';
import ProductManagement from './AdminComponents/ProductManagement';
import AddProduct from './AdminComponents/AddProduct';
import EditProduct from './AdminComponents/EditProduct';
import AdminRoutes from './AdminComponents/AdminRoutes';


import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main className="main-content">
                    {/* Inner Routes for the Main Content */}
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/men" element={<Men />} />
                      <Route path="/women" element={<Women />} />
                      <Route path="/kids" element={<Kids />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      
                      {/* User Flow Pages */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />

                      {/* Fallback for invalid main app URLs */}
                      <Route path="*" element={<h2>404 Page Not Found</h2>} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
              
              <Route path="/admin/*" element={
                <Routes>
                  <Route path="login" element={<AdminLogin />} />
                  
                  {/* All admin pages are now direct children */}
                  <Route path="/" element={<AdminDashboard />} /> {/* /admin/ */}
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<ProductManagement />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="edit-product/:id" element={<EditProduct />} />
                  <Route path="admin-routes" element={<AdminRoutes />} />
                  
                  {/* <Route path="*" element={<h2>Admin 404</h2>} /> */}
                </Routes>
              } />
              
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;