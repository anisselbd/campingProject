import bdd from "../config/bdd.js";

const getAllEquipsByHebergement = async (hebergement_id) => {
    const sql = `SELECT equipment.* 
        FROM equipment
        INNER JOIN accomodation_equipment ON id_equipment = accomodation_equipment.equipment_id
        WHERE accomodation_equipment.hebergement_id = ?`;
    const [rows] = await bdd.query(sql, [hebergement_id]);
    return rows;
}

const getHebergementsByEquipment = async (equipment_id) => {
    const sql = `SELECT accomodation.*
        FROM accomodation
        INNER JOIN accomodation_equipment ON accomodation.id_hebergement = accomodation_equipment.hebergement_id
        WHERE accomodation_equipment.equipment_id = ?`;
    const [rows] = await bdd.query(sql, [equipment_id]);
    return rows;
}

const createAccomodationEquipment = async (hebergement_id, equipment_id) => {
    const sql = `INSERT INTO accomodation_equipment (hebergement_id, equipment_id) VALUES (?, ?)`;
    const [result] = await bdd.query(sql, [hebergement_id, equipment_id]);
    return result.affectedRows;
}

const deleteAccomodationEquipment = async (hebergement_id, equipment_id) => {
    const sql = `DELETE FROM accomodation_equipment WHERE hebergement_id = ? AND equipment_id = ?`;
    const [result] = await bdd.query(sql, [hebergement_id, equipment_id]);
    return result.affectedRows;
}

const checkHebergementExists = async (hebergement_id) => {
    const sql = `SELECT 1 FROM accomodation WHERE id_hebergement = ?`;
    const [rows] = await bdd.query(sql, [hebergement_id]);
    return rows.length > 0;
};

const checkEquipmentExists = async (equipment_id) => {
    const sql = `SELECT 1 FROM equipment WHERE id_equipment = ?`;
    const [rows] = await bdd.query(sql, [equipment_id]);
    return rows.length > 0;
};

const checkAssociationExists = async (hebergement_id, equipment_id) => {
    const sql = `
        SELECT 1
        FROM accomodation_equipment
        WHERE hebergement_id = ? AND equipment_id = ?
    `;
    const [rows] = await bdd.query(sql, [hebergement_id, equipment_id]);
    return rows.length > 0;
}

export default {
    getAllEquipsByHebergement,
    getHebergementsByEquipment,
    createAccomodationEquipment,
    deleteAccomodationEquipment,
    checkHebergementExists,
    checkEquipmentExists,
    checkAssociationExists
}