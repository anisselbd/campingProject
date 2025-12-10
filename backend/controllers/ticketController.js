import ticketModel from "../models/ticketModel.js";
import supportTicketModel from "../models/ticketModel.js";
import dotenv from "dotenv";
dotenv.config();

const getAllSupportTickets = async (req, res) => {
    try {
        const recuptickets = await supportTicketModel.getAllSupportTickets();
        res.status(200).json({ recuptickets });
    } catch (error) {
        res.status(500).json({ message: "Impossible de récupérer les tickets." });
    }
}

const getSupportTicketById = async (req, res) => {
    try {
        const id_ticket = req.params.id_ticket;
        const ticket = await supportTicketModel.getSupportTicketById(id_ticket);

        if (!ticket) {
            res.status(404).json({ message: "Ticket non trouvé." });
        } else {
            res.status(200).json({ ticket });
        }

    } catch (error) {
        res.status(500).json({ message: "Impossible d'afficher le ticket via son ID." });
    }
}

const createTicket = async (req, res) => {
    try {
        const id_ticket = req.params.id_ticket;
        const { client_id, sujet, description, statut, priorite } = req.body;
        if (!client_id || !sujet || !description || !statut || !priorite) {
            return res.status(400).json({
                message: `Les champs client_id, sujet, description, statut, 
        priorite sont obligatoires.`});
        }

        const existingTicket = await ticketModel.getSupportTicketById(id_ticket);
        if (existingTicket) {
            return res.status(409).json({
                message: `Le ticket ${id_ticket} existe déjà.`
            });
        }

        const addTicket = await supportTicketModel.createTicket(client_id, sujet, description, statut, priorite);

        if (!addTicket) {
            res.status(500).json({ message: "Impossible de créer un ticket." });
        } else {
            res.status(201).json({ id_ticket: addTicket });
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "Création du ticket impossible." });
    }
}

const updateTicket = async (req, res) => {
    try {
        const id_ticket = req.params.id_ticket;
        const { client_id, sujet, description, statut, priorite } = req.body;
        const affectedRows = await supportTicketModel.updateTicket(id_ticket, client_id, sujet, description, statut, priorite);

        if (affectedRows === 0) {
            res.status(404).json({ message: "Aucune modification sur le ticket." });
        } else {
            res.status(200).json({ message: "Ticket mis à jour avec succès.", affectedRows });
        }

    } catch (error) {
        res.status(500).json({ message: "Mise à jour du ticket impossible." });
    }
}

const deleteTicket = async (req, res) => {
    try {
        const id_ticket = req.params.id_ticket;
        const affectedRows = await supportTicketModel.deleteTicket(id_ticket);

        if (affectedRows === 0) {
            res.status(404).json({ message: "Aucun ticket trouvé." });
        } else {
            res.status(200).json({ message: "Ticket supprimé avec succès.", affectedRows });
        }
    } catch (error) {
        res.status(500).json({ message: "Suppression du ticket impossible." });
    }
}

export default {
    getAllSupportTickets,
    getSupportTicketById,
    createTicket,
    updateTicket,
    deleteTicket
}