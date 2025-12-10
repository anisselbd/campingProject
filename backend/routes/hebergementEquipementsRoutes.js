import hebergementEquipmentController from "../controllers/hebergementEquipmentController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:hebergement_id", authMiddleware, adminMiddleware, hebergementEquipmentController.getAllEquipsByHebergement);
router.get("/equipment/:equipment_id", authMiddleware, adminMiddleware, hebergementEquipmentController.getHebergementsByEquipment);

router.post("/", authMiddleware, adminMiddleware, hebergementEquipmentController.createAccomodationEquipment);
router.delete("/:hebergement_id/:equipment_id", authMiddleware, adminMiddleware, hebergementEquipmentController.deleteAccomodationEquipment);

export default router;