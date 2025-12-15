import express from 'express';
import { register, login, getMe, bootstrapAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/bootstrap-admin', bootstrapAdmin);

export default router;
