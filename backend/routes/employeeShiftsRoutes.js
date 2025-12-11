import employeeShiftController from "../controllers/employeeShiftController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, employeeShiftController.getAllEmployeeShift);
router.get("/:id_shift", authMiddleware, adminMiddleware, employeeShiftController.getEmployeeShiftById);
router.post("/", authMiddleware, adminMiddleware, employeeShiftController.createEmployeeShift);
router.put("/:id_shift", authMiddleware, adminMiddleware, employeeShiftController.updateEmployeeShift);
router.delete("/:id_shift", authMiddleware, adminMiddleware, employeeShiftController.deleteEmployeeShift);


export default router;