import { Modal, Text, Button, Group, NumberInput, Stack, Alert, Divider, Paper, Loader, Badge } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar, IconUsers, IconAlertCircle, IconCheck, IconCurrencyEuro, IconSun } from '@tabler/icons-react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from './PaymentForm';
import { trackStartReservation, trackReservationSubmitted } from '../utils/analytics';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export function BookingModal({ opened, onClose, hebergement, user, token }) {
    const [dateArrivee, setDateArrivee] = useState(null);
    const [dateDepart, setDateDepart] = useState(null);
    const [adultes, setAdultes] = useState(2);
    const [enfants, setEnfants] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState('details');
    const [reservationId, setReservationId] = useState(null);

    // Données de tarification dynamique
    const [pricing, setPricing] = useState(null);

    // Calcul du nombre de nuits
    const calculateNights = useCallback(() => {
        if (!dateArrivee || !dateDepart) return 0;
        const diffTime = new Date(dateDepart) - new Date(dateArrivee);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }, [dateArrivee, dateDepart]);

    const nbNuits = calculateNights();

    // Appel API pour calculer le prix
    useEffect(() => {
        const fetchPrice = async () => {
            if (!dateArrivee || !dateDepart || nbNuits === 0 || !hebergement?.type_hebergement_id) {
                setPricing(null);
                return;
            }

            setLoadingPrice(true);
            try {
                const formatDate = (date) => {
                    const d = new Date(date);
                    return d.toISOString().split('T')[0];
                };

                const response = await axios.post('/api/tarif/calculate', {
                    type_hebergement_id: hebergement.type_hebergement_id,
                    date_arrivee: formatDate(dateArrivee),
                    nb_personnes: adultes + enfants,
                    nb_nuits: nbNuits
                });

                setPricing(response.data);
            } catch (err) {
                console.error("Erreur calcul prix:", err);
                setPricing(null);
            } finally {
                setLoadingPrice(false);
            }
        };

        fetchPrice();
    }, [dateArrivee, dateDepart, adultes, enfants, nbNuits, hebergement?.type_hebergement_id]);

    // Track ouverture modal de réservation
    useEffect(() => {
        if (opened && hebergement) {
            trackStartReservation(hebergement);
        }
    }, [opened, hebergement]);

    const resetForm = () => {
        setDateArrivee(null);
        setDateDepart(null);
        setAdultes(2);
        setEnfants(0);
        setError(null);
        setSuccess(false);
        setPricing(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {

        if (!dateArrivee || !dateDepart) {
            setError("Veuillez sélectionner les dates d'arrivée et de départ.");
            return;
        }
        if (dateDepart <= dateArrivee) {
            setError("La date de départ doit être après la date d'arrivée.");
            return;
        }
        if (adultes < 1) {
            setError("Il doit y avoir au moins 1 adulte.");
            return;
        }
        if (adultes + enfants > hebergement.capacite_max) {
            setError(`La capacité maximale est de ${hebergement.capacite_max} personnes.`);
            return;
        }
        if (pricing && !pricing.min_nuits_ok) {
            setError(`Minimum ${pricing.min_nuits} nuits requis pour cette saison.`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formatDate = (date) => {
                const d = new Date(date);
                return d.toISOString().split('T')[0];
            };

            const montantTotal = pricing?.prix_total || 0;
            const prixNuit = pricing?.prix_par_nuit || 0;

            const bookingData = {
                client_id: user.id_user,
                id_hebergement: hebergement.id_hebergement,
                source: "site_web",
                statut: "confirmee",
                arrivee_globale: formatDate(dateArrivee),
                depart_globale: formatDate(dateDepart),
                nb_total_personnes: adultes + enfants,
                montant_brut: montantTotal,
                montant_remise: 0,
                montant_net: montantTotal,
                montant_paye: 0,
                solde_restant: montantTotal,
                cgv_acceptees: true,
                arrivee: formatDate(dateArrivee),
                depart: formatDate(dateDepart),
                adultes: adultes,
                enfants: enfants,
                prix_nuit: prixNuit,
                nb_nuits: nbNuits,
                total_sejour: montantTotal,
                id_sejour: null
            };

            const response = await axios.post('/api/booking', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Track GA4 si réservation soumise avec succès
            trackReservationSubmitted({
                hebergement_id: hebergement.id_hebergement,
                nb_nuits: nbNuits,
                nb_personnes: adultes + enfants,
                montant_total: montantTotal,
                saison: pricing?.saison || 'unknown'
            });

            // Stocker l'ID et passer à l'étape du paiement
            setReservationId(response.data.id_reservation);
            setStep('payment');
        } catch (err) {
            console.error("Erreur lors de la réservation:", err);
            if (err.response?.status === 409) {
                setError("Cet hébergement n'est pas disponible pour ces dates.");
            } else {
                setError(err.response?.data?.message || "Erreur lors de la réservation. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!hebergement) return null;

    // Couleurs des badges par saison
    const saisonColors = {
        'BS': 'blue',
        'MS': 'green',
        'HS': 'orange',
        'THS': 'red'
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={
                <Text fw={700} size="lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Réserver - {hebergement.nom_commercial}
                </Text>
            }
            size="md"
            centered
            fullScreen={(theme) => {
                const isMobile = window.innerWidth < 768;
                return isMobile;
            }}
        >
            {step === 'success' ? (
                <Stack align="center" py="xl">
                    <IconCheck size={60} color="green" />
                    <Text fw={700} size="xl" c="green">Réservation confirmée !</Text>
                    <Text c="dimmed" ta="center">
                        Votre réservation a été enregistrée avec succès.
                        Vous recevrez bientôt un email de confirmation.
                    </Text>
                    <Button color="brand" onClick={handleClose} mt="md">
                        Fermer
                    </Button>
                </Stack>
            ) : step === 'payment' ? (
                <Stack>
                    <Text fw={500} size="lg" mb="md" ta="center">
                        💳 Paiement - {pricing?.prix_total.toFixed(2)} €
                    </Text>
                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            amount={pricing?.prix_total || 0}
                            reservationId={reservationId}
                            token={token}
                            onSuccess={() => setStep('success')}
                            onError={(err) => setError(err.message || 'Erreur de paiement')}
                        />
                    </Elements>
                    {error && (
                        <Alert icon={<IconAlertCircle size={16} />} color="red" mt="md">{error}</Alert>
                    )}
                </Stack>
            ) : (
                <Stack>
                    {error && (
                        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red">
                            {error}
                        </Alert>
                    )}

                    <Group grow sx={(theme) => ({
                        '@media (max-width: 767px)': {
                            flexDirection: 'column',
                        },
                    })}>
                        <DateInput
                            value={dateArrivee}
                            onChange={setDateArrivee}
                            label="Date d'arrivée"
                            placeholder="Sélectionner"
                            leftSection={<IconCalendar size={16} />}
                            minDate={new Date()}
                            required
                        />
                        <DateInput
                            value={dateDepart}
                            onChange={setDateDepart}
                            label="Date de départ"
                            placeholder="Sélectionner"
                            leftSection={<IconCalendar size={16} />}
                            minDate={dateArrivee || new Date()}
                            required
                        />
                    </Group>

                    <Group grow sx={(theme) => ({
                        '@media (max-width: 767px)': {
                            flexDirection: 'column',
                        },
                    })}>
                        <NumberInput
                            value={adultes}
                            onChange={setAdultes}
                            label="Adultes"
                            min={1}
                            max={hebergement.capacite_max}
                            leftSection={<IconUsers size={16} />}
                        />
                        <NumberInput
                            value={enfants}
                            onChange={setEnfants}
                            label="Enfants"
                            min={0}
                            max={hebergement.capacite_max - adultes}
                            leftSection={<IconUsers size={16} />}
                        />
                    </Group>

                    <Divider my="sm" />

                    <Paper withBorder p="md" radius="md" bg="gray.0">
                        {loadingPrice ? (
                            <Group justify="center" py="md">
                                <Loader size="sm" />
                                <Text size="sm" c="dimmed">Calcul du prix...</Text>
                            </Group>
                        ) : pricing ? (
                            <>
                                <Group justify="space-between" mb="xs">
                                    <Group gap={5}>
                                        <IconSun size={16} />
                                        <Text size="sm">Saison</Text>
                                    </Group>
                                    <Badge
                                        color={saisonColors[pricing.saison_code] || 'gray'}
                                        variant="light"
                                    >
                                        {pricing.saison}
                                    </Badge>
                                </Group>
                                <Group justify="space-between">
                                    <Text>Prix par nuit</Text>
                                    <Text fw={500}>{pricing.prix_par_nuit.toFixed(2)} €</Text>
                                </Group>
                                <Group justify="space-between" mt="xs">
                                    <Text>Nombre de nuits</Text>
                                    <Text fw={500}>{nbNuits}</Text>
                                </Group>
                                <Group justify="space-between" mt="xs">
                                    <Text size="sm" c="dimmed">
                                        ({pricing.personnes_incluses} pers. incluses)
                                    </Text>
                                    <Text size="sm" c="dimmed">{pricing.prix_base.toFixed(2)} €</Text>
                                </Group>
                                {pricing.personnes_extra > 0 && (
                                    <Group justify="space-between" mt="xs">
                                        <Text size="sm" c="dimmed">
                                            Supplément ({pricing.personnes_extra} pers. × {pricing.supplement_personne.toFixed(2)}€)
                                        </Text>
                                        <Text size="sm" c="dimmed">+{pricing.supplement_total.toFixed(2)} €</Text>
                                    </Group>
                                )}
                                {!pricing.min_nuits_ok && (
                                    <Alert color="orange" mt="xs" p="xs">
                                        <Text size="xs">⚠️ Minimum {pricing.min_nuits} nuits requis</Text>
                                    </Alert>
                                )}
                                <Divider my="sm" />
                                <Group justify="space-between">
                                    <Text fw={700} size="lg">Total</Text>
                                    <Group gap={5}>
                                        <IconCurrencyEuro size={20} />
                                        <Text fw={700} size="lg" c="brand">{pricing.prix_total.toFixed(2)} €</Text>
                                    </Group>
                                </Group>
                            </>
                        ) : (
                            <Text ta="center" c="dimmed" size="sm">
                                Sélectionnez les dates pour voir le prix
                            </Text>
                        )}
                    </Paper>

                    <Text size="xs" c="dimmed">
                        En cliquant sur "Confirmer", vous acceptez nos conditions générales de vente.
                    </Text>

                    <Button
                        fullWidth
                        size="lg"
                        color="brand"
                        onClick={handleSubmit}
                        disabled={loading || nbNuits === 0 || !pricing || !pricing.min_nuits_ok}
                    >
                        {loading ? <Loader size="sm" color="white" /> : 'Confirmer la réservation'}
                    </Button>
                </Stack>
            )}
        </Modal>
    );
}
