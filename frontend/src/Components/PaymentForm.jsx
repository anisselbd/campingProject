import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Alert, Paper, Text, Loader } from '@mantine/core';
import axios from 'axios';

export function PaymentForm({ amount, reservationId, token, onSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
           
            const { data } = await axios.post('/api/stripe/create-payment-intent', 
                { amount, reservation_id: reservationId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            });

            if (result.error) {
                setError(result.error.message);
                onError?.(result.error);
            } else if (result.paymentIntent.status === 'succeeded') {
                onSuccess?.(result.paymentIntent);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors du paiement');
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Paper withBorder p="md" radius="md">
                <Text fw={500} mb="sm">Informations de paiement</Text>
                <CardElement options={{
                    style: {
                        base: { fontSize: '16px', color: '#424770' }
                    }
                }} />
            </Paper>
            
            {error && <Alert color="red" mt="md">{error}</Alert>}
            
            <Button 
                type="submit" 
                fullWidth 
                mt="md" 
                size="lg"
                color="brand"
                disabled={!stripe || loading}
            >
                {loading ? <Loader size="sm" color="white" /> : `Payer ${amount.toFixed(2)} €`}
            </Button>
        </form>
    );
}