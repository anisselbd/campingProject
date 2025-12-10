import tarifModel from "../models/tarifModel.js";

const getAllTarifs = async (req, res) => {
    try {
        const tarifs = await tarifModel.fetchAllTarif()
        res.status(200);
        res.json(tarifs);
    } catch (error) {
        res.status(500);
        res.json({ message: "Erreur du serveur lors de la récupératon des tarifs" });
    }
}

const getAllTarifsById = async (req, res) => {
    try {
        const id_tarif = req.params.id_tarif;
        const tarif = await tarifModel.fetchAllTarifById(id_tarif);
        console.log(tarif);
        if (!tarif) {
            res.status(404);
            res.json({ message: "tarif non trouvé" });
        } else {
            res.status(200);
            res.json({ message: "récupération du tarif via son id réussie", tarif });
        }
    } catch (error) {
        res.status(500);
        res.json({ message: "erreur du serveur lors de la récupération du tarif" });
    }
}

const createTarif = async (req, res) => {
    try {
        const { personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, type_hebergement_id, saison_id } = req.body;
        if (!personnes_incluses || !prix_par_nuit || !supplement_personne || !min_nuits || !validite_debut || !validite_fin || !type_hebergement_id || !saison_id) {
            res.status(400);
            res.json({ message: "Les personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin sont requis" });
        }

        const addTarif = await tarifModel.createTarif(personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, type_hebergement_id, saison_id)
        if (!addTarif) {
            return res.status(500).json({ message: "Impossible de créer un tarif" });
        } else {
            return res.status(201).json({ message: "création du tarif réussi", addTarif });
        }
    } catch (error) {
        res.status(404)
        res.json({ message: "Erreur du serveur lors de la création des tarifs" });
        console.log(error);
    }
}

const updateTarif = async (req, res) => {
    try {
        const id_tarif = req.params.id_tarif;
        const { type_hebergement_id, saison_id, personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, actif } = req.body;
        const updateTarif = await tarifModel.updateTarif(id_tarif, type_hebergement_id, saison_id, personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, actif);
        if (updateTarif === 0) {
            res.status(404);
            res.json({ message: "tarif non trouvé ou pas de modification" });
        } else {
            res.status(200);
            res.json({ message: "tarif mis à jour avec succès", updateTarif });
        }
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json({ message: "Erreur du serveur lors de la mise à jour du tarif" });
    }
};


const deleteTarif = async (req, res) => {
    try {
        const id_tarif = req.params.id_tarif;
        const deleteTarif = await tarifModel.deleteTarif(id_tarif);
        if (deleteTarif === 0) {
            res.status(404);
            res.json({ message: "Tarif non trouvé" });
        } else {
            res.status(200);
            res.json({ message: "Tarif supprimé avec succès" });
        }
    } catch (error) {
        res.status(500);
        res.json({ message: "Erreur du serveur lors de la suppression du tarif" });
    }
}

export default {
    getAllTarifs,
    getAllTarifsById,
    createTarif,
    updateTarif,
    deleteTarif
}