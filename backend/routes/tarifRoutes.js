import express from "express";
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import tarifController from "../controllers/tarifController.js";

const router = express.Router();

// Route publique (sans auth) pour afficher les tarifs aux visiteurs
router.get('/public', tarifController.getPublicTarifs);

// Route publique pour calculer le prix d'une réservation
router.post('/calculate', tarifController.calculatePrice);

// Routes protégées (admin)
router.get('/', authMiddleware, adminMiddleware, tarifController.getAllTarifs);
router.get('/:id_tarif', authMiddleware, adminMiddleware, tarifController.getAllTarifsById);

router.post('/', authMiddleware, adminMiddleware, tarifController.createTarif);
router.put('/:id_tarif', authMiddleware, adminMiddleware, tarifController.updateTarif);
router.delete('/:id_tarif', authMiddleware, adminMiddleware, tarifController.deleteTarif);

export default router;
