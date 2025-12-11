import { Container, Title, Text, Card, Badge, Group, Stack, Loader, Center, Alert, Button, SimpleGrid } from '@mantine/core';
import { IconAlertCircle, IconCalendar, IconUsers, IconHome, IconArrowLeft, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

export function MesReservations() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchReservations = async () => {
            try {
                const response = await axios.get('/api/booking/my-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReservations(response.data);
            } catch (err) {
                console.error("Erreur chargement réservations:", err);
                setError("Impossible de charger vos réservations.");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user, token, navigate]);

    const getStatusBadge = (statut) => {
        const statusMap = {
            'confirmee': { color: 'green', label: 'Confirmée' },
            'en_attente': { color: 'yellow', label: 'En attente' },
            'annulee': { color: 'red', label: 'Annulée' },
            'terminee': { color: 'gray', label: 'Terminée' }
        };
        const s = statusMap[statut] || { color: 'blue', label: statut };
        return <Badge color={s.color} variant="filled">{s.label}</Badge>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleCancel = async (id_reservation) => {
        if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
        try {
            await axios.delete(`/api/booking/my-bookings/${id_reservation}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(prev => prev.filter(r => r.id_reservation !== id_reservation));
        } catch (err) {
            console.error('Erreur annulation:', err);
            setError('Erreur lors de l\'annulation.');
        }
    };

    if (loading) {
        return (
            <Center h={400}>
                <Loader size="xl" color="brand" />
            </Center>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={1} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Mes Réservations
                </Title>
                <Button leftSection={<IconArrowLeft size={16} />} variant="subtle" onClick={() => navigate('/')}>
                    Retour
                </Button>
            </Group>

            {error && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" mb="xl">
                    {error}
                </Alert>
            )}

            {reservations.length === 0 ? (
                <Card withBorder p="xl" radius="md">
                    <Stack align="center" gap="md">
                        <IconCalendar size={48} color="gray" />
                        <Text c="dimmed" size="lg">Vous n'avez pas encore de réservation</Text>
                        <Button color="brand" onClick={() => navigate('/hebergements')}>
                            Découvrir nos hébergements
                        </Button>
                    </Stack>
                </Card>
            ) : (
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    {reservations.map((reservation) => (
                        <Card key={reservation.id_reservation} withBorder shadow="sm" radius="md" p="lg">
                            <Group justify="space-between" mb="md">
                                <Text fw={600} size="lg">{reservation.hebergement_nom}</Text>
                                {getStatusBadge(reservation.statut)}
                            </Group>

                            <Stack gap="xs">
                                <Group gap="xs">
                                    <IconCalendar size={16} color="gray" />
                                    <Text size="sm">
                                        Du <strong>{formatDate(reservation.arrivee)}</strong> au <strong>{formatDate(reservation.depart)}</strong>
                                    </Text>
                                </Group>

                                <Group gap="xs">
                                    <IconUsers size={16} color="gray" />
                                    <Text size="sm">
                                        {reservation.adultes} adulte{reservation.adultes > 1 ? 's' : ''}
                                        {reservation.enfants > 0 && `, ${reservation.enfants} enfant${reservation.enfants > 1 ? 's' : ''}`}
                                    </Text>
                                </Group>

                                <Group gap="xs">
                                    <IconHome size={16} color="gray" />
                                    <Text size="sm">{reservation.nb_nuits} nuit{reservation.nb_nuits > 1 ? 's' : ''}</Text>
                                </Group>
                            </Stack>

                            <Group justify="space-between" mt="md" pt="md" style={{ borderTop: '1px solid #eee' }}>
                                <Text size="sm" c="dimmed">Réf: #{reservation.id_reservation}</Text>
                                <Group gap="sm">
                                    <Text fw={700} size="lg" c="brand">
                                        {parseFloat(reservation.total_sejour).toFixed(2)} €
                                    </Text>
                                    <Button
                                        size="xs"
                                        color="red"
                                        variant="light"
                                        leftSection={<IconTrash size={14} />}
                                        onClick={() => handleCancel(reservation.id_reservation)}
                                    >
                                        Annuler
                                    </Button>
                                </Group>
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}
