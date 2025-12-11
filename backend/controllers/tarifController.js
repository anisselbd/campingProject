import tarifModel from "../models/tarifModel.js";

// Route publique - récupère tous les tarifs actifs pour affichage
const getPublicTarifs = async (req, res) => {
    try {
        const tarifs = await tarifModel.fetchAllTarif();
        res.status(200).json(tarifs);
    } catch (error) {
        console.error("Erreur getPublicTarifs:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des tarifs" });
    }
};

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

const calculatePrice = async (req, res) => {
    console.log("📊 calculatePrice appelé avec:", req.body);
    try {
        const { type_hebergement_id, date_arrivee, nb_personnes, nb_nuits } = req.body;

        if (!type_hebergement_id || !date_arrivee || !nb_personnes || !nb_nuits) {
            return res.status(400).json({
                message: "Paramètres requis: type_hebergement_id, date_arrivee, nb_personnes, nb_nuits"
            });
        }
        const tarif = await tarifModel.getTarifByTypeAndDate(type_hebergement_id, date_arrivee);
        if (!tarif) {
            return res.status(404).json({
                message: "Aucun tarif trouvé pour ce type d'hébergement et cette période"
            });
        }
        const personnes_extra = Math.max(0, nb_personnes - tarif.personnes_incluses);
        const prix_base = parseFloat(tarif.prix_par_nuit) * nb_nuits;
        const supplement_total = parseFloat(tarif.supplement_personne) * personnes_extra * nb_nuits;
        const prix_total = prix_base + supplement_total;
        const min_nuits_ok = nb_nuits >= tarif.min_nuits;

        res.status(200).json({
            saison: tarif.saison,
            saison_code: tarif.saison_code,
            type_hebergement: tarif.type_hebergement,
            personnes_incluses: tarif.personnes_incluses,
            personnes_extra: personnes_extra,
            prix_par_nuit: parseFloat(tarif.prix_par_nuit),
            supplement_personne: parseFloat(tarif.supplement_personne),
            nb_nuits: nb_nuits,
            prix_base: prix_base,
            supplement_total: supplement_total,
            prix_total: prix_total,
            min_nuits: tarif.min_nuits,
            min_nuits_ok: min_nuits_ok
        });

    } catch (error) {
        console.error("Erreur calculatePrice:", error);
        res.status(500).json({ message: "Erreur lors du calcul du prix" });
    }
};

export default {
    getPublicTarifs,
    getAllTarifs,
    getAllTarifsById,
    createTarif,
    updateTarif,
    deleteTarif,
    calculatePrice
}