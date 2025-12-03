import bdd from "../config/bdd.js";

const getAllSupportTickets = async () => {
    const sql = `SELECT id_ticket, client_id, sujet, description, statut, priorite 
    FROM support_ticket`;
    const [rows] = await bdd.query(sql);
    return rows;
}

const getSupportTicketById = async (id_ticket) => {
    const sql = `SELECT id_ticket, client_id, sujet, description, statut, priorite FROM support_ticket
    WHERE id_ticket = ?`;
    const [rows] = await bdd.query(sql, [id_ticket]);
    return rows[0];
}

const createTicket = async (client_id, sujet, description, statut, priorite) => {
    const sql = `INSERT INTO support_ticket (client_id, sujet, description, statut, priorite) 
    VALUES (?, ?, ?, ?, ?)`;
    const [result] = await bdd.query(sql, [client_id, sujet, description, statut, priorite]);
    return result.insertId;
}

const updateTicket = async (id_ticket, client_id, sujet, description, statut, priorite) => {
    const sql = `UPDATE support_ticket SET client_id = ?, sujet = ?, description = ?, statut = ?, priorite = ? 
    WHERE id_ticket = ?`;
    const [result] = await bdd.query(sql, [client_id, sujet, description, statut, priorite, id_ticket]);
    return result.affectedRows;
}

const deleteTicket = async (id_ticket) => {
    const sql = `DELETE FROM support_ticket WHERE id_ticket = ?`;
    const [result] = await bdd.query(sql, [id_ticket]);
    return result.affectedRows;
}

export default {
    getAllSupportTickets,
    getSupportTicketById,
    createTicket,
    updateTicket,
    deleteTicket
}