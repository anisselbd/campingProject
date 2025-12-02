import {
    getAllTypes,
    getActiveTypes,
    getTypeById,
    getTypeByCode,
    createType,
    updateType,
    deleteType,
    deactivateType,
    activateType
} from '../models/typesHebergementModel.js';


const getAll = async (req, res) => {
    try {
        const types = await getAllTypes();
        res.status(200).json(types);
    } catch (error) {
        console.error('Erreur lors de la récupération des types:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const getActive = async (req, res) => {
    try {
        const types = await getActiveTypes();
        res.status(200).json(types);
    } catch (error) {
        console.error('Erreur lors de la récupération des types actifs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const type = await getTypeById(id);
        
        if (!type) {
            return res.status(404).json({ message: 'Type d\'hébergement non trouvé' });
        }
        
        res.status(200).json(type);
    } catch (error) {
        console.error('Erreur lors de la récupération du type:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const create = async (req, res) => {
    try {
        const { 
            nom, 
            code, 
            description, 
            capacite_max_par_defaut, 
            surface_moyenne, 
            actif 
        } = req.body;


        if (!nom || !code) {
            return res.status(400).json({ 
                message: 'Nom et code sont obligatoires' 
            });
        }


        const existingType = await getTypeByCode(code);
        if (existingType) {
            return res.status(409).json({ message: 'Ce code existe déjà' });
        }

        const typeId = await createType({
            nom,
            code,
            description,
            capacite_max_par_defaut,
            surface_moyenne,
            actif
        });

        res.status(201).json({ 
            message: 'Type d\'hébergement créé avec succès',
            typeId 
        });
    } catch (error) {
        console.error('Erreur lors de la création du type:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nom, 
            code, 
            description, 
            capacite_max_par_defaut, 
            surface_moyenne, 
            actif 
        } = req.body;


        const type = await getTypeById(id);
        if (!type) {
            return res.status(404).json({ message: 'Type d\'hébergement non trouvé' });
        }


        if (code && code !== type.code) {
            const existingType = await getTypeByCode(code);
            if (existingType) {
                return res.status(409).json({ message: 'Ce code existe déjà' });
            }
        }

        await updateType(id, {
            nom: nom ?? type.nom,
            code: code ?? type.code,
            description: description ?? type.description,
            capacite_max_par_defaut: capacite_max_par_defaut ?? type.capacite_max_par_defaut,
            surface_moyenne: surface_moyenne ?? type.surface_moyenne,
            actif: actif ?? type.actif
        });

        res.status(200).json({ message: 'Type d\'hébergement mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du type:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const type = await getTypeById(id);
        if (!type) {
            return res.status(404).json({ message: 'Type d\'hébergement non trouvé' });
        }

        await deleteType(id);
        res.status(200).json({ message: 'Type d\'hébergement supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du type:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ 
                message: 'Impossible de supprimer ce type, des hébergements y sont associés' 
            });
        }
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const deactivate = async (req, res) => {
    try {
        const { id } = req.params;

        const type = await getTypeById(id);
        if (!type) {
            return res.status(404).json({ message: 'Type d\'hébergement non trouvé' });
        }

        await deactivateType(id);
        res.status(200).json({ message: 'Type d\'hébergement désactivé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la désactivation du type:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const activate = async (req, res) => {
    try {
        const { id } = req.params;

        const type = await getTypeById(id);
        if (!type) {
            return res.status(404).json({ message: 'Type d\'hébergement non trouvé' });
        }

        await activateType(id);
        res.status(200).json({ message: 'Type d\'hébergement activé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'activation du type:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export {
    getAll,
    getActive,
    getById,
    create,
    update,
    remove,
    deactivate,
    activate
};
