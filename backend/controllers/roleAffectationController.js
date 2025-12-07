import roleAffectationModel from "../models/roleAffectationModel.js";
import dotenv from "dotenv";
dotenv.config();

const getAllRoleAffectations = async (req, res) => {
    try {
        const roleAffectations = await roleAffectationModel.getAllRoleAffectations();
        return res.status(200).json({ message: "Récupération des roles réussies.", roleAffectations });
    } catch (error) {
        console.log("Erreur lors de la récupération des roles", error);
        return res.status(500).json({ message: "Récupération des affectations des roles impossible." });
    }
}

const getAffectationById = async (req, res) => {
    try {
        const { id_affectation } = req.params;

        const affectation = await roleAffectationModel.getAffectationById(id_affectation);

        if (!affectation) {
            return res.status(404).json({ message: "Affectation non trouvée." });
        }

        return res.status(200).json({
            message: "Affectation via ID récupérée avec succès.",
            affectation
        });

    } catch (error) {
        console.log("Erreur lors de la récupération de l'affectation.", error);
        return res.status(500).json({ message: "Impossible de récupérer l'affectation." });
    }
};

const getRoleAffectationByUserIdByRoleId = async (req, res) => {
    try {
        const { user_id, role_id } = req.params;
        const roleAffectation = await roleAffectationModel.getRoleAffectationByUserIdByRoleId(user_id, role_id);

        if (!roleAffectation) {
            return res.status(404).json({ message: "Affectation de role non trouvé." });
        } else {
            return res.status(200).json({ message: "Récupération du role via son ID réussie", roleAffectation });
        }

    } catch (error) {
        console.log("Erreur lors de la récupération du role via son ID", error);
        return res.status(500).json({ message: "Récupération du role via son ID impossible." });
    }
}

const getRoleByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        const roleUserId = await roleAffectationModel.getRoleByUserId(user_id);

        if (!roleUserId || roleUserId.length === 0) {
            return res.status(404).json({ message: "Role de l'utilisateur non trouvé." });
        } else {
            return res.status(200).json({ message: "Récupération du role utilisateur via son ID réussie", roleUserId });
        }

    } catch (error) {
        console.log("Erreur lors de la récupération de l'utilisateur via son ID.");
        return res.status(500).json({ message: "Récupération du role utilisateur via son ID impossible." });
    }
}

const createAffectation = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;

        if (!user_id || !role_id) {
            return res.status(400).json({ message: "Les champs user_id, role_id sont obligatoires." });
        }

        if (!Number.isInteger(user_id) || !Number.isInteger(role_id)) {
            return res.status(400).json({ message: "user_id et role_id doivent être des entiers." });
        }

        const userExists = await roleAffectationModel.checkUserExists(user_id);
        if (!userExists) {
            return res.status(400).json({ message: "L'utilisateur spécifié n'existe pas." });
        }

        const roleExists = await roleAffectationModel.checkRoleExists(role_id);
        if (!roleExists) {
            return res.status(400).json({ message: "Le rôle spécifié n'existe pas." });
        }

        const affectationExists = await roleAffectationModel.checkAffectationExistsById(user_id, role_id);
        if (affectationExists) {
            return res.status(409).json({ message: "Cette affectation existe déjà." });
        }

        const result = await roleAffectationModel.createRoleAffectation(user_id, role_id);
        return res.status(201).json({ message: "Création de l'affectation réussie", result });

    } catch (error) {
        console.log("Erreur lors de la création de l'affectation.");
        return res.status(500).json({ message: "Création de l'affectation impossible.", error: error.message });
    }
}

const updateAffectation = async (req, res) => {
    try {
        const { id_affectation } = req.params;
        const { date_affectation } = req.body;

        const affectationExists = await roleAffectationModel.checkAffectationExistsById(id_affectation);
        if (!affectationExists) {
            return res.status(404).json({ message: "L'affectation spécifiée n'existe pas." });
        }

        const result = await roleAffectationModel.updateAffectation(id_affectation, date_affectation);


        if (result === 0) {
            return res.status(404).json({ message: "Aucune affectation de role trouvée." });
        } else {
            return res.status(200).json({ message: "Mise à jour de l'affectation réussie.", result });
        }

    } catch (error) {
        console.log("Erreur lors de la mise à jour de l'affectation.");
        return res.status(500).json({ message: "Mise à jour de l'affectation impossible." });
    }
}

const deleteRoleAffectation = async (req, res) => {
    try {
        const { id_affectation } = req.params;
        const deleteRoleAffectation = await roleAffectationModel.deleteRoleAffectation(id_affectation);

        if (deleteRoleAffectation === 0) {
            return res.status(404).json({ message: "Aucune affectation de role trouvée." });
        } else {
            return res.status(200).json({ message: "Suppression de l'affectation réussie.", deleteRoleAffectation });
        }
    } catch (error) {
        console.log("Erreur lors de la suppression de l'affectation.");
        return res.status(500).json({ message: "Suppression de l'affectation impossible." });
    }
}

export default {
    getAllRoleAffectations,
    getRoleByUserId,
    getAffectationById,
    getRoleAffectationByUserIdByRoleId,
    createAffectation,
    updateAffectation,
    deleteRoleAffectation
}