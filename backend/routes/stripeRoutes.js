import express from 'express';
import stripeController from '../controllers/stripeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', authMiddleware, stripeController);
export default router;