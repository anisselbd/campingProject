import employeeShiftModel from "../models/employeeShiftModel.js";

const getAllEmployeeShift = async (req, res) => {
    try {
        const recupAllShifts = await employeeShiftModel.getAllEmployeeShift();
        return res.status(200).json({ message: "Récupération des shifts réussie", recupAllShifts });
    } catch (error) {
        return res.status(500).json({ message: "Récupération des shifts impossible." });
    }
}

const getEmployeeShiftById = async (req, res) => {
    try {
        const id_shift = req.params.id_shift;

        if (!id_shift) {
            return res.status(400).json({ message: "L'ID du shift est obligatoire." });
        }

        const recupOneShift = await employeeShiftModel.getEmployeeShiftById(id_shift);

        if (!recupOneShift) {
            return res.status(404).json({ message: "Shift non trouvé." });
        } else {
            return res.status(200).json({ message: "Récupération du shift via son ID réussie.", recupOneShift });
        }
    } catch (error) {
        return res.status(500).json({ message: "Récupération du shift via son ID impossible." });
    }
}

const createEmployeeShift = async (req, res) => {
    try {
        const { employee_id, debut, fin, commentaire } = req.body;

        if (!employee_id || !debut || !fin) {
            return res.status(400).json({ message: "Les champs employee_id, debut et fin sont obligatoires." });
        }

        const newShiftId = await employeeShiftModel.createEmployeeShift(employee_id, debut, fin, commentaire);

        if (!newShiftId) {
            return res.status(500).json({ message: "Impossible de créer le shift." });
        } else {
            return res.status(201).json({ message: "Shift créé avec succès.", newShiftId });
        }

    } catch (error) {
        return res.status(500).json({ message: "Création du shift impossible." });
    }
}

const updateEmployeeShift = async (req, res) => {
    try {
        const id_shift = req.params.id_shift;
        const { debut, fin, commentaire } = req.body;
        const updateEmployeeShift = await employeeShiftModel.updateEmployeeShift(id_shift, debut, fin, commentaire);

        if (updateEmployeeShift === 0) {
            return res.status(404).json({ message: "Mise à jour non possible car shift non trouvé." });
        } else {
            return res.status(200).json({ message: "Mise à jour du shift réussie.", updateEmployeeShift });
        }
    } catch (error) {
        return res.status(500).json({ message: "Mise à jour du shift impossible." });
    }
}

const deleteEmployeeShift = async (req, res) => {
    try {
        const id_shift = req.params.id_shift;
        const deleteEmployeeShift = await employeeShiftModel.deleteEmployeeShift(id_shift);

        if (deleteEmployeeShift === 0) {
            return res.status(404).json({ message: "Suppression non possible car shift non trouvé." });
        } else {
            return res.status(200).json({ message: "Suppression du shift réussie", deleteEmployeeShift });
        }
    } catch (error) {
        return res.status(500).json({ message: "Suppression du shift impossible." });
    }
}

export default {
    getAllEmployeeShift,
    getEmployeeShiftById,
    createEmployeeShift,
    updateEmployeeShift,
    deleteEmployeeShift
}