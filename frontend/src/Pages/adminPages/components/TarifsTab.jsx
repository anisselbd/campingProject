import { Table, Button, Group, Text, Loader, Center, Alert, NumberInput, Select, Paper, ActionIcon, Stack, Badge } from '@mantine/core';
import { IconAlertCircle, IconEdit, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export function TarifsTab({ tarifs, seasons, typesHebergement, loading, error, token, onRefresh }) {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [addMode, setAddMode] = useState(false);
    const [addForm, setAddForm] = useState({
        type_hebergement_id: '',
        saison_id: '',
        personnes_incluses: 4,
        prix_par_nuit: 50,
        supplement_personne: 10,
        min_nuits: 2
    });
    const [actionLoading, setActionLoading] = useState(false);

    const saisonColors = {
        'BS': 'blue',
        'MS': 'green',
        'HS': 'orange',
        'THS': 'red'
    };

    const handleEdit = (tarif) => {
        setEditingId(tarif.id_tarif);
        setEditForm({
            personnes_incluses: tarif.personnes_incluses,
            prix_par_nuit: parseFloat(tarif.prix_par_nuit),
            supplement_personne: parseFloat(tarif.supplement_personne),
            min_nuits: tarif.min_nuits
        });
    };

    const handleSave = async () => {
        setActionLoading(true);
        try {
            const response = await fetch(`/api/tarif/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            if (response.ok) {
                onRefresh();
                setEditingId(null);
            }
        } catch (err) {
            console.error('Erreur mise à jour:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce tarif ?')) return;
        setActionLoading(true);
        try {
            await fetch(`/api/tarif/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onRefresh();
        } catch (err) {
            console.error('Erreur suppression:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!addForm.type_hebergement_id || !addForm.saison_id) return;
        setActionLoading(true);
        try {
            const response = await fetch('/api/tarif', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...addForm,
                    validite_debut: '2025-01-01',
                    validite_fin: '2025-12-31'
                })
            });
            if (response.ok) {
                onRefresh();
                setAddMode(false);
                setAddForm({
                    type_hebergement_id: '',
                    saison_id: '',
                    personnes_incluses: 4,
                    prix_par_nuit: 50,
                    supplement_personne: 10,
                    min_nuits: 2
                });
            }
        } catch (err) {
            console.error('Erreur création:', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <Center h={200}><Loader /></Center>;
    }

    if (error) {
        return <Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert>;
    }

    const seasonOptions = seasons.map(s => ({ value: String(s.id_saison), label: s.nom }));
    const typeOptions = typesHebergement.map(t => ({ value: String(t.id_type), label: t.nom }));

    return (
        <Stack>
            <Group justify="space-between">
                <Text fw={500}>Gestion des tarifs</Text>
                <Button leftSection={<IconPlus size={16} />} onClick={() => setAddMode(true)} disabled={addMode}>
                    Ajouter un tarif
                </Button>
            </Group>

            <Paper withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Saison</Table.Th>
                            <Table.Th>Prix/nuit</Table.Th>
                            <Table.Th>Pers. incluses</Table.Th>
                            <Table.Th>Suppl./pers.</Table.Th>
                            <Table.Th>Min. nuits</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {addMode && (
                            <Table.Tr>
                                <Table.Td>
                                    <Select size="xs" data={typeOptions} value={addForm.type_hebergement_id} onChange={(v) => setAddForm({ ...addForm, type_hebergement_id: v })} placeholder="Type" />
                                </Table.Td>
                                <Table.Td>
                                    <Select size="xs" data={seasonOptions} value={addForm.saison_id} onChange={(v) => setAddForm({ ...addForm, saison_id: v })} placeholder="Saison" />
                                </Table.Td>
                                <Table.Td>
                                    <NumberInput size="xs" value={addForm.prix_par_nuit} onChange={(v) => setAddForm({ ...addForm, prix_par_nuit: v })} min={0} suffix=" €" />
                                </Table.Td>
                                <Table.Td>
                                    <NumberInput size="xs" value={addForm.personnes_incluses} onChange={(v) => setAddForm({ ...addForm, personnes_incluses: v })} min={1} />
                                </Table.Td>
                                <Table.Td>
                                    <NumberInput size="xs" value={addForm.supplement_personne} onChange={(v) => setAddForm({ ...addForm, supplement_personne: v })} min={0} suffix=" €" />
                                </Table.Td>
                                <Table.Td>
                                    <NumberInput size="xs" value={addForm.min_nuits} onChange={(v) => setAddForm({ ...addForm, min_nuits: v })} min={1} />
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <ActionIcon color="green" onClick={handleAdd} loading={actionLoading}><IconCheck size={16} /></ActionIcon>
                                        <ActionIcon color="gray" onClick={() => setAddMode(false)}><IconX size={16} /></ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        )}
                        {tarifs.map((tarif) => (
                            <Table.Tr key={tarif.id_tarif}>
                                {editingId === tarif.id_tarif ? (
                                    <>
                                        <Table.Td>{tarif.type_hebergement}</Table.Td>
                                        <Table.Td>
                                            <Badge color={saisonColors[tarif.saison_code] || 'gray'}>{tarif.saison}</Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <NumberInput size="xs" value={editForm.prix_par_nuit} onChange={(v) => setEditForm({ ...editForm, prix_par_nuit: v })} min={0} suffix=" €" />
                                        </Table.Td>
                                        <Table.Td>
                                            <NumberInput size="xs" value={editForm.personnes_incluses} onChange={(v) => setEditForm({ ...editForm, personnes_incluses: v })} min={1} />
                                        </Table.Td>
                                        <Table.Td>
                                            <NumberInput size="xs" value={editForm.supplement_personne} onChange={(v) => setEditForm({ ...editForm, supplement_personne: v })} min={0} suffix=" €" />
                                        </Table.Td>
                                        <Table.Td>
                                            <NumberInput size="xs" value={editForm.min_nuits} onChange={(v) => setEditForm({ ...editForm, min_nuits: v })} min={1} />
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
                                        <Table.Td><Text fw={500}>{tarif.type_hebergement}</Text></Table.Td>
                                        <Table.Td>
                                            <Badge color={saisonColors[tarif.saison_code] || 'gray'} variant="light">{tarif.saison}</Badge>
                                        </Table.Td>
                                        <Table.Td><Text fw={600} c="brand">{parseFloat(tarif.prix_par_nuit).toFixed(2)} €</Text></Table.Td>
                                        <Table.Td>{tarif.personnes_incluses}</Table.Td>
                                        <Table.Td><Text c="dimmed">+{parseFloat(tarif.supplement_personne).toFixed(2)} €</Text></Table.Td>
                                        <Table.Td>{tarif.min_nuits}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <ActionIcon color="blue" onClick={() => handleEdit(tarif)}><IconEdit size={16} /></ActionIcon>
                                                <ActionIcon color="red" onClick={() => handleDelete(tarif.id_tarif)}><IconTrash size={16} /></ActionIcon>
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
    );
}
