import { Table, Button, Group, Text, Loader, Center, Alert, TextInput, Paper, ActionIcon, Stack } from '@mantine/core';
import { IconAlertCircle, IconEdit, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export function SeasonsTab({ seasons, loading, error, token, onRefresh }) {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [addMode, setAddMode] = useState(false);
    const [addForm, setAddForm] = useState({ nom: '', code: '', date_debut: '', date_fin: '', description: '' });
    const [actionLoading, setActionLoading] = useState(false);

    const handleEdit = (season) => {
        setEditingId(season.id_saison);
        setEditForm({
            nom: season.nom || '',
            code: season.code || '',
            date_debut: season.date_debut?.split('T')[0] || '',
            date_fin: season.date_fin?.split('T')[0] || '',
            description: season.description || ''
        });
    };

    const handleSave = async () => {
        setActionLoading(true);
        try {
            const response = await fetch(`/api/season/${editingId}`, {
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
        if (!window.confirm('Supprimer cette saison ?')) return;
        setActionLoading(true);
        try {
            await fetch(`/api/season/${id}`, {
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
        if (!addForm.nom || !addForm.code) return;
        setActionLoading(true);
        try {
            const response = await fetch('/api/season', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addForm)
            });
            if (response.ok) {
                onRefresh();
                setAddMode(false);
                setAddForm({ nom: '', code: '', date_debut: '', date_fin: '', description: '' });
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

    return (
        <Stack>
            <Group justify="space-between">
                <Text fw={500}>Gestion des saisons</Text>
                <Button leftSection={<IconPlus size={16} />} onClick={() => setAddMode(true)} disabled={addMode}>
                    Ajouter une saison
                </Button>
            </Group>

            <Paper withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nom</Table.Th>
                            <Table.Th>Code</Table.Th>
                            <Table.Th>Date début</Table.Th>
                            <Table.Th>Date fin</Table.Th>
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
                                    <TextInput size="xs" type="date" value={addForm.date_debut} onChange={(e) => setAddForm({ ...addForm, date_debut: e.target.value })} />
                                </Table.Td>
                                <Table.Td>
                                    <TextInput size="xs" type="date" value={addForm.date_fin} onChange={(e) => setAddForm({ ...addForm, date_fin: e.target.value })} />
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
                        {seasons.map((season) => (
                            <Table.Tr key={season.id_saison}>
                                {editingId === season.id_saison ? (
                                    <>
                                        <Table.Td>
                                            <TextInput size="xs" value={editForm.nom} onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })} />
                                        </Table.Td>
                                        <Table.Td>
                                            <TextInput size="xs" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} />
                                        </Table.Td>
                                        <Table.Td>
                                            <TextInput size="xs" type="date" value={editForm.date_debut} onChange={(e) => setEditForm({ ...editForm, date_debut: e.target.value })} />
                                        </Table.Td>
                                        <Table.Td>
                                            <TextInput size="xs" type="date" value={editForm.date_fin} onChange={(e) => setEditForm({ ...editForm, date_fin: e.target.value })} />
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
                                        <Table.Td>{season.nom}</Table.Td>
                                        <Table.Td><Text c="dimmed" size="sm">{season.code}</Text></Table.Td>
                                        <Table.Td>{season.date_debut?.split('T')[0]}</Table.Td>
                                        <Table.Td>{season.date_fin?.split('T')[0]}</Table.Td>
                                        <Table.Td><Text size="sm" lineClamp={1}>{season.description}</Text></Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <ActionIcon color="blue" onClick={() => handleEdit(season)}><IconEdit size={16} /></ActionIcon>
                                                <ActionIcon color="red" onClick={() => handleDelete(season.id_saison)}><IconTrash size={16} /></ActionIcon>
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
