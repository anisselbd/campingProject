import bdd from "../config/bdd.js";

const fetchAllSeasons = async () => {
    const sql = `SELECT id_saison, nom, code, date_debut, date_fin, description FROM season
    INNER JOIN tarif ON tarif.saison_id = season.id_saison;`; 
    const [rows] = await bdd.query(sql);
    return rows;
}

const fetchAllSeasonById = async (id_saison) => {
    const sql = `SELECT id_saison, nom, code, date_debut, date_fin, description FROM season WHERE id_saison = ?
    INNER JOIN tarif ON tarif.saison_id = season.id_saison;`;
    const [rows] = await bdd.query(sql, [id_saison]);
    return rows[0];
}

const createSeason = async (nom, code, date_debut, date_fin, description) => {
    const sql = "INSERT INTO season (nom, code, date_debut, date_fin, description) VALUES (?, ?, ?, ?, ?);";
    const [result] = await bdd.query(sql, [
        nom,
        code,
        date_debut,
        date_fin,
        description]);

    return result.insertId;
}

const updateSeason = async (id_saison, nom, code, date_debut, date_fin, description) => {
    const sql = "UPDATE season SET nom = ?, code = ?, date_debut = ?, date_fin = ?, description = ? WHERE id_saison = ?;";
    const [result] = await bdd.query(sql, [
        nom,
        code,
        date_debut,
        date_fin,
        description,
        id_saison]);

    return result.affectedRows;
}

const deleteSeason = async (id_saison) => {
    const sql = "DELETE FROM season WHERE id_saison = ?;";
    const [result] = await bdd.query(sql, [id_saison]);
    return result.affectedRows;
}

export default {
    fetchAllSeasons,
    fetchAllSeasonById,
    createSeason,
    updateSeason,
    deleteSeason
}