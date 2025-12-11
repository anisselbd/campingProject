import express from 'express';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import couponController from '../controllers/couponController.js';



const router = express.Router();

router.post('/',[authMiddleware, adminMiddleware], couponController.createCoupon);
router.get('/:id_coupon',[authMiddleware, adminMiddleware], couponController.getCouponById);
router.get('/',[authMiddleware, adminMiddleware] ,couponController.getAllCoupons);
router.put('/:id_coupon',[authMiddleware, adminMiddleware] , couponController.updateCoupon);
router.delete('/:id_coupon',[authMiddleware, adminMiddleware], couponController.deleteCoupon);


export default router;