import express from "express";
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import tarifController from "../controllers/tarifController.js";

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, tarifController.getAllTarifs);
router.get('/:id_tarif', authMiddleware, adminMiddleware, tarifController.getAllTarifsById);

router.post('/', authMiddleware, adminMiddleware, tarifController.createTarif);
router.put('/:id_tarif', authMiddleware, adminMiddleware, tarifController.updateTarif);
router.delete('/:id_tarif', authMiddleware, adminMiddleware, tarifController.deleteTarif);

export default router;
