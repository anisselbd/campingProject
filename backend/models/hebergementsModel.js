import db from '../config/bdd.js';


const getAllHebergements = async () => {
    const [rows] = await db.query(`
        SELECT id_hebergement, type_hebergement, reference_interne, nom_commercial, 
               description, capacite_max, surface_m2, localisation, reservable, 
               date_creation, date_desactivation 
        FROM accomodation
    `);
    return rows;
};


const getAvailableHebergements = async () => {
    const [rows] = await db.query(`
        SELECT 
            a.id_hebergement, 
            a.type_hebergement AS type_hebergement_id,
            a.reference_interne, 
            a.nom_commercial,
            a.description, 
            a.capacite_max, 
            a.surface_m2, 
            a.localisation, 
            a.reservable,
            a.date_creation, 
            a.date_desactivation,
            at.nom AS type_hebergement
        FROM accomodation a
        LEFT JOIN accomodation_type at ON at.id_type = a.type_hebergement
        WHERE a.reservable = 1 AND a.date_desactivation IS NULL
    `);
    return rows;
};


const getHebergementById = async (id) => {
    const [rows] = await db.query(`
        SELECT 
            a.id_hebergement, 
            a.type_hebergement AS type_hebergement_id,
            a.reference_interne, 
            a.nom_commercial,
            a.description, 
            a.capacite_max, 
            a.surface_m2, 
            a.localisation, 
            a.reservable,
            a.date_creation, 
            a.date_desactivation,
            at.nom AS type_hebergement
        FROM accomodation a
        LEFT JOIN accomodation_type at ON at.id_type = a.type_hebergement
        WHERE a.id_hebergement = ?
    `, [id]);
    return rows[0];
};


const getHebergementsByType = async (typeId) => {
    const [rows] = await db.query(`
        SELECT id_hebergement, type_hebergement, reference_interne, nom_commercial, 
               description, capacite_max, surface_m2, localisation, reservable, 
               date_creation, date_desactivation 
        FROM accomodation WHERE type_hebergement = ?
    `, [typeId]);
    return rows;
};


const createHebergement = async (hebergementData) => {
    const {
        type_hebergement,
        reference_interne,
        nom_commercial,
        description,
        capacite_max,
        surface_m2,
        localisation,
        reservable
    } = hebergementData;

    const [result] = await db.query(
        `INSERT INTO accomodation (
            type_hebergement, reference_interne, nom_commercial, description, 
            capacite_max, surface_m2, localisation, reservable
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [type_hebergement, reference_interne, nom_commercial, description, capacite_max, surface_m2, localisation, reservable ?? 1]
    );
    return result.insertId;
};


const updateHebergement = async (id, hebergementData) => {
    const {
        type_hebergement,
        reference_interne,
        nom_commercial,
        description,
        capacite_max,
        surface_m2,
        localisation,
        reservable
    } = hebergementData;

    await db.query(
        `UPDATE accomodation SET 
            type_hebergement = ?, reference_interne = ?, nom_commercial = ?, 
            description = ?, capacite_max = ?, surface_m2 = ?, localisation = ?, reservable = ?
        WHERE id_hebergement = ?`,
        [type_hebergement, reference_interne, nom_commercial, description, capacite_max, surface_m2, localisation, reservable, id]
    );
};


const deleteHebergement = async (id) => {
    await db.query('DELETE FROM accomodation WHERE id_hebergement = ?', [id]);
};


const deactivateHebergement = async (id) => {
    await db.query('UPDATE accomodation SET date_desactivation = NOW(), reservable = 0 WHERE id_hebergement = ?', [id]);
};


const activateHebergement = async (id) => {
    await db.query('UPDATE accomodation SET date_desactivation = NULL, reservable = 1 WHERE id_hebergement = ?', [id]);
};


const setReservable = async (id, reservable) => {
    await db.query('UPDATE accomodation SET reservable = ? WHERE id_hebergement = ?', [reservable ? 1 : 0, id]);
};

export {
    getAllHebergements,
    getAvailableHebergements,
    getHebergementById,
    getHebergementsByType,
    createHebergement,
    updateHebergement,
    deleteHebergement,
    deactivateHebergement,
    activateHebergement,
    setReservable
};