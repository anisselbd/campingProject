import { Table, Button, Group, Text, Loader, Center, Alert, TextInput, Paper, ActionIcon, Stack, Badge, Select, MultiSelect } from '@mantine/core';
import { IconAlertCircle, IconEdit, IconTrash, IconPlus, IconCheck, IconX, IconLink } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function EquipmentsTab({ token }) {
    const [equipments, setEquipments] = useState([]);
    const [hebergements, setHebergements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [addMode, setAddMode] = useState(false);
    const [addForm, setAddForm] = useState({ nom: '', code: '', description: '' });
    const [actionLoading, setActionLoading] = useState(false);

    // const pour les tables d'associations
    const [selectedHebergement, setSelectedHebergement] = useState(null);
    const [hebergementEquipments, setHebergementEquipments] = useState([]);
    const [selectedEquipments, setSelectedEquipments] = useState([]);

    const fetchEquipments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/equipment', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEquipments(response.data.recupEquipments || []);
        } catch (err) {
            console.error('Erreur chargement équipements:', err);
            setError('Impossible de charger les équipements.');
        } finally {
            setLoading(false);
        }
    };

    const fetchHebergements = async () => {
        try {
            const response = await axios.get('/api/hebergements', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHebergements(response.data || []);
        } catch (err) {
            console.error('Erreur chargement hébergements:', err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchEquipments();
            fetchHebergements();
        }
    }, [token]);

    useEffect(() => {
        const fetchHebergementEquipments = async () => {
            if (!selectedHebergement) {
                setHebergementEquipments([]);
                setSelectedEquipments([]);
                return;
            }
            try {
                const response = await axios.get(`/api/hebergementEquipement/${selectedHebergement}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const equips = response.data.equipements || [];
                setHebergementEquipments(equips);
                setSelectedEquipments(equips.map(e => String(e.id_equipment)));
            } catch (err) {
                console.error('Erreur:', err);
            }
        };
        fetchHebergementEquipments();
    }, [selectedHebergement, token]);

    const handleEdit = (equipment) => {
        setEditingId(equipment.id_equipment);
        setEditForm({
            nom: equipment.nom || '',
            code: equipment.code || '',
            description: equipment.description || ''
        });
    };

    const handleSave = async () => {
        setActionLoading(true);
        try {
            await axios.put(`/api/equipment/${editingId}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEquipments();
            setEditingId(null);
        } catch (err) {
            console.error('Erreur mise à jour:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet équipement ?')) return;
        setActionLoading(true);
        try {
            await axios.delete(`/api/equipment/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEquipments();
        } catch (err) {
            console.error('Erreur suppression:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!addForm.nom || !addForm.code) return;
        setActionLoading(true);
        try {
            await axios.post('/api/equipment', addForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEquipments();
            setAddMode(false);
            setAddForm({ nom: '', code: '', description: '' });
        } catch (err) {
            console.error('Erreur création:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssociationChange = async (newSelected) => {
        if (!selectedHebergement) return;

        const currentIds = hebergementEquipments.map(e => String(e.id_equipment));
        const toAdd = newSelected.filter(id => !currentIds.includes(id));
        const toRemove = currentIds.filter(id => !newSelected.includes(id));

        try {
            for (const equipId of toAdd) {
                await axios.post('/api/hebergementEquipement', {
                    hebergement_id: parseInt(selectedHebergement),
                    equipment_id: parseInt(equipId)
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            for (const equipId of toRemove) {
                await axios.delete(`/api/hebergementEquipement/${selectedHebergement}/${equipId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setSelectedEquipments(newSelected);
            const response = await axios.get(`/api/hebergementEquipement/${selectedHebergement}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHebergementEquipments(response.data.equipements || []);
        } catch (err) {
            console.error('Erreur association:', err);
        }
    };

    if (loading) {
        return <Center h={200}><Loader /></Center>;
    }

    if (error) {
        return <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>;
    }

    const hebergementOptions = hebergements.map(h => ({
        value: String(h.id_hebergement),
        label: h.nom_commercial
    }));

    const equipmentOptions = equipments.map(e => ({
        value: String(e.id_equipment),
        label: e.nom
    }));

    return (
        <Stack gap="xl">
            <Stack>
                <Group justify="space-between">
                    <Text fw={500}>Liste des équipements</Text>
                    <Button leftSection={<IconPlus size={16} />} onClick={() => setAddMode(true)} disabled={addMode}>
                        Ajouter un équipement
                    </Button>
                </Group>

                <Paper withBorder>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Nom</Table.Th>
                                <Table.Th>Code</Table.Th>
                                <Table.Th>Description</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {addMode && (
                                <Table.Tr>
                                    <Table.Td>
                                        <TextInput size="xs" value={addForm.nom} onChange={(e) => setAddForm({ ...addForm, nom: e.target.value })} placeholder="Nom" />
                                    </Table.Td>
                                    <Table.Td>
                                        <TextInput size="xs" value={addForm.code} onChange={(e) => setAddForm({ ...addForm, code: e.target.value })} placeholder="Code" />
                                    </Table.Td>
                                    <Table.Td>
                                        <TextInput size="xs" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} placeholder="Description" />
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon color="green" onClick={handleAdd} loading={actionLoading}><IconCheck size={16} /></ActionIcon>
                                            <ActionIcon color="gray" onClick={() => setAddMode(false)}><IconX size={16} /></ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                            {equipments.map((equipment) => (
                                <Table.Tr key={equipment.id_equipment}>
                                    {editingId === equipment.id_equipment ? (
                                        <>
                                            <Table.Td>
                                                <TextInput size="xs" value={editForm.nom} onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })} />
                                            </Table.Td>
                                            <Table.Td>
                                                <TextInput size="xs" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} />
                                            </Table.Td>
                                            <Table.Td>
                                                <TextInput size="xs" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                                            </Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <ActionIcon color="green" onClick={handleSave} loading={actionLoading}><IconCheck size={16} /></ActionIcon>
                                                    <ActionIcon color="gray" onClick={() => setEditingId(null)}><IconX size={16} /></ActionIcon>
                                                </Group>
                                            </Table.Td>
                                        </>
                                    ) : (
                                        <>
                                            <Table.Td><Text fw={500}>{equipment.nom}</Text></Table.Td>
                                            <Table.Td><Badge variant="light">{equipment.code}</Badge></Table.Td>
                                            <Table.Td><Text size="sm" lineClamp={1}>{equipment.description}</Text></Table.Td>
                                            <Table.Td>
                                                <Group gap="xs">
                                                    <ActionIcon color="blue" onClick={() => handleEdit(equipment)}><IconEdit size={16} /></ActionIcon>
                                                    <ActionIcon color="red" onClick={() => handleDelete(equipment.id_equipment)}><IconTrash size={16} /></ActionIcon>
                                                </Group>
                                            </Table.Td>
                                        </>
                                    )}
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Stack>

            <Paper withBorder p="md">
                <Group gap="xs" mb="md">
                    <IconLink size={20} />
                    <Text fw={500}>Associer équipements à un hébergement</Text>
                </Group>

                <Stack>
                    <Select
                        label="Sélectionner un hébergement"
                        placeholder="Choisir..."
                        data={hebergementOptions}
                        value={selectedHebergement}
                        onChange={setSelectedHebergement}
                        searchable
                        clearable
                    />

                    {selectedHebergement && (
                        <MultiSelect
                            label="Équipements associés"
                            placeholder="Sélectionner les équipements"
                            data={equipmentOptions}
                            value={selectedEquipments}
                            onChange={handleAssociationChange}
                            searchable
                        />
                    )}
                </Stack>
            </Paper>
        </Stack>
    );
}
