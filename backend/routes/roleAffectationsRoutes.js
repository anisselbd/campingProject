import roleAffectationController from "../controllers/roleAffectationController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, roleAffectationController.getAllRoleAffectations);
router.get("/:id_affectation", authMiddleware, adminMiddleware, roleAffectationController.getAffectationById);
router.get("/:user_id/roles/:role_id", authMiddleware, adminMiddleware, roleAffectationController.getRoleAffectationByUserIdByRoleId);
router.get("/:user_id/roles", authMiddleware, adminMiddleware, roleAffectationController.getRoleByUserId);

router.post("/", roleAffectationController.createAffectation);
router.put("/:id_affectation", authMiddleware, adminMiddleware, roleAffectationController.updateAffectation);
router.delete("/:id_affectation", authMiddleware, adminMiddleware, roleAffectationController.deleteRoleAffectation);



export default router;