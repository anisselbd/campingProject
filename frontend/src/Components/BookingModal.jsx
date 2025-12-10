import { Modal, Text, Button, Group, NumberInput, Stack, Alert, Divider, Paper, Loader } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar, IconUsers, IconAlertCircle, IconCheck, IconCurrencyEuro } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import axios from 'axios';

export function BookingModal({ opened, onClose, hebergement, user, token }) {
    // Prix temporaire en attendant le MVC Tarif (à changer quand le MVC sera en place)
    const PRIX_DEFAUT = 50;
    const [dateArrivee, setDateArrivee] = useState(null);
    const [dateDepart, setDateDepart] = useState(null);
    const [adultes, setAdultes] = useState(2);
    const [enfants, setEnfants] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Calcul du nombre de nuits et du montant
    const prixNuit = hebergement?.prix_base_nuitee || PRIX_DEFAUT; // à changer quand le MVC sera en place

    const { nbNuits, montantTotal } = useMemo(() => {
        if (!dateArrivee || !dateDepart) return { nbNuits: 0, montantTotal: 0 };
        const diffTime = new Date(dateDepart) - new Date(dateArrivee);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const nuits = diffDays > 0 ? diffDays : 0;
        return {
            nbNuits: nuits,
            montantTotal: nuits * prixNuit
        };
    }, [dateArrivee, dateDepart, prixNuit]);

    const resetForm = () => {
        setDateArrivee(null);
        setDateDepart(null);
        setAdultes(2);
        setEnfants(0);
        setError(null);
        setSuccess(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        // Validations
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

        setLoading(true);
        setError(null);

        try {
            // Convertir les dates en format ISO pour esquive l'erreur de null
            const formatDate = (date) => {
                const d = new Date(date);
                return d.toISOString().split('T')[0];
            };

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

            await axios.post('/api/booking', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSuccess(true);
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
        >
            {success ? (
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
            ) : (
                <Stack>
                    {error && (
                        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red">
                            {error}
                        </Alert>
                    )}

                    <Group grow>
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

                    <Group grow>
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
                        <Group justify="space-between">
                            <Text>Prix par nuit</Text>
                            <Text fw={500}>{prixNuit} €</Text>
                        </Group>
                        <Group justify="space-between" mt="xs">
                            <Text>Nombre de nuits</Text>
                            <Text fw={500}>{nbNuits}</Text>
                        </Group>
                        <Divider my="sm" />
                        <Group justify="space-between">
                            <Text fw={700} size="lg">Total</Text>
                            <Group gap={5}>
                                <IconCurrencyEuro size={20} />
                                <Text fw={700} size="lg" c="brand">{montantTotal} €</Text>
                            </Group>
                        </Group>
                    </Paper>

                    <Text size="xs" c="dimmed">
                        En cliquant sur "Confirmer", vous acceptez nos conditions générales de vente.
                    </Text>

                    <Button
                        fullWidth
                        size="lg"
                        color="brand"
                        onClick={handleSubmit}
                        disabled={loading || nbNuits === 0}
                    >
                        {loading ? <Loader size="sm" color="white" /> : 'Confirmer la réservation'}
                    </Button>
                </Stack>
            )}
        </Modal>
    );
}
