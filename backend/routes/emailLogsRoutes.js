import emailLogController from "../controllers/emailLogController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, emailLogController.getAllEmailLogs);
router.get("/:id_email", authMiddleware, adminMiddleware, emailLogController.getEmailLogById);

router.post("/", emailLogController.createEmailLog);
router.put("/:id_email", authMiddleware, adminMiddleware, emailLogController.updateLog);
router.delete("/:id_email", authMiddleware, adminMiddleware, emailLogController.deleteLog);

export default router;