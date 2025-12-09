import roleModel from "../models/roleModel.js";
import dotenv from "dotenv";
dotenv.config();

const getAllRoles = async (req, res) => {
    try {
        const roles = await roleModel.getAllRoles();
        res.status(200).json({ roles });
    } catch (error) {
        res.status(500).json({ message: "Impossible de récupérer les roles." });
    }
}

const getRoleById = async (req, res) => {
    try {
        const id_role = req.params.id_role;
        const role = await roleModel.getRoleById(id_role);
        if (role) {
            res.status(200).json({ role });
        } else {
            res.status(404).json({ message: "Role non trouvé." });
        }
    } catch (error) {
        res.status(500).json({ message: "Impossible de récupérer l'utilisateur via son ID." });
    }
}

const createRole = async (req, res) => {

    try {
        const { id_role, code_role, libelle, description } = req.body;

        // 1. Validation des champs requis
        if (!code_role || !libelle || !description) {
            return res.status(400).json({
                message: "Les champs code_role, libelle et description sont obligatoires."
            });
        }

        // 2. Vérification de l'existence du rôle
        const existingRole = await roleModel.getRoleById(id_role);

        if (existingRole) {
            return res.status(409).json({
                message: `Le rôle avec l'ID ${id_role} existe déjà.`
            });
        }

        // 3. Création du rôle
        const roleId = await roleModel.createRole(code_role, libelle, description);

        if (!roleId) {
            return res.status(500).json({
                message: "Échec de la création du rôle."
            });
        }

        // 4. Réponse réussie
        res.status(201).json({ id_role: roleId });

    } catch (error) {
        res.status(500).json({
            message: "Une erreur est survenue lors de la création du rôle."
        });
    }
};



const updateRole = async (req, res) => {
    try {
        const id_role = req.params.id_role;
        const { code_role, libelle, description } = req.body;
        const affectedRows = await roleModel.updateRole(id_role, code_role, libelle, description);
        if (affectedRows === 0) {
            res.status(404).json({ message: "Aucune modification sur le role." })
        } else {
            res.status(200).json({ message: "Role mis à jour avec succès", affectedRows })
        }
    } catch (error) {
        res.status(500).json({ message: "Mise à jour du role impossible." })
    }
}

const deleteRole = async (req, res) => {
    try {
        const id_role = req.params.id_role;
        const affectedRows = await roleModel.deleteRole(id_role);
        if (affectedRows === 0) {
            res.status(404).json({ message: "Aucun role trouvé." })
        } else {
            res.status(200).json({ message: "Role supprimé avec succès.", affectedRows })
        }
    } catch (error) {
        res.status(500).json({ message: "Suppression du role impossible." })
    }
}




export default {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
}