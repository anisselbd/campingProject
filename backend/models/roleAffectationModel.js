import bdd from "../config/bdd.js";

const getAllRoleAffectations = async () => {
    const sql = `SELECT
    user_role.id_affectation, 
    user_role.user_id, 
    user_role.role_id, 
    user_role.date_affectation, 
    users.email AS users_email,
    code_role AS roles_code_role
    FROM user_role
  INNER JOIN users ON user_role.user_id = users.id_user
  INNER JOIN roles ON user_role.role_id = roles.id_role`;
    const [rows] = await bdd.query(sql);
    return rows;
};

const getRoleAffectationByUserIdByRoleId = async (user_id, role_id) => {
    const sql = `SELECT 
        user_role.id_affectation,
        user_role.user_id, 
        user_role.role_id, 
        user_role.date_affectation, 
        users.email AS users_email,
        code_role AS roles_code_role
        FROM user_role
            INNER JOIN users ON user_role.user_id = users.id_user
            INNER JOIN roles ON user_role.role_id = roles.id_role
            WHERE user_role.user_id = ? AND user_role.role_id = ?`;
    const [rows] = await bdd.query(sql, [user_id, role_id]);
    return rows[0];
};

const getRoleByUserId = async (user_id) => {
    const sql = `SELECT
        user_role.id_affectation, 
        user_role.role_id, 
        roles.code_role AS role_code_role,
        roles.libelle AS role_nom, 
        user_role.date_affectation
        FROM user_role
        INNER JOIN roles ON user_role.role_id = roles.id_role
        WHERE user_role.user_id = ?`;
    const [rows] = await bdd.query(sql, [user_id]);
    return rows;
};

const getAffectationById = async (id_affectation) => {
    const sql = `
        SELECT 
            user_role.id_affectation,
            user_role.user_id,
            user_role.role_id,
            user_role.date_affectation,
            users.email AS users_email,
            code_role AS roles_code_role
        FROM user_role
        INNER JOIN users ON user_role.user_id = users.id_user
        INNER JOIN roles ON user_role.role_id = roles.id_role
        WHERE user_role.id_affectation = ?
    `;
    const [rows] = await bdd.query(sql, [id_affectation]);
    return rows[0];
};

const checkUserExists = async (user_id) => {
    const sql = `SELECT 1 FROM users WHERE id_user = ?`;
    const [rows] = await bdd.query(sql, [user_id]);
    return rows.length > 0;
};

const checkRoleExists = async (role_id) => {
    const sql = `SELECT 1 FROM roles WHERE id_role = ?`;
    const [rows] = await bdd.query(sql, [role_id]);
    return rows.length > 0;
};

const checkAffectationExistsById = async (id_affectation) => {
    const sql = `SELECT 1 FROM user_role WHERE id_affectation = ?`;
    const [rows] = await bdd.query(sql, [id_affectation]);
    return rows.length > 0;
};

const createRoleAffectation = async (user_id, role_id) => {
    const sql = `INSERT INTO user_role (user_id, role_id) VALUES (?, ?)`;
    const [result] = await bdd.query(sql, [user_id, role_id]);
    return result.insertId;
};

const updateAffectation = async (id_affectation, date_affectation) => {
    const sql = `UPDATE user_role SET date_affectation = ? WHERE id_affectation = ?`;
    const [result] = await bdd.query(sql, [date_affectation, id_affectation]);
    return result.affectedRows;
};

const deleteRoleAffectation = async (id_affectation) => {
    const sql = `DELETE FROM user_role WHERE id_affectation = ?`;
    const [result] = await bdd.query(sql, [id_affectation]);
    return result.affectedRows;
};











export default {
    getAllRoleAffectations,
    getRoleAffectationByUserIdByRoleId,
    getRoleByUserId,
    getAffectationById,
    checkUserExists,
    checkRoleExists,
    checkAffectationExistsById,
    createRoleAffectation,
    updateAffectation,
    deleteRoleAffectation
}