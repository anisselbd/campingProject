import express from 'express';
import paymentController from '../controllers/paymentController.js';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', [authMiddleware, adminMiddleware], paymentController.createPayment);



router.get('/:id_payment', [authMiddleware], paymentController.getPaymentById);


// (Utente Autenticato)

router.get('/reservation/:reservation_id', [authMiddleware], paymentController.getPaymentByReservationId);


// (Solo Admin per cambiare stato, riferimento, ecc.)
router.put('/:id_payment', [authMiddleware, adminMiddleware], paymentController.updatePayment);



router.delete('/:id_payment', [authMiddleware, adminMiddleware], paymentController.deletePayment);


export default router;