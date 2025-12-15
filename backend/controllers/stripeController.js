import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    const { amount, reservation_id } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "le montant est invalide" });
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: "eur",
            metadata: { reservation_id: reservation_id?.toString() || "" },
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Erreur stripe createPaymentIntent", error);
        res.status(500).json({ error: "Erreur lors de la creation du paiement" });
    }
};

export default createPaymentIntent;
