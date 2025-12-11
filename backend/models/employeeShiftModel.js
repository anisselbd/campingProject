import bdd from "../config/bdd.js";

const getAllEmployeeShift = async () => {
    const sql = `SELECT id_shift, debut, fin, commentaire, employee_shift.employee_id, nom, prenom, email
        FROM employee_shift
        INNER JOIN employee ON employee_shift.employee_id = employee.id_employee`;
    const [rows] = await bdd.query(sql);
    return rows;
}

const getEmployeeShiftById = async (id_shift) => {
    const sql = `SELECT id_shift, employee_id, debut, fin, commentaire
        FROM employee_shift
        WHERE id_shift = ?`;
    const [rows] = await bdd.query(sql, [id_shift]);
    return rows[0];
}

const createEmployeeShift = async (employee_id, debut, fin, commentaire) => {
    const sql = `INSERT INTO employee_shift (employee_id, debut, fin, commentaire) VALUES (?, ?, ?, ?)`;
    const [result] = await bdd.query(sql, [employee_id, debut, fin, commentaire]);
    return result.insertId;
}

const updateEmployeeShift = async (id_shift, debut, fin, commentaire) => {
    const sql = `UPDATE employee_shift SET debut = ?, fin = ?, commentaire = ? 
        WHERE id_shift = ?`;
    const [result] = await bdd.query(sql, [debut, fin, commentaire, id_shift]);
    return result.affectedRows;
}

const deleteEmployeeShift = async (id_shift) => {
    const sql = `DELETE FROM employee_shift WHERE id_shift = ?`;
    const [result] = await bdd.query(sql, [id_shift]);
    return result.affectedRows;
}

export default {
    getAllEmployeeShift,
    getEmployeeShiftById,
    createEmployeeShift,
    updateEmployeeShift,
    deleteEmployeeShift
}