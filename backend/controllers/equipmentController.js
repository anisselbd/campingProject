import equipmentModel from "../models/equipmentModel.js";
import dotenv from "dotenv";
dotenv.config();

const getAllEquipments = async (req, res) => {
    try {
        const recupEquipments = await equipmentModel.getAllEquipments();
        return res.status(200).json({ message: "Récupération des équipements réussie", recupEquipments });
    } catch (error) {
        return res.status(500).json({ message: "Récupération des équipements impossible." });
    }
}

const getEquipmentById = async (req, res) => {
    try {
        const { id_equipment } = req.params;
        const recupEquipment = await equipmentModel.getEquipmentById(id_equipment);

        if (!recupEquipment) {
            return res.status(404).json({ message: "Equipement non trouvé." });
        } else {
            return res.status(200).json({ message: "Récupération de l'équipement via son ID réussie.", recupEquipment });
        }
    } catch (error) {
        return res.status(500).json({ message: "Récupération de l'équipement via son ID impossible." });
    }
}

const createEquipment = async (req, res) => {
    try {
        const { nom, code, description } = req.body;

        if (!nom || !code || !description) {
            return res.status(400).json({ message: "Les champs nom, code et description sont obligatoires." });
        }

        const createEquipment = await equipmentModel.createEquipment(nom, code, description);
        return res.status(201).json({ message: "Création ou Ajout de l'équipement réussie.", createEquipment });

    } catch (error) {
        return res.status(500).json({ message: "Création ou Ajout de l'équipement impossible." });
    }
}

const updateEquipment = async (req, res) => {
    try {
        const { id_equipment } = req.params;
        const { nom, code, description } = req.body;

        const equipmentNoExist = await equipmentModel.checkEquipmentExist(id_equipment);
        if (!equipmentNoExist) {
            return res.status(400).json({ message: "L'équipement spécifié n'existe pas." });
        }

        const updateEquipment = await equipmentModel.updateEquipment(id_equipment, nom, code, description);

        if (updateEquipment === 0) {
            return res.status(404).json({ message: "Equipement non trouvé." });
        } else {
            return res.status(200).json({ message: "Mise à jour de l'équipement réussie", updateEquipment });
        }

    } catch (error) {
        return res.status(500).json({ message: "Mise à jour de l'équipement impossible." });
    }
}

const deleteEquipment = async (req, res) => {
    try {
        const { id_equipment } = req.params;
        const deleteEquipment = await equipmentModel.deleteEquipment(id_equipment);

        if (deleteEquipment === 0) {
            return res.status(404).json({ message: "Equipement non trouvé." });
        } else {
            return res.status(200).json({ message: "Suppression de l'équipement réussie.", deleteEquipment });
        }
    } catch (error) {
        return res.status(500).json({ message: "Suppression de l'équipement impossible." });
    }
}

export default {
    getAllEquipments,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
}