import bdd from "../config/bdd.js";

const fetchAllTarif = async () => {
    const sql = `
    SELECT
    id_tarif,
    personnes_incluses,
    prix_par_nuit,
    supplement_personne,
    min_nuits,
    validite_debut,
    validite_fin,
    tarif.actif,
    accomodation_type.nom AS type_hebergement,
    season.nom AS saison
    FROM tarif
    INNER JOIN accomodation_type 
    ON accomodation_type.id_type = tarif.type_hebergement_id
    INNER JOIN season 
    ON season.id_saison = tarif.saison_id
    WHERE tarif.id_tarif = ?;
    `;
    const [rows] = await bdd.query(sql);
    return rows;
};

const fetchAllTarifById = async (id_tarif) => {
    const sql = `
    SELECT
    id_tarif,
    personnes_incluses,
    prix_par_nuit,
    supplement_personne,
    min_nuits,
    validite_debut,
    validite_fin,
    tarif.actif,
    accomodation_type.nom AS type_hebergement,
    season.nom AS saison
    FROM tarif
    INNER JOIN accomodation_type ON accomodation_type.id_type = tarif.type_hebergement_id
    INNER JOIN season ON season.id_saison = tarif.saison_id
    WHERE tarif.id_tarif = ?;
    `;
    const [rows] = await bdd.query(sql, [id_tarif]);
    return rows[0];
};



const createTarif = async (personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, type_hebergement_id, saison_id) => {
    const sql = `
    INSERT INTO tarif (personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, type_hebergement_id, saison_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    const [result] = await bdd.query(sql, [personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, type_hebergement_id, saison_id]);
    return result.insertId;
};


const updateTarif = async (id_tarif, type_hebergement_id, saison_id, personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, actif) => {
    const sql = `UPDATE tarif SET type_hebergement_id = ?, saison_id = ?, personnes_incluses = ?, prix_par_nuit = ?, supplement_personne = ?, min_nuits = ?, validite_debut = ?, validite_fin = ?, actif = ?
    WHERE id_tarif = ?;`;
    const [result] = await bdd.query(sql, [type_hebergement_id, saison_id, personnes_incluses, prix_par_nuit, supplement_personne, min_nuits, validite_debut, validite_fin, actif, id_tarif]);
    return result.affectedRows;
}

const deleteTarif = async (id_tarif) => {
    const sql = `DELETE FROM tarif WHERE id_tarif = ?;`;
    const [result] = await bdd.query(sql, [id_tarif]);
    return result.affectedRows;
}

export default {
    fetchAllTarif,
    fetchAllTarifById,
    createTarif,
    updateTarif,
    deleteTarif,
}





