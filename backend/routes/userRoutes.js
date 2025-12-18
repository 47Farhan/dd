import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  getUserCart,
  updateUserCart,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/cart').get(protect, getUserCart).put(protect, updateUserCart);

export default router;