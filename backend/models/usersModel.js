import db from '../config/bdd.js';
import bcrypt from 'bcryptjs';

const getAllUsers = async () => {
    const [rows] = await db.query(`
        SELECT id_user, email, prenom, nom, telephone, 
               adresse_ligne1, adresse_ligne2, code_postal, ville, pays, 
               type_compte, twofa_active, date_creation, derniere_connexion, 
               compte_actif, commentaire_interne 
        FROM users
    `);
    return rows;
};


const getUserById = async (id) => {
    const [rows] = await db.query(`
        SELECT id_user, email, password_hash, prenom, nom, telephone, 
               adresse_ligne1, adresse_ligne2, code_postal, ville, pays, 
               type_compte, twofa_active, date_creation, derniere_connexion, 
               compte_actif, commentaire_interne 
        FROM users WHERE id_user = ?
    `, [id]);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const [rows] = await db.query(`
        SELECT id_user, email, password_hash, prenom, nom, telephone, 
               adresse_ligne1, adresse_ligne2, code_postal, ville, pays, 
               type_compte, twofa_active, date_creation, derniere_connexion, 
               compte_actif, commentaire_interne 
        FROM users WHERE email = ?
    `, [email]);
    return rows[0];
};


const createUser = async (userData) => {
    const { 
        email, 
        password, 
        prenom, 
        nom, 
        telephone, 
        adresse_ligne1, 
        adresse_ligne2, 
        code_postal, 
        ville, 
        pays, 
        type_compte 
    } = userData;

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
        `INSERT INTO users (
            email, password_hash, prenom, nom, telephone, 
            adresse_ligne1, adresse_ligne2, code_postal, ville, pays, type_compte
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [email, password_hash, prenom, nom, telephone, adresse_ligne1, adresse_ligne2, code_postal, ville, pays, type_compte || 'user']
    );
    return result.insertId;
};

// Mettre à jour un utilisateur
const updateUser = async (id, userData) => {
    const { 
        email, 
        prenom, 
        nom, 
        telephone, 
        adresse_ligne1, 
        adresse_ligne2, 
        code_postal, 
        ville, 
        pays 
    } = userData;

    await db.query(
        `UPDATE users SET 
            email = ?, prenom = ?, nom = ?, telephone = ?, 
            adresse_ligne1 = ?, adresse_ligne2 = ?, code_postal = ?, ville = ?, pays = ?
        WHERE id_user = ?`,
        [email, prenom, nom, telephone, adresse_ligne1, adresse_ligne2, code_postal, ville, pays, id]
    );
};

// Mettre à jour le mot de passe
const updatePassword = async (id, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);
    
    await db.query('UPDATE users SET password_hash = ? WHERE id_user = ?', [password_hash, id]);
};

// Mettre à jour la dernière connexion
const updateLastLogin = async (id) => {
    await db.query('UPDATE users SET derniere_connexion = NOW() WHERE id_user = ?', [id]);
};

// Supprimer un utilisateur
const deleteUser = async (id) => {
    await db.query('DELETE FROM users WHERE id_user = ?', [id]);
};

// Désactiver un compte utilisateur
const deactivateUser = async (id) => {
    await db.query('UPDATE users SET compte_actif = 0 WHERE id_user = ?', [id]);
};

// Activer un compte utilisateur
const activateUser = async (id) => {
    await db.query('UPDATE users SET compte_actif = 1 WHERE id_user = ?', [id]);
};

// Vérifier le mot de passe
const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    updatePassword,
    updateLastLogin,
    deleteUser,
    deactivateUser,
    activateUser,
    verifyPassword
};