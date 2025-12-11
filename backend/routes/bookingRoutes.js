import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route pour les clients connectés
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);
router.delete('/my-bookings/:id_reservation', authMiddleware, bookingController.cancelMyBooking);

// Routes admin
router.get('/', [authMiddleware, adminMiddleware], bookingController.getAll);
router.post('/', [authMiddleware], bookingController.createBooking);
router.get('/:id_reservation', [authMiddleware, adminMiddleware], bookingController.getById);
router.put('/:id_reservation', [authMiddleware, adminMiddleware], bookingController.updateBooking);
router.patch('/:id_reservation/status', [authMiddleware, adminMiddleware], bookingController.updateStatus);
router.delete('/:id_reservation', [authMiddleware, adminMiddleware], bookingController.deleteBooking);
router.post('/:sejour_id/option', [authMiddleware], bookingController.addOptionToStay);
router.delete('/:sejour_id/option', [authMiddleware], bookingController.removeOptionToStay);
router.post('/:sejour_id/coupon', [authMiddleware], bookingController.applyCouponToStay);

export default router;