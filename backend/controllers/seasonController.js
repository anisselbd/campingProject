import seasonModel from "../models/seasonModel.js";

const getAllSeasons = async (req, res) => {
    try {
        const seasons = await seasonModel.fetchAllSeasons();
        return res.status(200).json(seasons);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la récupération des saisons" });
    }
};

const getSeasonById = async (req, res) => {
    try {
        const id_saison = req.params.id_saison;
        const season = await seasonModel.fetchAllSeasonById(id_saison);

        if (!season) {
            return res.status(404).json({ message: "Saison non trouvée" });
        }

        return res.status(200).json(season);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération de la saison" });
    }
};

const createSeason = async (req, res) => {
    try {
        const { nom, code, date_debut, date_fin, description } = req.body;

        // Validation des champs
        if (!nom || !code || !date_debut || !date_fin || !description) {
            return res.status(400).json({ message: "nom, code, date_debut, date_fin et description sont requis" });
        }

        const insertedId = await seasonModel.createSeason(nom, code, date_debut, date_fin, description);

        return res.status(201).json({ message: "Saison créée avec succès", id: insertedId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur lors de la création de la saison" });
    }
};

const updateSeason = async (req, res) => {
    try {
        const id_saison = req.params.id_saison;
        const { nom, code, date_debut, date_fin, description } = req.body;

        const updated = await seasonModel.updateSeason(id_saison, nom, code, date_debut, date_fin, description);

        if (updated === 0) {
            return res.status(404).json({ message: "Saison non trouvée ou aucune modification effectuée" });
        }

        return res.status(200).json({ message: "Saison mise à jour avec succès" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la saison" });
    }
};

const deleteSeason = async (req, res) => {
    try {
        const id_saison = req.params.id_saison;

        const deleted = await seasonModel.deleteSeason(id_saison);

        if (deleted === 0) {
            return res.status(404).json({ message: "Saison non trouvée" });
        }

        return res.status(200).json({ message: "Saison supprimée avec succès" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur lors de la suppression de la saison" });
    }
};

export default {
    getAllSeasons,
    getSeasonById,
    createSeason,
    updateSeason,
    deleteSeason
};
