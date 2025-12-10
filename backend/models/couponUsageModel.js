import bdd from "../config/bdd.js";



const registerCouponUsage = async (coupon_id, reservation_id, montant_remise) => {
    const sql = `
    INSERT INTO coupon_usage (coupon_id, reservation_id, montant_remise, date_utilisation)
    VALUES (?, ?, ?, NOW());
    `;
    const [result] = await bdd.query(sql, [coupon_id, reservation_id, montant_remise]);
    return result.insertId;
}

const countUsageByCouponId = async (id_coupon) => { // pour voir l'utilis total et le control des limit usage
    const sql = `
    SELECT COUNT(*)
    from coupon_usage
    where id_coupon = ?;
    `;
    const [row] = await bdd.query(sql, [id_coupon]);
    return row[0]['COUNT(*)'];
}




export default {

    registerCouponUsage,
    countUsageByCouponId
}

