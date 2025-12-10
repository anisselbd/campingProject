import invoiceModel from "../models/invoiceModel.js";

const getInvoiceById = async (req, res) => {
    const id = req.params.id_facture;

    if (!id) {
        return res.status(400).json({ message: "L'ID de la facture est obligatoire." });
    }

    try {
        const invoice = await invoiceModel.getInvoiceById(id);

        if (!invoice) {
            return res.status(404).json({ message: "Facture non trouvée." });
        }

        return res.status(200).json({ message: "Facture trouvée.", invoice });

    } catch (error) {
        console.error("Erreur lors de la récupération de la facture:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération de la facture." });
    }
}



const getInvoiceByReservationId = async (req, res) => {
    const id = req.params.reservation_id;

    if (!id) {
        return res.status(400).json({ message: "L'ID de la réservation est obligatoire." });
    }

    try {
        const invoice = await invoiceModel.getInvoiceByReservationId(id);

        if (!invoice) {
            return res.status(404).json({ message: "Facture non trouvée pour cette réservation." });
        }

        return res.status(200).json({ message: "Facture trouvée.", invoice });

    } catch (error) {
        console.error("Erreur lors de la récupération de la facture par ID de réservation:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération de la facture." });
    }
}


const createInvoice = async (req, res) => {
    const { 
        reservation_id, 
        numero_facture, 
        montant_ht, 
        montant_tva, 
        montant_ttc, 
        statut, 
        pdf_genere
    } = req.body;

    
    if (!reservation_id || !numero_facture || montant_ttc === undefined) {
        return res.status(400).json({ message: "L'ID de réservation, le numéro de facture et le montant TTC sont obligatoires." });
    }

    try {
        const invoiceId = await invoiceModel.createInvoice(
            reservation_id, 
            numero_facture, 
            montant_ht, 
            montant_tva, 
            montant_ttc, 
            statut, 
            pdf_genere
        );

        return res.status(201).json({ 
            message: "Facture créée avec succès.", 
            id_facture: invoiceId 
        });

    } catch (error) {
        console.error("Erreur lors de la création de la facture:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la création de la facture." });
    }
}


const updateInvoice = async (req, res) => {
    const id = req.params.id_facture;
    const { 
        numero_facture, 
        date_emission, // ??'
        montant_ht, 
        montant_tva, 
        montant_ttc, 
        statut, 
        pdf_genere 
    } = req.body;
    
   
    if (!id) {
        return res.status(400).json({ message: "L'ID de la facture est obligatoire." });
    }

    try {
       
        const exists = await invoiceModel.getInvoiceById(id);
        if (!exists) {
            return res.status(404).json({ message: "Facture non trouvée pour la mise à jour." });
        }

        const affectedRows = await invoiceModel.updateInvoice(
            id,
            numero_facture || exists.numero_facture, // Use valor d'avant si pas fornì
            date_emission || exists.date_emission,
            montant_ht || exists.montant_ht,
            montant_tva || exists.montant_tva,
            montant_ttc || exists.montant_ttc,
            statut || exists.statut,
            pdf_genere === undefined ? exists.pdf_genere : pdf_genere 
        );
        
        if (affectedRows > 0) {
            return res.status(200).json({ message: "Facture mise à jour avec succès." });
        } else {
            return res.status(200).json({ message: "Aucun changement effectué ou facture déjà à jour." });
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour de la facture:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de mise à jour." });
    }
}


const deleteInvoice = async (req, res) => {
    const id = req.params.id_facture;

    if (!id) {
        return res.status(400).json({ message: "L'ID de la facture est obligatoire." });
    }

    try {
        const affectedRows = await invoiceModel.deleteInvoice(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Facture non trouvée." });
        }

        return res.status(200).json({ message: "Facture supprimée avec succès." });

    } catch (error) {
        console.error("Erreur lors de la suppression de la facture:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de suppression de la facture." });
    }
}



export default {
    getInvoiceById,
    getInvoiceByReservationId,
    createInvoice,
    updateInvoice,
    deleteInvoice
};