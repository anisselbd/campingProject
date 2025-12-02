import db from '../config/bdd.js';


const getAllTypes = async () => {
    const [rows] = await db.query(`
        SELECT id_type, nom, code, description, capacite_max_par_defaut, 
               surface_moyenne, actif 
        FROM accomodation_type
    `);
    return rows;
};


const getActiveTypes = async () => {
    const [rows] = await db.query(`
        SELECT id_type, nom, code, description, capacite_max_par_defaut, 
               surface_moyenne, actif 
        FROM accomodation_type 
        WHERE actif = 1
    `);
    return rows;
};


const getTypeById = async (id) => {
    const [rows] = await db.query(`
        SELECT id_type, nom, code, description, capacite_max_par_defaut, 
               surface_moyenne, actif 
        FROM accomodation_type WHERE id_type = ?
    `, [id]);
    return rows[0];
};


const getTypeByCode = async (code) => {
    const [rows] = await db.query(`
        SELECT id_type, nom, code, description, capacite_max_par_defaut, 
               surface_moyenne, actif 
        FROM accomodation_type WHERE code = ?
    `, [code]);
    return rows[0];
};


const createType = async (typeData) => {
    const { 
        nom, 
        code, 
        description, 
        capacite_max_par_defaut, 
        surface_moyenne, 
        actif 
    } = typeData;

    const [result] = await db.query(
        `INSERT INTO accomodation_type (
            nom, code, description, capacite_max_par_defaut, surface_moyenne, actif
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [nom, code, description, capacite_max_par_defaut, surface_moyenne, actif ?? 1]
    );
    return result.insertId;
};


const updateType = async (id, typeData) => {
    const { 
        nom, 
        code, 
        description, 
        capacite_max_par_defaut, 
        surface_moyenne, 
        actif 
    } = typeData;

    await db.query(
        `UPDATE accomodation_type SET 
            nom = ?, code = ?, description = ?, 
            capacite_max_par_defaut = ?, surface_moyenne = ?, actif = ?
        WHERE id_type = ?`,
        [nom, code, description, capacite_max_par_defaut, surface_moyenne, actif, id]
    );
};


const deleteType = async (id) => {
    await db.query('DELETE FROM accomodation_type WHERE id_type = ?', [id]);
};


const deactivateType = async (id) => {
    await db.query('UPDATE accomodation_type SET actif = 0 WHERE id_type = ?', [id]);
};


const activateType = async (id) => {
    await db.query('UPDATE accomodation_type SET actif = 1 WHERE id_type = ?', [id]);
};

export {
    getAllTypes,
    getActiveTypes,
    getTypeById,
    getTypeByCode,
    createType,
    updateType,
    deleteType,
    deactivateType,
    activateType
};
