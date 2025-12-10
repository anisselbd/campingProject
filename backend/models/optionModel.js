import bdd from "../config/bdd.js";


const createOption = async (
    nom,
    code,
    type_tarification,
    description,
    prix,
    actif
) => {

    const sql = `
    INSERT INTO option_service (
        nom,
        code,
        type_tarification,
        description,
        prix,
        actif
    )
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const [result] = await bdd.query(sql, [
        nom,
        code,
        type_tarification,
        description,
        prix,
        actif
    ]);

    return result.insertId;


}

const getAllOptions = async () => {
    const sql = `
    SELECT * FROM option_service;
    `;
    const [rows] = await bdd.query(sql);
    return rows;
};

const getOptionById = async (id) => {
    const sql = `
    SELECT * FROM option_service WHERE id_option = ?;
    `;
    const [row] = await bdd.query(sql, [id]);
    return row[0];
};

const updateOption = async (
    id,
    nom,
    code,
    type_tarification,
    description,
    prix,
    actif
) => {
    const sql = `
    UPDATE option_service
    SET nom = ?,
        code = ?,
        type_tarification = ?,
        description = ?,
        prix = ?,
        actif = ?
    WHERE id_option = ?;
    `;
    const [result] = await bdd.query(sql, [

        nom,
        code,
        type_tarification,
        description,
        prix,
        actif,
        id

    ]);
    return result.affectedRows;

}

const deleteOption = async (id) => {
    const sql = `
    DELETE FROM option_service WHERE id_option = ?;
    `;
    const [result] = await bdd.query(sql, [id]);
    return result.affectedRows;
}








export default {
    createOption,
    getAllOptions,
    getOptionById,
    updateOption,
    deleteOption

}


