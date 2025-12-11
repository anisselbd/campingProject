import bookingModel from "../models/bookingModel.js";
import stayOptionModel from "../models/stayOptionModel.js";
import optionModel from "../models/optionModel.js";
import couponModel from "../models/couponModel.js";
import couponUsageModel from "../models/couponUsageModel.js";



const createBooking = async (req, res) => {

    const {
        client_id,
        id_hebergement,
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
        arrivee,
        depart,
        adultes,
        enfants,
        prix_nuit,
        nb_nuits,
        total_sejour,
        id_sejour
    } = req.body;

    try {

        if (!client_id || !id_hebergement || !arrivee || !depart) {
            return res.status(400).json({ message: "Les dates et l'ID d'hébergement sont requis." });
        }

        // pour verfie dispo
        const overlappingStays = await bookingModel.checkAvailability(id_hebergement, arrivee, depart, id_sejour);
        if (overlappingStays.length > 0) {
            return res.status(409).json({ message: "L'Hébergement est déjà réservé pour ces dates." });
        }


        const bookingId = await bookingModel.createBooking(
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
        );

        if (!bookingId) {
            return res.status(500).json({ message: "Erreur lors de la création de la réservation principale." });
        }

        // INSERTION DANS LA TABLE STAY (Utilizza le dates STAY)
        const stayId = await bookingModel.createStay(
            bookingId,
            id_hebergement,
            arrivee,
            depart,
            adultes, enfants, prix_nuit, nb_nuits, total_sejour
        );

        if (!stayId) {
            return res.status(500).json({ message: "Erreur lors de la création du sejour." })
        }

        return res.status(201).json({
            message: "Réservation créée avec succès",
            id_reservation: bookingId,
            id_sejour: stayId
        });

    } catch (error) {
        console.error("Erreur lors de la création de la réservation:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de réservation." });
    }

}

const getAll = async (req, res) => {
    try {

        const bookings = await bookingModel.getAll();


        if (!bookings || bookings.length === 0) {
            return res.status(200).json({
                message: "Nessuna prenotazione trovata.",
                data: []
            });
        }


        return res.status(200).json(bookings);

    } catch (error) {
        console.error("Error recupe info:", error);
        return res.status(500).json({ message: "Errore server recup dat" });
    }
}

const getById = async (req, res) => {
    const id_reservation = req.params.id_reservation;

    try {
        const booking = await bookingModel.getById(id_reservation);
        if (!booking) {
            return res.status(404).json({ message: "Reservation pas trouvè" });
        }
        return res.status(200).json(booking);

    } catch (error) {
        console.error("Error recupe info:", error);
        return res.status(500).json({ message: "Errore server recup dat" });

    }
}

const updateBooking = async (req, res) => {

    const id_reservation = req.params.id_reservation;

    const new_data = req.body;

    try {

        const originalBooking = await bookingModel.getById(id_reservation);

        if (!originalBooking) {
            return res.status(404).json({ message: "La réservation à modifier n'a pas été trouvée." });
        }


        const updatedData = {
            ...originalBooking, // Dati originali (garantisce che source, statut, etc. non siano NULL)
            ...new_data
        };

        const overlappingStays = await bookingModel.checkAvailability(updatedData.hebergement_id, updatedData.arrivee, updatedData.depart);

        if (overlappingStays.length > 0) {

            return res.status(409).json({
                message: "Conflit: L'hébergement est déjà réservé pour les nouvelles dates."
            });
        }


        const id_sejour = await bookingModel.getIdSejour(id_reservation);

        if (!id_sejour) {
            return res.status(404).json({ message: "Erreur: ID séjour introuvable pour cette réservation." });
        }



        const affectedRowsBooking = await bookingModel.updateBooking(
            id_reservation,
            updatedData.source,
            updatedData.statut,
            updatedData.arrivee_globale,
            updatedData.depart_globale,
            updatedData.nb_total_personnes,
            updatedData.montant_brut,
            updatedData.montant_remise,
            updatedData.montant_net,
            updatedData.montant_paye,
            updatedData.solde_restant,
            updatedData.cgv_acceptees
        );


        const affectedRowsStay = await bookingModel.updateStay(
            id_sejour,
            updatedData.arrivee,
            updatedData.depart,
            updatedData.adultes,
            updatedData.enfants,
            updatedData.prix_nuit,
            updatedData.nb_nuits,
            updatedData.total_sejour
        );


        if (affectedRowsBooking === 0 && affectedRowsStay === 0) {

            return res.status(200).json({ message: "Mise à jour effectuée, mais aucun changement détecté." });
        }


        return res.status(200).json({
            message: "Réservation et séjour mis à jour avec succès.",
            id_reservation: id_reservation
        });

    } catch (error) {
        console.error("Erreur lors de la mise à jour de la réservation:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la mise à jour." });
    }
}

const deleteBooking = async (req, res) => {
    const id_reservation = req.params.id_reservation;

    try {
        const id_sejour = await bookingModel.getIdSejour(id_reservation);

        if (!id_sejour) {
            return res.status(404).json({ message: "Reservation pas trouvè" });
        }

        // Supprimer d'abord les options liées au séjour
        const bdd = (await import('../config/bdd.js')).default;
        await bdd.query('DELETE FROM stay_option WHERE sejour_id = ?', [id_sejour]);

        await bookingModel.deleteStay(id_sejour);

        const affectedRows = await bookingModel.deleteBooking(id_reservation);

        if (affectedRows === 0) {
            return res.status(500).json({ message: "Erreur lors de la suppression della prenotazione." });
        }

        return res.status(200).json({ message: "Réserrvation supprimé avec succès" })


    } catch (error) {
        console.error("Erreur lors de la suppression de la réservation:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la suppression." });
    }
}


const addOptionToStay = async (req, res) => { // pas facile
    const { sejour_id } = req.params;

    const {
        option_id,
        quantite,
    } = req.body;

    if (!option_id || !quantite || !sejour_id)
        return res.status(400).json({ message: "ID option,quantite et sejour obbligatoire " });

    try {
        const option = await optionModel.getOptionById(option_id);
        if (!option) {
            return res.status(404).json({ message: "Option non trouvée" });
        }
        const total_option = option.prix * quantite;
        const stayOptionId = await stayOptionModel.addOptionToStay(sejour_id, option_id, quantite, total_option)
        const stay = await bookingModel.getByIdStay(sejour_id);
        if (!stay) {
            return res.status(404).json({ message: "Séjour non trouvé" });
        }
        const total_sejour = parseFloat(stay.total_sejour) + total_option;
        await bookingModel.updateStay(
            sejour_id,
            stay.arrivee,
            stay.depart,
            stay.adultes,
            stay.enfants,
            stay.prix_nuit,
            stay.nb_nuits,
            total_sejour
        );
        return res.status(201).json({
            message: "Option ajoutée au séjour avec succès",
            id_stay_option: stayOptionId
        })
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'option au séjour:", error);
        return res.status(500).json({ message: "Erreur serveur lors de l'ajout de l'option au séjour." });
    }

}

const removeOptionToStay = async (req, res) => {
    const { sejour_id } = req.params;
    const { id_stay_option } = req.body;


    if (!sejour_id || !id_stay_option)
        return res.status(400).json({ message: "Les Id sont obligatoires" });

    try {

        const stayOption = await stayOptionModel.getStayOptionById(id_stay_option);
        if (!stayOption) {
            return res.status(404).json({ message: "Option de séjour non trouvée" });
        }

        if (stayOption.sejour_id !== sejour_id) {
            return res.status(403).json({ message: "l'option ne peut pas etre retirée de ce séjour car elle ne lui appartient pas." });

        }

        const stay = await bookingModel.getByIdStay(sejour_id);

        if (!stay) {
            return res.status(404).json({ message: "Séjour non trouvé." });
        }


        await stayOptionModel.deleteStayOption(id_stay_option);


        const total_to_subtract = parseFloat(stayOption.total_option);
        const nouveau_total_sejour = parseFloat(stay.total_sejour) - total_to_subtract;


        //  Aupdate new total
        await bookingModel.updateStay(
            sejour_id,
            stay.arrivee, stay.depart,
            stay.adultes, stay.enfants,
            stay.prix_nuit, stay.nb_nuits,
            nouveau_total_sejour
        );



        return res.status(200).json({
            message: "Opzione rimossa con successo e totali aggiornati.",
            nouveau_total: nouveau_total_sejour
        });


    } catch (error) {
        console.error("Erreur lors de la suppression de l'option du séjour:", error);
        return res.status(500).json({ message: "Erreur serveur interne." });
    }
}

const applyCouponToStay = async (req, res) => {
    const { sejour_id } = req.params;
    const { coupon_id } = req.body;

    if (!sejour_id || !coupon_id) {
        return res.status(400).json({ message: "Les Id sont obligatoires" });
    }


    try {
        const stay = await bookingModel.getByIdStay(sejour_id);
        const coupon = await couponModel.getCouponById(coupon_id);

        if (!stay || !coupon) {
            return res.status(404).json({ message: "Séjour ou coupon non trouvés." });
        }

        if (!coupon.actif) {
            return res.status(403).json({ message: "Coupon non actif." })
        }

        const today = new Date();
        const validiteDebut = new Date(coupon.validite_debut);
        const validiteFin = new Date(coupon.validite_fin);

        if (today > validiteFin) {
            return res.status(403).json({ message: "Ce coupon est expiré." });
        }

        if (validiteDebut && today < validiteDebut) {
            return res.status(403).json({ message: "Ce coupon n'est pas encore valide." });
        }

        if (coupon.max_utilisations > 0) {
            const currentUsage = await couponUsageModel.countUsageByCouponId(coupon.id_coupon);
            if (currentUsage >= coupon.max_utilisations) {
                return res.status(403).json({ message: "Ce coupon a atteint sa limite d'utilisation." })
            }
        }

        if (stay.total_sejour < coupon.montant_min) {
            return res.status(403).json({ message: `Le montant total du séjour (${stay.total_sejour}€) n'atteint pas le minimum requis (${coupon.montant_min}€) pour ce coupon.` });

        }

        //sconto

        let montant_remise = 0;
        const total_courant = parseFloat(stay.total_sejour);

        if (coupon.type_reduction === 'pourcentage') {
            montant_remise = (total_courant * coupon.valeur) / 100;
        } else if (coupon.type_reduction === 'fixe') {
            montant_remise = coupon.valeur;

            //registrazione 

            const usageId = await couponUsageModel.registerCouponUsage(
                coupon.id_coupon,
                stay.id_reservation,
                montant_remise);

            const nouveau_total_sejour = total_courant - montant_remise;

            const affectedRows = await bookingModel.updateStay(
                sejour_id,
                stay.arrivee,
                stay.depart,
                stay.adultes,
                stay.enfants,
                stay.prix_nuit,
                stay.nb_nuits,
                nouveau_total_sejour
            );

            if (affectedRows === 0 && usageId) {
                return res.status(200).json({
                    message: "Coupon appliqué, mais aucun changement dans le total du séjour.",
                    montant_remise: montant_remise
                });
            }

            return res.status(200).json({
                message: "Coupon appliqué avec succès.",
                montant_remise: montant_remise,
                nouveau_total: nouveau_total_sejour
            });


        }



    } catch (error) {
        console.error("Erreur lors de l'application du coupon:", error);
        return res.status(500).json({ message: "Erreur serveur lors de l'application du coupon." });
    }



}






const getMyBookings = async (req, res) => {
    try {
        const client_id = req.user.id_user;

        const bookings = await bookingModel.getByClientId(client_id);

        return res.status(200).json(bookings);
    } catch (error) {
        console.error("Erreur getMyBookings:", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des réservations." });
    }
}
const updateStatus = async (req, res) => {
    const id_reservation = req.params.id_reservation;
    const { statut } = req.body;

    if (!statut) {
        return res.status(400).json({ message: "Le statut est requis." });
    }

    try {
        const sql = `UPDATE booking SET statut = ? WHERE id_reservation = ?`;
        const bdd = (await import('../config/bdd.js')).default;
        const [result] = await bdd.query(sql, [statut, id_reservation]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Réservation non trouvée." });
        }

        return res.status(200).json({ message: "Statut mis à jour avec succès." });
    } catch (error) {
        console.error("Erreur updateStatus:", error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour du statut." });
    }
}

const cancelMyBooking = async (req, res) => {
    const id_reservation = req.params.id_reservation;
    const client_id = req.user.id_user;

    try {
        // Vérifier que la réservation appartient au client
        const booking = await bookingModel.getById(id_reservation);

        if (!booking) {
            return res.status(404).json({ message: "Réservation non trouvée." });
        }

        if (booking.client_id !== client_id) {
            return res.status(403).json({ message: "Vous ne pouvez pas annuler cette réservation." });
        }

        const id_sejour = await bookingModel.getIdSejour(id_reservation);

        if (id_sejour) {
            const bdd = (await import('../config/bdd.js')).default;
            await bdd.query('DELETE FROM stay_option WHERE sejour_id = ?', [id_sejour]);
            await bookingModel.deleteStay(id_sejour);
        }

        await bookingModel.deleteBooking(id_reservation);

        return res.status(200).json({ message: "Réservation annulée avec succès." });
    } catch (error) {
        console.error("Erreur cancelMyBooking:", error);
        return res.status(500).json({ message: "Erreur lors de l'annulation de la réservation." });
    }
}


export default {
    createBooking,
    getAll,
    getById,
    getMyBookings,
    cancelMyBooking,
    updateBooking,
    updateStatus,
    deleteBooking,
    addOptionToStay,
    removeOptionToStay,
    applyCouponToStay
};


