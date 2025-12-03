import supportTicketController from "../controllers/ticketController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, supportTicketController.getAllSupportTickets);
router.get("/:id_ticket", authMiddleware, adminMiddleware, supportTicketController.getSupportTicketById);

router.post("/", supportTicketController.createTicket);
router.put("/:id_ticket", authMiddleware, adminMiddleware, supportTicketController.updateTicket);
router.delete("/:id_ticket", authMiddleware, adminMiddleware, supportTicketController.deleteTicket);

export default router;
