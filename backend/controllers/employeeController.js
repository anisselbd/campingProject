import employeeModel from "../models/employeeModel.js";

const getAllEmployee = async (req, res) => {
    try {
        const employees = await employeeModel.fetchAllEmployee();
        res.status(200);
        res.json(employees);
    } catch (error) {
        console.error(error);

        res.status(500);
        res.json({ message: "Erreur lors de la récupération des employés." });
    }
}

const getAllEmployeeById = async (req, res) => {
    try {
        const id_employee = req.params.id_employee;
        const employee = await employeeModel.fetchAllEmployeeById(id_employee);

        if (employee) {
            res.status(200);
            res.json(employee);
        } else {
            res.status(404);
            res.json({ message: "Employé non trouvé." });
        }

    } catch (error) {
        res.status(200);
        res.json({ message: "Erreur du serveur lors de la récupération de l'employé." });

    }
}

const createEmployee = async (req, res) => {
    try {
        const id_employee = req.params.id_employee;
        const { nom, prenom, role_interne, email } = req.body;
        const createEmployee = await employeeModel.createEmployee(nom, prenom, role_interne, email);
        if (!nom || !prenom, !role_interne, !email) {
            res.status(400);
            res.json({ message: "le nom, prénom, rôle interne et email sont requis" });
        } else {
            res.status(201);
            res.json({ message: "Création d'un employé réussi.", createEmployee });
        }

        const existingEmployee = await employeeModel.fetchAllEmployeeById(id_employee);
        if (existingEmployee) {
            return res.status(409).json({ message: `L'employé ${id_employee} existe déjà` });
        }
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({ message: "Erreur du serveur lors de la création des employés" });
    }
}

const updateEmployee = async (req, res) => {
    try {
        const id_employee = req.params.id_employee;
        const { nom, prenom, role_interne, email } = req.body;
        const updateEmployee = await employeeModel.updateEmployee(id_employee, nom, prenom, role_interne, email);
        if (updateEmployee === 0) {
            res.status(404);
            res.json({ message: "Employé non trouvé ou pas de modification." });
        } else {
            res.status(200);
            res.json({ message: "Employé mis à jour avec succès." })
        }
    } catch (error) {
        res.status(500);
        res.json({ message: "Erreur du serveur lors de la mise à jour de l'employé." });
    }
}

const deleteEmployee = async (req, res) => {
    try {
        const id_employee = req.params.id_employee;
        const deleteEmployee = await employeeModel.deleteEmployee(id_employee);
        if (deleteEmployee === 0) {
            res.status(404).json({ message: "Employé non trouvé" });
        } else {

            res.status(200).json({ message: "Employé supprimé avec succès." });
        }
    } catch (error) {
        console.error(error);

        res.status(500);
        res.json({ message: "Erreur du serveur lors de la suppression de l'employé." });
    }
}

export default {
    getAllEmployee,
    getAllEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}