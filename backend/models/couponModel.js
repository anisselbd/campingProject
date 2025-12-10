import bdd from "../config/bdd.js";

const createCoupon = async (code, type_reduction, valeur, montant_min, validite_debut, validite_fin, max_utilisations, actif) => {
    const sql = `
    insert into coupon (
        code,
        type_reduction,
        valeur,
        montant_min,
        validite_debut,
        validite_fin,
        max_utilisations,
        actif
    )
    values (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await bdd.query(sql,[
        code,
        type_reduction,
        valeur,
        montant_min,
        validite_debut,
        validite_fin,
        max_utilisations,
        actif
    ]);
    return result.insertId;

}

const getCouponById = async (id_coupon) => {
    const sql = `
    select * from coupon where id_coupon = ?;
    `;
    const [row] = await bdd.query(sql, [id_coupon]);
    return row[0];
}

const getAllCoupons = async () => {
    const sql = `
    select * from coupon;
    `;
    const [rows] = await bdd.query(sql);
    return rows;
}


const updateCoupon = async (id_coupon, code, type_reduction, valeur, montant_min, validite_debut, validite_fin, max_utilisations, actif) =>{
    const sql = `
    update coupon
    set code = ?,
        type_reduction = ?,
        valeur = ?,
        montant_min = ?,
        validite_debut = ?,
        validite_fin = ?,
        max_utilisations = ?,
        actif = ?
    where id_coupon = ?;
    `
    const [result] = await bdd.query(sql,[code, type_reduction, valeur, montant_min, validite_debut, validite_fin, max_utilisations, actif, id_coupon]);
    return result.affectedRows;

}


const deleteCoupon = async (id_coupon) => {
    const sql = `
    delete from coupon where id_coupon = ?;
    `;
    const [result] = await bdd.query(sql, [id_coupon]);
    return result.affectedRows;


}




export default {
    createCoupon,
    getCouponById,
    getAllCoupons,
    updateCoupon,
    deleteCoupon

}