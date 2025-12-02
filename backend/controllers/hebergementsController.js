import {
    getAllHebergements,
    getAvailableHebergements,
    getHebergementById,
    getHebergementsByType,
    createHebergement,
    updateHebergement,
    deleteHebergement,
    deactivateHebergement,
    activateHebergement,
    setReservable
} from '../models/hebergementsModel.js';


const getAll = async (req, res) => {
    try {
        const hebergements = await getAllHebergements();
        res.status(200).json(hebergements);
    } catch (error) {
        console.error('Erreur lors de la récupération des hébergements:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const getAvailable = async (req, res) => {
    try {
        const hebergements = await getAvailableHebergements();
        res.status(200).json(hebergements);
    } catch (error) {
        console.error('Erreur lors de la récupération des hébergements disponibles:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const hebergement = await getHebergementById(id);
        
        if (!hebergement) {
            return res.status(404).json({ message: 'Hébergement non trouvé' });
        }
        
        res.status(200).json(hebergement);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'hébergement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const getByType = async (req, res) => {
    try {
        const { typeId } = req.params;
        const hebergements = await getHebergementsByType(typeId);
        res.status(200).json(hebergements);
    } catch (error) {
        console.error('Erreur lors de la récupération des hébergements par type:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const create = async (req, res) => {
    try {
        const { 
            type_hebergement, 
            reference_interne, 
            nom_commercial, 
            description, 
            capacite_max, 
            surface_m2, 
            localisation, 
            reservable 
        } = req.body;

        
        if (!type_hebergement || !reference_interne || !nom_commercial || !capacite_max) {
            return res.status(400).json({ 
                message: 'Type, référence interne, nom commercial et capacité max sont obligatoires' 
            });
        }

        const hebergementId = await createHebergement({
            type_hebergement,
            reference_interne,
            nom_commercial,
            description,
            capacite_max,
            surface_m2,
            localisation,
            reservable
        });

        res.status(201).json({ 
            message: 'Hébergement créé avec succès',
            hebergementId 
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'hébergement:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Cette référence interne existe déjà' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            type_hebergement, 
            reference_interne, 
            nom_commercial, 
            description, 
            capacite_max, 
            surface_m2, 
            localisation, 
            reservable 
        } = req.body;

        
        const hebergement = await getHebergementById(id);
        if (!hebergement) {
            return res.status(404).json({ message: 'Hébergement non trouvé' });
        }

        await updateHebergement(id, {
            type_hebergement: type_hebergement ?? hebergement.type_hebergement,
            reference_interne: reference_interne ?? hebergement.reference_interne,
            nom_commercial: nom_commercial ?? hebergement.nom_commercial,
            description: description ?? hebergement.description,
            capacite_max: capacite_max ?? hebergement.capacite_max,
            surface_m2: surface_m2 ?? hebergement.surface_m2,
            localisation: localisation ?? hebergement.localisation,
            reservable: reservable ?? hebergement.reservable
        });

        res.status(200).json({ message: 'Hébergement mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'hébergement:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Cette référence interne existe déjà' });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const hebergement = await getHebergementById(id);
        if (!hebergement) {
            return res.status(404).json({ message: 'Hébergement non trouvé' });
        }

        await deleteHebergement(id);
        res.status(200).json({ message: 'Hébergement supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'hébergement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const deactivate = async (req, res) => {
    try {
        const { id } = req.params;

        const hebergement = await getHebergementById(id);
        if (!hebergement) {
            return res.status(404).json({ message: 'Hébergement non trouvé' });
        }

        await deactivateHebergement(id);
        res.status(200).json({ message: 'Hébergement désactivé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la désactivation de l\'hébergement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const activate = async (req, res) => {
    try {
        const { id } = req.params;

        const hebergement = await getHebergementById(id);
        if (!hebergement) {
            return res.status(404).json({ message: 'Hébergement non trouvé' });
        }

        await activateHebergement(id);
        res.status(200).json({ message: 'Hébergement activé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'activation de l\'hébergement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const toggleReservable = async (req, res) => {
    try {
        const { id } = req.params;
        const { reservable } = req.body;

        const hebergement = await getHebergementById(id);
        if (!hebergement) {
            return res.status(404).json({ message: 'Hébergement non trouvé' });
        }

        await setReservable(id, reservable);
        res.status(200).json({ 
            message: reservable ? 'Hébergement maintenant réservable' : 'Hébergement non réservable' 
        });
    } catch (error) {
        console.error('Erreur lors du changement de statut:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export {
    getAll,
    getAvailable,
    getById,
    getByType,
    create,
    update,
    remove,
    deactivate,
    activate,
    toggleReservable
};
