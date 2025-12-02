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
        SELECT id_hebergement, type_hebergement, reference_interne, nom_commercial, 
               description, capacite_max, surface_m2, localisation, reservable, 
               date_creation, date_desactivation 
        FROM accomodation 
        WHERE reservable = 1 AND date_desactivation IS NULL
    `);
    return rows;
};


const getHebergementById = async (id) => {
    const [rows] = await db.query(`
        SELECT id_hebergement, type_hebergement, reference_interne, nom_commercial, 
               description, capacite_max, surface_m2, localisation, reservable, 
               date_creation, date_desactivation 
        FROM accomodation WHERE id_hebergement = ?
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