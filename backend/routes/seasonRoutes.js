import express from "express";
import seasonController from "../controllers/seasonController.js";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, seasonController.getAllSeasons);
router.get('/:id_saison', authMiddleware, adminMiddleware, seasonController.getSeasonById);
router.post('/', authMiddleware, adminMiddleware, seasonController.createSeason);
router.put('/:id_saison', authMiddleware, adminMiddleware, seasonController.updateSeason);
router.delete('/:id_saison', authMiddleware, adminMiddleware, seasonController.deleteSeason);

export default router;