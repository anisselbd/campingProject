import bdd from "../config/bdd.js";


const checkAvailability = async (id_hebergement, arrivee, depart, id_sejour) => {
    // connextion avec table stay.
    // L'hebergement_id pour identifie logement disp
    const sql = `
        SELECT id_sejour
        FROM stay
        WHERE 
            hebergement_id = ? AND
            depart > ? AND
            arrivee < ?
            and id_sejour!= ?;
    `;


    const [rows] = await bdd.query(sql, [id_hebergement, arrivee, depart, id_sejour]);

    return rows; // se rows pas vite, pas dispon
}


const createBooking = async (
    client_id,
    source,
    statut,
    arrivee_globale,
    depart_globale,
    nb_total_personnes,
    montant_brut,
    montant_remise,
    montant_net,
    montant_paye,
    solde_restant,
    cgv_acceptees
) => {

    const sql = `
        INSERT INTO booking (
            client_id, 
            source, 
            statut, 
            arrivee_globale, 
            depart_globale, 
            nb_total_personnes, 
            montant_brut, 
            montant_remise, 
            montant_net, 
            montant_paye, 
            solde_restant, 
            cgv_acceptees
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;


    const [result] = await bdd.query(sql, [
        client_id,
        source,
        statut,
        arrivee_globale,
        depart_globale,
        nb_total_personnes,
        montant_brut,
        montant_remise,
        montant_net,
        montant_paye,
        solde_restant,
        cgv_acceptees
    ]);

    // donne l id reservation qnd creeè/
    return result.insertId;
}

const createStay = async (
    reservation_id,
    hebergement_id,
    arrivee,
    depart,
    adultes,
    enfants,
    prix_nuit,
    nb_nuits,
    total_sejour
) => {
    const sql = `
INSERT INTO stay (
            reservation_id, 
            hebergement_id, 
            arrivee, 
            depart, 
            adultes, 
            enfants, 
            prix_nuit, 
            nb_nuits, 
            total_sejour
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
    const [result] = await bdd.query(sql, [
        reservation_id,
        hebergement_id,
        arrivee,
        depart,
        adultes,
        enfants,
        prix_nuit,
        nb_nuits,
        total_sejour
    ]);

    return result.insertId;

}

const getAll = async () => {
    const sql = `
        SELECT 
            B.id_reservation, B.client_id, B.statut, B.montant_net, B.montant_paye, B.solde_restant, 
            S.id_sejour, S.hebergement_id, S.arrivee, S.depart, S.adultes, S.enfants, S.prix_nuit, S.nb_nuits, S.total_sejour
        FROM booking AS B
        INNER JOIN stay AS S 
        ON B.id_reservation = S.reservation_id;
    `;
    const [rows] = await bdd.query(sql);
    return rows;
}

const getById = async (id_reservation) => {
    const sql = `
    SELECT B.id_reservation, B.client_id, B.statut, B.montant_net, B.montant_paye, B.solde_restant, 
            S.hebergement_id, S.arrivee, S.depart, S.adultes, S.enfants, S.prix_nuit, S.nb_nuits, S.total_sejour,S.id_sejour
        FROM booking AS B
        INNER JOIN stay AS S 
        ON B.id_reservation = S.reservation_id
        WHERE B.id_reservation = ?;
    `;
    const [row] = await bdd.query(sql, [id_reservation]);
    return row[0]; // errore progetto precedente (restituisce il singolo oggetto)


}

const updateBooking = async (
    id_reservation,
    source,
    statut,
    arrivee_globale,
    depart_globale,
    nb_total_personnes,
    montant_brut,
    montant_remise,
    montant_net,
    montant_paye,
    solde_restant,
    cgv_acceptees

) => {
    const sql = `
        UPDATE booking
        SET source = ?, 
            statut = ?,  
            arrivee_globale = ?, 
            depart_globale = ?, 
            nb_total_personnes = ?, 
            montant_brut = ?, 
            montant_remise = ?, 
            montant_net = ?, 
            montant_paye = ?, 
            solde_restant = ?, 
            cgv_acceptees = ?
        WHERE id_reservation = ?;
        `;
    const [result] = await bdd.query(sql, [

        source,
        statut,
        arrivee_globale,
        depart_globale,
        nb_total_personnes,
        montant_brut,
        montant_remise,
        montant_net,
        montant_paye,
        solde_restant,
        cgv_acceptees,
        id_reservation]);

    return result.affectedRows;

}

const updateStay = async (
    id_sejour,
    arrivee,
    depart,
    adultes,
    enfants,
    prix_nuit,
    nb_nuits,
    total_sejour
) => {

    const sql = `
        UPDATE stay
        SET arrivee = ?, 
            depart = ?, 
            adultes = ?, 
            enfants = ?, 
            prix_nuit = ?, 
            nb_nuits = ?, 
            total_sejour = ?
        WHERE id_sejour = ?;
    `;

    const [result] = await bdd.query(sql, [
        arrivee,
        depart,
        adultes,
        enfants,
        prix_nuit,
        nb_nuits,
        total_sejour,
        id_sejour
    ]);

    return result.affectedRows;
}

const getIdSejour = async (id_reservation) => {
    const sql = `
        SELECT id_sejour 
        FROM stay 
        WHERE reservation_id = ?;
    `;
    const [rows] = await bdd.query(sql, [id_reservation]);
    // Restituisce l'ID del soggiorno o null
    return rows.length > 0 ? rows[0].id_sejour : null;
}

const deleteStay = async (id_sejour) => {
    const sql = `
        DELETE FROM stay
        WHERE id_sejour = ?;
    `;
    const [result] = await bdd.query(sql, [id_sejour]);
    return result.affectedRows;
}

const deleteBooking = async (id_reservation) => {
    const sql = `
        DELETE FROM booking
        WHERE id_reservation = ?;
    `;
    const [result] = await bdd.query(sql, [id_reservation]);
    return result.affectedRows;
}

const getAllStay = async () => { // pas util dans routes
    const sql = `
        SELECT * FROM stay;
    `;
    const [rows] = await bdd.query(sql);
    return rows;
}

const getByIdStay = async (id_sejour) => { // idem
    const sql = `
        SELECT * FROM stay
        WHERE id_sejour = ?;
    `;
    const [row] = await bdd.query(sql, [id_sejour]);
    return row[0];
}



export default {
    checkAvailability,
    createBooking,
    createStay,
    getAll,
    getById,
    updateBooking,
    updateStay,
    getIdSejour,
    deleteStay,
    deleteBooking,
    getAllStay,
    getByIdStay

}