import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getAllProducts
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(admin);

// Product routes
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order routes
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

// Dashboard
router.get('/dashboard', getDashboardStats);

export default router;