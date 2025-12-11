import { Table, Badge, Group, Text, Loader, Center, Alert, Select, Paper, Stack, TextInput, ActionIcon } from '@mantine/core';
import { IconAlertCircle, IconSearch, IconTrash } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function ReservationsTab({ token }) {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/booking', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = Array.isArray(response.data) ? response.data : response.data.data || [];
            setReservations(data);
            setFilteredReservations(data);
        } catch (err) {
            console.error('Erreur chargement réservations:', err);
            setError('Impossible de charger les réservations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchReservations();
        }
    }, [token]);

    useEffect(() => {
        let filtered = reservations;

        if (searchTerm) {
            filtered = filtered.filter(r =>
                String(r.id_reservation).includes(searchTerm) ||
                String(r.client_id).includes(searchTerm)
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(r => r.statut === statusFilter);
        }

        setFilteredReservations(filtered);
    }, [searchTerm, statusFilter, reservations]);

    const handleStatusChange = async (id_reservation, newStatus) => {
        try {
            await axios.patch(`/api/booking/${id_reservation}/status`,
                { statut: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReservations(prev => prev.map(r =>
                r.id_reservation === id_reservation ? { ...r, statut: newStatus } : r
            ));
        } catch (err) {
            console.error('Erreur mise à jour statut:', err);
        }
    };

    const handleDelete = async (id_reservation) => {
        if (!window.confirm('Supprimer cette réservation ?')) return;
        try {
            await axios.delete(`/api/booking/${id_reservation}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(prev => prev.filter(r => r.id_reservation !== id_reservation));
        } catch (err) {
            console.error('Erreur suppression:', err);
        }
    };

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
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const statusOptions = [
        { value: 'confirmee', label: 'Confirmée' },
        { value: 'en_attente', label: 'En attente' },
        { value: 'annulee', label: 'Annulée' },
        { value: 'terminee', label: 'Terminée' }
    ];

    if (loading) {
        return <Center h={200}><Loader /></Center>;
    }

    if (error) {
        return <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>;
    }

    return (
        <Stack>
            <Group justify="space-between">
                <Text fw={500}>Gestion des réservations ({filteredReservations.length})</Text>
                <Group>
                    <TextInput
                        placeholder="Rechercher par ID..."
                        leftSection={<IconSearch size={16} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="sm"
                    />
                    <Select
                        placeholder="Filtrer par statut"
                        data={[{ value: '', label: 'Tous' }, ...statusOptions]}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        size="sm"
                        clearable
                    />
                </Group>
            </Group>

            <Paper withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Client</Table.Th>
                            <Table.Th>Hébergement</Table.Th>
                            <Table.Th>Dates</Table.Th>
                            <Table.Th>Personnes</Table.Th>
                            <Table.Th>Montant</Table.Th>
                            <Table.Th>Statut</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filteredReservations.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={8}>
                                    <Text c="dimmed" ta="center" py="md">Aucune réservation</Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            filteredReservations.map((reservation) => (
                                <Table.Tr key={reservation.id_reservation}>
                                    <Table.Td>
                                        <Text fw={500}>#{reservation.id_reservation}</Text>
                                    </Table.Td>
                                    <Table.Td>Client #{reservation.client_id}</Table.Td>
                                    <Table.Td>Héb. #{reservation.hebergement_id}</Table.Td>
                                    <Table.Td>
                                        <Text size="sm">
                                            {formatDate(reservation.arrivee)} → {formatDate(reservation.depart)}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        {reservation.adultes}A + {reservation.enfants || 0}E
                                    </Table.Td>
                                    <Table.Td>
                                        <Text fw={600}>{parseFloat(reservation.total_sejour || 0).toFixed(2)} €</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Select
                                            data={statusOptions}
                                            value={reservation.statut}
                                            onChange={(value) => handleStatusChange(reservation.id_reservation, value)}
                                            size="xs"
                                            w={130}
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionIcon
                                            color="red"
                                            variant="subtle"
                                            onClick={() => handleDelete(reservation.id_reservation)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </Paper>
        </Stack>
    );
}
