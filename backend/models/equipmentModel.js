import bdd from "../config/bdd.js";

const getAllEquipments = async () => {
    const sql = `SELECT 
        id_equipment, 
        nom, 
        code, 
        description 
        FROM equipment`;
    const [rows] = await bdd.query(sql);
    return rows;
}

const getEquipmentById = async (id_equipment) => {
    const sql = `SELECT 
        id_equipment,
        nom,
        code,
        description
        FROM equipment
        WHERE id_equipment = ?`;
    const [rows] = await bdd.query(sql, [id_equipment]);
    return rows[0];
}

const getEquipmentByCode = async (code) => {
    const sql = `SELECT id_equipment FROM equipment WHERE code = ?`;
    const [rows] = await bdd.query(sql, [code]);
    return rows[0];
};


const checkEquipmentExist = async (id_equipment) => {
    const sql = `SELECT 1 FROM equipment WHERE id_equipment = ?`;
    const [rows] = await bdd.query(sql, [id_equipment]);
    return rows.length > 0;
};

const createEquipment = async (nom, code, description) => {
    const sql = `INSERT INTO equipment (nom, code, description) VALUES (?, ?, ?)`;
    const [result] = await bdd.query(sql, [nom, code, description]);
    return result.insertId;
}

const updateEquipment = async (id_equipment, nom, code, description) => {
    const sql = `UPDATE equipment SET  
        nom = ?, 
        code = ?, 
        description = ?
        WHERE id_equipment = ?`;
    const [result] = await bdd.query(sql, [nom, code, description, id_equipment]);
    return result.affectedRows;
}

const deleteEquipment = async (id_equipment) => {
    const sql = `DELETE FROM equipment
        WHERE id_equipment = ?`;
    const [result] = await bdd.query(sql, [id_equipment]);
    return result.affectedRows;
}

export default {
    getAllEquipments,
    getEquipmentById,
    getEquipmentByCode,
    checkEquipmentExist,
    createEquipment,
    updateEquipment,
    deleteEquipment
}