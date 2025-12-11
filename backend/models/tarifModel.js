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
    ON season.id_saison = tarif.saison_id;
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

// Récupère le tarif applicable pour un type d'hébergement et une date
const getTarifByTypeAndDate = async (type_hebergement_id, date) => {
    // D'abord essayer de trouver un tarif correspondant au mois
    const sqlExact = `
        SELECT 
            t.id_tarif,
            t.personnes_incluses,
            t.prix_par_nuit,
            t.supplement_personne,
            t.min_nuits,
            s.nom AS saison,
            s.code AS saison_code,
            at.nom AS type_hebergement
        FROM tarif t
        INNER JOIN season s ON s.id_saison = t.saison_id
        INNER JOIN accomodation_type at ON at.id_type = t.type_hebergement_id
        WHERE t.type_hebergement_id = ?
          AND t.actif = 1
          AND MONTH(?) BETWEEN MONTH(s.date_debut) AND MONTH(s.date_fin)
        ORDER BY t.prix_par_nuit DESC
        LIMIT 1;
    `;

    let [rows] = await bdd.query(sqlExact, [type_hebergement_id, date]);

    // Fallback: si aucun tarif trouvé, prendre le tarif basse saison (prix le plus bas)
    if (!rows[0]) {
        console.log("⚠️ Aucune saison trouvée pour ce mois, utilisation du tarif par défaut");
        const sqlFallback = `
            SELECT 
                t.id_tarif,
                t.personnes_incluses,
                t.prix_par_nuit,
                t.supplement_personne,
                t.min_nuits,
                s.nom AS saison,
                s.code AS saison_code,
                at.nom AS type_hebergement
            FROM tarif t
            INNER JOIN season s ON s.id_saison = t.saison_id
            INNER JOIN accomodation_type at ON at.id_type = t.type_hebergement_id
            WHERE t.type_hebergement_id = ?
              AND t.actif = 1
            ORDER BY t.prix_par_nuit ASC
            LIMIT 1;
        `;
        [rows] = await bdd.query(sqlFallback, [type_hebergement_id]);
    }

    return rows[0];
};

export default {
    fetchAllTarif,
    fetchAllTarifById,
    createTarif,
    updateTarif,
    deleteTarif,
    getTarifByTypeAndDate,
}





