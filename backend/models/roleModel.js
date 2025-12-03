import bdd from "../config/bdd.js";

const getAllRoles = async () => {
    const sql = "SELECT id_role, code_role, libelle, description FROM roles";
    const [rows] = await bdd.query(sql);
    return rows;
}

const getRoleById = async (id_role) => {
    const sql = "SELECT id_role, code_role, libelle, description FROM roles WHERE id_role = ?";
    const [rows] = await bdd.query(sql, [id_role]);
    return rows[0];
}

const createRole = async (code_role, libelle, description) => {
    const sql = "INSERT INTO roles (code_role, libelle, description) VALUES (?, ?, ?)";
    const [result] = await bdd.query(sql, [code_role, libelle, description]);
    return result.insertId;
}

const updateRole = async (id_role, code_role, libelle, description) => {
    const sql = "UPDATE roles SET code_role = ?, libelle = ?, description = ? WHERE id_role = ?";
    const [result] = await bdd.query(sql, [code_role, libelle, description, id_role]);
    return result.affectedRows;
}

const deleteRole = async (id_role) => {
    const sql = "DELETE FROM roles WHERE id_role = ?";
    const [result] = await bdd.query(sql, [id_role]);
    return result.affectedRows;
}

export default {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
}