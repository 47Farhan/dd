import express from 'express';
import { createOrder, captureOrder } from '../controllers/paymentController.js';

const router = express.Router();

// Payment endpoints are public to allow guest checkout; controller may associate user if token provided
router.post('/create-order', createOrder);
router.post('/capture-order', captureOrder);

export default router;
