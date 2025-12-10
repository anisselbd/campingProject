import bdd from "../config/bdd.js";



const addOptionToStay = async (sejour_id, option_id, quantite, total_option) => {
    const sql = `
    INSERT INTO stay_option (
        sejour_id,
        option_id,
        quantite,
        total_option
    )
    VALUES (?, ?, ?, ?);
    `;
    const [result] = await bdd.query(sql, [
        sejour_id,
        option_id,
        quantite,
        total_option
    ]);
    return result.insertId;
}

const getOptionsByStayId = async (sejour_id) => {
    const sql = `
    SELECT 
    os.nom,
    os.code,
    os.description,
    os.type_tarification,
    os.prix AS prix_unitaire,
    so.quantite,
    so.total_option,
    so.id_stay_option
    FROM option_service AS os
    INNER JOIN stay_option AS so ON os.id_option = so.option_id
    WHERE so.sejour_id = ?;
   
    `;
    const [row] = await bdd.query(sql, [sejour_id]);
    return row;
}

const getStayOptionById = async (id_stay_option) => {//jai modifiè le nome de id_stay_option, en id_stayoption
    const sql = `
    SELECT total_option, sejour_id
    FROM stay_option
    WHERE id_stayoption = ?; 
    `;
    const [row] = await bdd.query(sql, [id_stay_option]);
    return row[0];


}

const deleteStayOption = async (id_stay_option) => {
    const sql = `
    DELETE FROM stay_option
    WHERE id_stayoption = ?;
    `;
    const [result] = await bdd.query(sql, [id_stay_option]);
    return result.affectedRows;
}





export default {
    addOptionToStay,
    getOptionsByStayId,
    getStayOptionById,
    deleteStayOption

}