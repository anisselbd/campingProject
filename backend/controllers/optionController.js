import optionModel from "../models/optionModel.js"

const createOption = async (req, res) => {
    const {
        nom,
        code,
        type_tarification,
        description,
        prix,
        actif
    } = req.body;

    if (!nom || !code || !type_tarification || prix === undefined) {
        return res.status(400).json({ message: "Les champs Nom, Code, Type de tarification et Prix sont requis." });
    }


    try {
        const optionId = await optionModel.createOption(
            nom,
            code,
            type_tarification,
            description,
            prix,
            actif
        );
        return res.status(201).json({
            message: "Option créée avec succès",
            id_option: optionId
        });


    } catch (error) {
        console.error("Erreur lors de la création de l'option:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de création de l'option." });

    }
}

const getAllOptions = async (req, res) => {
    try {
        const options = await optionModel.getAllOptions();
        return res.status(200).json({ message: "Options récupérées avec succès" });
    } catch (error) {
        console.error("Erreur lors de la récupération des options:", error)
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de récupération des options." });

    }
}

const getOptionById = async (req, res) => {
    const id = req.params.id_option;
    try {
        const option = await optionModel.getOptionById(id);
        if (!option) {
            return res.status(404).json({ message: "Option non trouvée" });
        }
        return res.status(200).json({ message: "Option trouvée", option });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'option:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de récupération de l'option." })
    }
}

const updateOption = async (req, res) => {
    const id = req.params.id_option;
    const new_data = req.body;



    try {
        const originalOption = await optionModel.getOptionById(id);
        if (!originalOption) {
            return res.status(404).json({ message: "L'option à modifier n'a pas été trouvée." });
        }
        const updatedData = { //per risolvere il problema null
            ...originalOption,
            ...new_data
        };
        const affectedRows = await optionModel.updateOption(
            id,
            updatedData.nom,
            updatedData.code,
            updatedData.type_tarification,
            updatedData.description,
            updatedData.prix,
            updatedData.actif
        );
        if (affectedRows > 0)
            return res.status(200).json({ message: "Option mise à jour avec succès" });
        else {
            return res.status(200).json({ message: "Aucun changement effectué ou option déjà à jour." })
        };



    } catch (error) {
        console.error("Erreur lors de la récupération de l'option:", error);
        return res.status(500).json({ message: "erreur serveur lors de la tentative de récupération de l'option." })
    }


}

const deleteOption = async (req, res) => {
    const id = req.params.id_option;
    try {
        const affectedRows = await optionModel.deleteOption(id);
        if (affectedRows===0) {
            return res.status(404).json({ message: "L'option à supprimer n'a pas été trouvée." });
        }
        return res.status(200).json({ message: "Option supprimée avec succès" });

    } catch (error) {
        console.error("Erreur lors de la récupération de l'option:", error);
        return res.status(500).json({message:"ereur serveur lors de la tentative de supprimer de l'option."})

    }
}

    export default {
        createOption,
        getAllOptions,
        getOptionById,
        updateOption,
        deleteOption
    
    }