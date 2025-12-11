import couponModel from "../models/couponModel.js";

const createCoupon = async (req, res) => {

    const {
        code,
        type_reduction,
        valeur,
        montant_min,
        validite_debut,
        validite_fin,
        max_utilisations,
        actif
    } = req.body;


    if (!code || !type_reduction || valeur === undefined || !validite_fin) {
        return res.status(400).json({ message: "Code, Type de réduction, Valeur et Date de fin de validité sont obligatoires." });
    }

    try {

        const couponId = await couponModel.createCoupon(
            code,
            type_reduction,
            valeur,
            montant_min,
            validite_debut,
            validite_fin,
            max_utilisations,
            actif
        );


        return res.status(201).json({
            message: "Coupon créé avec succès",
            id_coupon: couponId
        });

    } catch (error) {

        console.error("Erreur lors de la création du coupon:", error);


        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Le code promo spécifié existe déjà." });
        }


        return res.status(500).json({ message: "Erreur serveur lors de la tentative de création du coupon." });
    }
};

const getCouponById = async (req, res) => {
    const id = req.params.id_coupon;
    if (!id) {
        return res.status(400).json({ message: "L'ID du coupon est requis." });
    }

    try {
        const coupon = await couponModel.getCouponById(id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon non trouvé." });
        }
        return res.status(200).json({ message: "Coupon trouvé.", coupon });

    } catch (error) {
        console.error("Erreur lors de la récupération du coupon:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de récupération du coupon." });

    }

}

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.getAllCoupons();

       if (!coupons || coupons.length === 0) {
            return res.status(200).json({ message: "Aucun coupon trouvé.", coupons: []}); //55555
        }
        return res.status(200).json({ message: "Coupons récupérés avec succès", coupons });

        
    } catch (error) {
        console.error("Erreur lors de la récupération des coupons:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de récupération des coupons." })
    }
}

const updateCoupon = async (req, res) => {
    const id = req.params.id_coupon;
    const new_data = req.body;
    if (!id) {
        return res.status(400).json({ message: "L'ID du coupon est requis." });
    }

    try {
        const originalCoupon = await couponModel.getCouponById(id);
        if (!originalCoupon) {
            return res.status(404).json({ message: "Le coupon à modifier n'a pas été trouvé." });
        }
        const updatedData = {
            ...originalCoupon,
            ...new_data
        };
        const affectedRows = await couponModel.updateCoupon(
            id,
            updatedData.code,
            updatedData.type_reduction,
            updatedData.valeur,
            updatedData.montant_min,
            updatedData.validite_debut,
            updatedData.validite_fin,
            updatedData.max_utilisations,
            updatedData.actif
        );
        if (affectedRows > 0) {
            return res.status(200).json({ message: "Coupon mis à jour avec succès" });
        } else {
            return res.status(200).json({ message: "Aucun changement effectué ou coupon déjà à jour." });
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour du coupon:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de mise à jour du coupon." });
    }

}

const deleteCoupon = async (req, res) => {
    const id = req.params.id_coupon;    
    if(!id){
        return res.status(400).json({message:"L'ID du coupon est requis."});
    }
    try {
        const affectedRows = await couponModel.deleteCoupon(id);    
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Le coupon à supprimer n'a pas été trouvé." });
        }
        return res.status(200).json({ message: "Coupon supprimé avec succès" });

    } catch (error) {
        console.error("Erreur lors de la suppression du coupon:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la tentative de suppression du coupon." });  

    }

}



export default {
    createCoupon,
    getCouponById,
    getAllCoupons,
    updateCoupon,
    deleteCoupon

};