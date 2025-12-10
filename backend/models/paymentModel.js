import bdd from "../config/bdd.js";

const createPayment = async (reservation_id, type, montant, devise, moyen_paiement, fournisseur, transaction_id, statut) => {
    const sql = `
        INSERT INTO payment (
            reservation_id, 
            type, 
            montant, 
            devise, 
            moyen_paiement, 
            fournisseur, 
            transaction_id, 
            statut, 
            cree_le
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW());
    `;

    const [result] = await bdd.query(sql, [
        reservation_id,
        type,
        montant,
        devise,
        moyen_paiement,
        fournisseur,
        transaction_id,
        statut
    ]);
    return result.insertId;
}


const getPaymentById = async (id_payment) => {
    const sql = `
        SELECT id_payment, reservation_id, type, montant, devise, moyen_paiement, fournisseur, transaction_id, statut, cree_le 
        FROM payment 
        WHERE id_payment = ?;
    `;
    const [row] = await bdd.query(sql, [id_payment]);
    return row[0];
}

const getPaymentByReservationId = async (reservation_id) => {
    const sql = `
        SELECT id_payment, reservation_id, type, montant, devise, moyen_paiement, fournisseur, transaction_id, statut, cree_le
        FROM payment 
        WHERE reservation_id = ?;
    `;
    const [rows] = await bdd.query(sql, [reservation_id]);
    return rows; 
}

// ... (dopo la funzione getPaymentByReservationId)

const updatePayment = async (id_payment, type, montant, devise, moyen_paiement, fournisseur, transaction_id, statut) => {
    const sql = `
        UPDATE payment
        SET type = ?, 
            montant = ?, 
            devise = ?, 
            moyen_paiement = ?, 
            fournisseur = ?, 
            transaction_id = ?, 
            statut = ?
        WHERE id_payment = ?;
    `;
    const [result] = await bdd.query(sql, [
        type, 
        montant, 
        devise, 
        moyen_paiement, 
        fournisseur, 
        transaction_id, 
        statut, 
        id_payment
    ]);
    return result.affectedRows;
}

const deletePayment = async (id_payment) => {
    const sql = `
        DELETE FROM payment
        WHERE id_payment = ?;
    `;
    const [result] = await bdd.query(sql, [id_payment]);
    return result.affectedRows;
}


export default {
    createPayment,
    getPaymentById,
    getPaymentByReservationId,
    updatePayment,
    deletePayment
};