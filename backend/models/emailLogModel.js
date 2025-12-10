import bdd from "../config/bdd.js";

const getAllEmailLogs = async () => {
    const sql = `SELECT email_log.id_email, email_log.type_email, email_log.destinataire, email_log.sujet,
     email_log.statut, email_log.message_erreur, email_log.envoye_le
     FROM email_log
     INNER JOIN users ON email_log.utilisateur_id = users.id_user
     LEFT JOIN booking ON email_log.reservation_id = booking.id_reservation `;
    const [rows] = await bdd.query(sql);
    return rows;
}

const getEmailLogById = async (id_email) => {
    const sql = `SELECT id_email, email_log.type_email, email_log.destinataire, email_log.sujet, email_log.statut,
     email_log.message_erreur, email_log.envoye_le
 FROM email_log
 LEFT JOIN users ON email_log.utilisateur_id = users.id_user
 LEFT JOIN booking ON email_log.reservation_id = booking.id_reservation
 WHERE email_log.id_email = ?`;
    console.log("ID recherché dans le modèle :", id_email);
    const [rows] = await bdd.query(sql, [id_email]);
    console.log("Résultat de la requête SQL :", rows);
    return rows[0];
}

const createEmailLog = async (type_email, destinataire, sujet, statut, message_erreur, envoye_le) => {
    const sql = `INSERT INTO email_log (type_email, destinataire, sujet, statut, message_erreur, envoye_le)
    VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await bdd.query(sql, [type_email, destinataire, sujet, statut, message_erreur, envoye_le]);
    return result.insertId;
}

const updateEmailLog = async (id_email, type_email, destinataire, sujet, statut, message_erreur, envoye_le) => {
    const sql = `UPDATE email_log SET type_email = ?, destinataire = ?, sujet = ?, statut = ?, 
    message_erreur = ?, envoye_le = ? WHERE id_email = ?`;
    const [result] = await bdd.query(sql, [type_email, destinataire, sujet, statut, message_erreur, envoye_le, id_email]);
    return result.affectedRows;
}

const deleteEmailLog = async (id_email) => {
    const sql = `DELETE FROM email_log WHERE id_email = ?`;
    const [result] = await bdd.query(sql, [id_email]);
    return result.affectedRows;
}

export default {
    getAllEmailLogs,
    getEmailLogById,
    createEmailLog,
    updateEmailLog,
    deleteEmailLog
}