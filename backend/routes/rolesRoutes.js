import roleController from "../controllers/roleController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/", roleController.getAllRoles);
router.get("/:id_role", roleController.getRoleById);


router.post("/", authMiddleware, adminMiddleware, roleController.createRole);
router.put("/:id_role", authMiddleware, adminMiddleware, roleController.updateRole);
router.delete("/:id_role", authMiddleware, adminMiddleware, roleController.deleteRole);



export default router;