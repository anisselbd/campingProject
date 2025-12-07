import hebergementEquipementModel from "../models/hebergementEquipementModel.js";

const getAllEquipsByHebergement = async (req, res) => {
    try {
        const { hebergement_id } = req.params;
        const equipements = await hebergementEquipementModel.getAllEquipsByHebergement(hebergement_id);
        return res.status(200).json({ message: "Récupération des équipements pour un hébergement réussie.", equipements });

    } catch (error) {
        return res.status(500).json({ message: "Récupération des équipements pour un hébergement impossible." });
    }
}

const getHebergementsByEquipment = async (req, res) => {
    try {
        const { equipment_id } = req.params;
        const hebergements = await hebergementEquipementModel.getHebergementsByEquipment(equipment_id);
        return res.status(200).json({ message: "Récupération des hébergements réussie", hebergements });

    } catch (error) {
        return res.status(500).json({ message: "Récupération des hébergements impossible." });
    }
}

const createAccomodationEquipment = async (req, res) => {
    try {
        const { hebergement_id, equipment_id } = req.body;

        if (!hebergement_id || !equipment_id) {
            return res.status(400).json({ message: "Les champs hebergement_id et equipment_id sont obligatoires." });
        }

        const hebergementExists = await hebergementEquipementModel.checkHebergementExists(hebergement_id);
        if (!hebergementExists) {
            return res.status(404).json({ message: "L'hébergement spécifié n'existe pas." });
        }

        const equipmentExists = await hebergementEquipementModel.checkEquipmentExists(equipment_id);
        if (!equipmentExists) {
            return res.status(404).json({ message: "L'équipement spécifié n'existe pas." });
        }

        const associationExists = await hebergementEquipementModel.checkAssociationExists(hebergement_id, equipment_id);
        if (associationExists) {
            return res.status(409).json({ message: "Cette association existe déjà." });
        }

        const createAssociation = await hebergementEquipementModel.createAccomodationEquipment(hebergement_id, equipment_id);
        return res.status(201).json({ message: "Création ou Ajout d'un équipement à l'hébergement réussie.", createAssociation });

    } catch (error) {
        return res.status(500).json({ message: "Création ou Ajout de l'équipement à l'hébergement impossible." });
    }
}

const deleteAccomodationEquipment = async (req, res) => {
    try {
        const { hebergement_id, equipment_id } = req.params;
        const deleteAccomodationEquipment = await hebergementEquipementModel.deleteAccomodationEquipment(hebergement_id, equipment_id);

        if (deleteAccomodationEquipment === 0) {
            return res.status(404).json({ message: "Equipement associé non trouvé." });
        } else {
            return res.status(200).json({ message: "Équipement retiré de l'hébergement avec succès.", deleteAccomodationEquipment });
        }

    } catch (error) {
        return res.status(500).json({ message: "Suppression de l'équipement associé à l'hébergement impossible." });
    }
}

export default {
    getAllEquipsByHebergement,
    getHebergementsByEquipment,
    createAccomodationEquipment,
    deleteAccomodationEquipment
}