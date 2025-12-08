import emailLogModel from "../models/emailLogModel.js";
import dotenv from "dotenv";
dotenv.config();

const getAllEmailLogs = async (req, res) => {
    try {
        const recupAllEmailLogs = await emailLogModel.getAllEmailLogs();
        res.status(200).json({ message: "Récupération des emails réussie.", recupAllEmailLogs });
    } catch (error) {
        res.status(500).json({ message: "Récupération des emails impossible." });
    }
}

const getEmailLogById = async (req, res) => {
    try {
        const id_email = req.params.id_email;
        console.log("ID reçu dans le contrôleur :", id_email);
        const log = await emailLogModel.getEmailLogById(id_email);
        if (!log) {
            console.log("Aucun log trouvé pour l'ID :", id_email);
            return res.status(404).json({ message: "Log non trouvé." });
        } else {
            console.log("Log récupéré avec succès :", log);
            return res.status(200).json({ message: "Récupération du log via son ID réussie.", log });
        }
    } catch (error) {
        console.error("Erreur dans le contrôleur :", error);
        return res.status(500).json({ message: "Récupération du log via son ID impossible." });
    }
}

const createEmailLog = async (req, res) => {
    try {
        const id_email = req.params.id_email;
        const { utilisateur_id, reservation_id, type_email, destinataire, sujet, statut, message_erreur, envoye_le } = req.body;

        if (!utilisateur_id || !type_email || !destinataire || !sujet || !statut) {
            return res.status(400).json({
                message: `Les champs utilisateur_id, type_email, destinataire, sujet, statut sont obligatoires.`
            });
        }

        const existingLog = await emailLogModel.getEmailLogById(id_email);
        if (existingLog) {
            return res.status(409).json({
                message: `Le log ${id_email} existe déjà.`
            });
        }

        const addLog = await emailLogModel.createEmailLog(utilisateur_id, reservation_id, type_email, destinataire, sujet, message_erreur, envoye_le);

        if (!addLog) {
            return res.status(500).json({ message: "Impossible de créer un log." });
        } else {
            return res.status(201).json({ message: "Création du log réussie", addLog });
        }


    } catch (error) {

        return res.status(500).json({ message: "Création du log impossible." });
    }

}

const updateLog = async (req, res) => {
    try {
        const id_email = req.params.id_email;
        const { type_email, destinataire, sujet, statut, message_erreur, envoye_le } = req.body;
        const updateLog = await emailLogModel.updateEmailLog(id_email, type_email, destinataire, sujet, statut, message_erreur, envoye_le);

        if (updateLog === 0) {
            return res.status(404).json({ message: "Aucune modification sur le log." });
        } else {
            return res.status(200).json({ message: "Mis à jour du log réussie.", updateLog });
        }
    } catch (error) {
        return res.status(500).json({ message: "Mise à jour du log impossible." });
    }
}

const deleteLog = async (req, res) => {
    try {
        const id_email = req.params.id_email;
        const deleteLog = await emailLogModel.deleteEmailLog(id_email);

        if (deleteLog === 0) {
            return res.status(404).json({ message: "Log non trouvé." })
        } else {
            return res.status(200).json({ message: "Suppression du log réussie", deleteLog });
        }
    } catch (error) {
        return res.status(500).json({ message: "Suppression du log impossible." });
    }
}

export default {
    getAllEmailLogs,
    getEmailLogById,
    createEmailLog,
    updateLog,
    deleteLog
}