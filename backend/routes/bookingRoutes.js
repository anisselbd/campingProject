import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import bookingModel from '../models/bookingModel.js';


const router = express.Router();

router.get('/',[authMiddleware,adminMiddleware], bookingController.getAll);
router.post('/', [authMiddleware],bookingController.createBooking);
router.get('/:id_reservation',[authMiddleware,adminMiddleware], bookingController.getById);
router.put('/:id_reservation',[adminMiddleware,authMiddleware], bookingController.updateBooking);
router.delete('/:id_reservation',[adminMiddleware,authMiddleware], bookingController.deleteBooking);
router.post('/:sejour_id/option', [authMiddleware], bookingController.addOptionToStay);
router.delete('/:sejour_id/option', [authMiddleware], bookingController.removeOptionToStay);
router.post('/:sejour_id/coupon', [authMiddleware], bookingController.applyCouponToStay);




export default router;