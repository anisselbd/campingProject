import bdd from "../config/bdd.js";

const createInvoice = async (reservation_id, numero_facture, montant_ht, montant_tva, montant_ttc, statut, pdf_genere) => {
    const sql = `
        INSERT INTO invoice (
            reservation_id, 
            numero_facture, 
            date_emission, 
            montant_ht, 
            montant_tva, 
            montant_ttc, 
            statut, 
            pdf_genere
        )
        VALUES (?, ?, NOW(), ?, ?, ?, ?, ?);
    `;

    const [result] = await bdd.query(sql, [
        reservation_id,
        numero_facture,
        montant_ht,
        montant_tva,
        montant_ttc,
        statut,
        pdf_genere
    ]);
    return result.insertId;
}

const getInvoiceById = async (id_facture) => {
    const sql = `
        SELECT * FROM invoice 
        WHERE id_facture = ?;
    `;
    const [row] = await bdd.query(sql, [id_facture]);
    return row[0];
}

const getInvoiceByReservationId = async (reservation_id) => {
    const sql = `
        SELECT * FROM invoice 
        WHERE reservation_id = ?;
    `;
    const [row] = await bdd.query(sql, [reservation_id]);

    return row[0];
}

const updateInvoice = async (id_facture, numero_facture, date_emission, montant_ht, montant_tva, montant_ttc, statut, pdf_genere) => {
    const sql = `
        UPDATE invoice
        SET numero_facture = ?, 
            date_emission = ?, 
            montant_ht = ?, 
            montant_tva = ?, 
            montant_ttc = ?, 
            statut = ?, 
            pdf_genere = ?
        WHERE id_facture = ?;
    `;
    const [result] = await bdd.query(sql, [
        numero_facture, 
        date_emission, 
        montant_ht, 
        montant_tva, 
        montant_ttc, 
        statut, 
        pdf_genere, 
        id_facture
    ]);
    return result.affectedRows;
}


const deleteInvoice = async (id_facture) => {
    const sql = `
        DELETE FROM invoice
        WHERE id_facture = ?;
    `;
    const [result] = await bdd.query(sql, [id_facture]);
    return result.affectedRows;
}


export default {
    createInvoice,
    getInvoiceById,
    getInvoiceByReservationId,
    updateInvoice,
    deleteInvoice
   
};