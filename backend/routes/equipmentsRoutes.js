import equipmentController from "../controllers/equipmentController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, equipmentController.getAllEquipments);
router.get("/:id_equipment", authMiddleware, adminMiddleware, equipmentController.getEquipmentById);

router.post("/", authMiddleware, adminMiddleware, equipmentController.createEquipment);
router.put("/:id_equipment", authMiddleware, adminMiddleware, equipmentController.updateEquipment);
router.delete("/:id_equipment", authMiddleware, adminMiddleware, equipmentController.deleteEquipment);

export default router;