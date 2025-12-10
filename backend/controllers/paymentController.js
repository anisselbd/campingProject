import paymentModel from "../models/paymentModel.js";

const createPayment = async (req, res) => {
    const {
        reservation_id,
        type,
        montant,
        devise,
        moyen_paiement,
        fournisseur,
        transaction_id,
        statut
    } = req.body;

    if (!reservation_id || montant === undefined || !statut) {
        return res.status(400).json({ message: "L'ID de réservation, le montant et le statut sont obligatoires." });
    }

    try {
        const paymentId = await paymentModel.createPayment(
            reservation_id,
            type,
            montant,
            devise,
            moyen_paiement,
            fournisseur,
            transaction_id,
            statut
        );

        return res.status(201).json({
            message: "Paiement enregistré avec succès.",
            id_payment: paymentId
        });

    } catch (error) {
        console.error("Erreur lors de l'enregistrement du paiement:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la création du paiement." });
    }
}

// ... (dopo la funzione createPayment)

const getPaymentById = async (req, res) => {
    const id = req.params.id_payment;

    if (!id) {
        return res.status(400).json({ message: "L'ID du paiement est obligatoire." });
    }

    try {
        const payment = await paymentModel.getPaymentById(id);

        if (!payment) {
            return res.status(404).json({ message: "Paiement non trouvé." });
        }

        return res.status(200).json({ message: "Paiement trouvé.", payment });

    } catch (error) {
        console.error("Erreur lors de la récupération du paiement:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération du paiement." });
    }
}


const getPaymentByReservationId = async (req, res) => {
    const id = req.params.reservation_id;

    if (!id) {
        return res.status(400).json({ message: "L'ID de la réservation est obligatoire." });
    }

    try {
        const payments = await paymentModel.getPaymentByReservationId(id);

        if (!payments || payments.length === 0) {
            return res.status(200).json({ message: "Aucun paiement trouvé pour cette réservation.", payments: [] });
        }

        return res.status(200).json({ message: "Paiements trouvés.", payments });

    } catch (error) {
        console.error("Erreur lors de la récupération des paiements par ID de réservation:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements." });
    }
}



const updatePayment = async (req, res) => {
    const id = req.params.id_payment;
    const { 
        type, 
        montant, 
        devise, 
        moyen_paiement, 
        fournisseur, 
        transaction_id, 
        statut 
    } = req.body;
    
  
    if (!id) {
        return res.status(400).json({ message: "L'ID du paiement est obligatoire." });
    }

    try {
        
        const originalPayment = await paymentModel.getPaymentById(id);
        if (!originalPayment) {
            return res.status(404).json({ message: "Paiement non trouvé pour la mise à jour." });
        }
        
        //  (uso l'operatore OR per mantenere il valore precedente se non fornito)
        const affectedRows = await paymentModel.updatePayment( // pour garder l'ancienne valeur si il'ny pas un nouveau
            id,
            type || originalPayment.type,
            montant || originalPayment.montant,
            devise || originalPayment.devise,
            moyen_paiement || originalPayment.moyen_paiement,
            fournisseur || originalPayment.fournisseur,
            transaction_id || originalPayment.transaction_id,
            statut || originalPayment.statut 
        );
        
        if (affectedRows > 0) {
            return res.status(200).json({ message: "Paiement mis à jour avec succès." });
        } else {
            return res.status(200).json({ message: "Aucun changement effectué ou paiement déjà à jour." });
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour du paiement:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de mise à jour." });
    }
}


const deletePayment = async (req, res) => {
    const id = req.params.id_payment;

    if (!id) {
        return res.status(400).json({ message: "L'ID du paiement est obligatoire." });
    }

    try {
        const affectedRows = await paymentModel.deletePayment(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Paiement non trouvé." });
        }

        return res.status(200).json({ message: "Paiement supprimé avec succès." });

    } catch (error) {
        console.error("Erreur lors de la suppression du paiement:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de suppression du paiement." });
    }
}



export default {
    createPayment,
    getPaymentById,
    getPaymentByReservationId,
    updatePayment,
    deletePayment
};