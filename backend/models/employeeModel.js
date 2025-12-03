import bdd from "../config/bdd.js";

const fetchAllEmployee = async () => {
    const sql = "SELECT id_employee, nom, prenom, role_interne, email FROM employee ";
    const [rows] = await bdd.query(sql);
    return rows;
}

const fetchAllEmployeeById = async (id_employee) => {
    const sql = "SELECT id_employee, nom, prenom, role_interne, email FROM employee WHERE id_employee = ? ";
    const [rows] = await bdd.query(sql, [id_employee]);
    return rows[0];
}

const createEmployee = async (nom, prenom, role_interne, email) => {
    const sql = "INSERT INTO employee (nom, prenom, role_interne, email) VALUES (?, ?, ?, ?);";
    const [result] = await bdd.query(sql, [nom, prenom, role_interne, email]);
    return result.insertId;
}

const updateEmployee = async (id_employee, nom, prenom, role_interne, email) => {
    const sql = "UPDATE employee SET nom = ?, prenom = ?, role_interne = ?, email = ? WHERE id_employee = ?;";
    const [result] = await bdd.query(sql, [nom, prenom, role_interne, email, id_employee]);
    return result.affectedRows;
}

const deleteEmployee = async (id_employee) => {
    const sql = "DELETE FROM employee WHERE id_employee = ?;";
    const [result] = await bdd.query(sql, [id_employee]);
    return result.affectedRows;
}

export default {
    fetchAllEmployee,
    fetchAllEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}

