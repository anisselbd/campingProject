import express from "express";
import employeeController from "../controllers/employeeController.js";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, employeeController.getAllEmployee);
router.get('/:id_employee', authMiddleware, adminMiddleware, employeeController.getAllEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id_employee', authMiddleware, adminMiddleware, employeeController.updateEmployee);
router.delete('/:id_employee', authMiddleware, adminMiddleware, employeeController.deleteEmployee);

export default router;