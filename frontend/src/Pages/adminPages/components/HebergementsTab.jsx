import { Table, Badge, Group, ActionIcon, Button, Loader, Center, Alert } from '@mantine/core';
import { IconTrash, IconEdit, IconPlus, IconCheck, IconX } from '@tabler/icons-react';

export function HebergementsTab({
    hebergements,
    loading,
    error,
    onAdd,
    onEdit,
    onToggleReservable,
    onDelete
}) {
    if (loading) {
        return <Center h={200}><Loader /></Center>;
    }

    if (error) {
        return <Alert color="red">{error}</Alert>;
    }

    return (
        <>
            <Button leftSection={<IconPlus size={16} />} mb="md" color="brand" onClick={onAdd}>
                Ajouter un hébergement
            </Button>
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Nom</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Capacité</Table.Th>
                        <Table.Th>Réservable</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {hebergements.map((h) => (
                        <Table.Tr key={h.id_hebergement}>
                            <Table.Td>{h.id_hebergement}</Table.Td>
                            <Table.Td>{h.nom_commercial}</Table.Td>
                            <Table.Td>{h.type_hebergement}</Table.Td>
                            <Table.Td>{h.capacite_max} pers.</Table.Td>
                            <Table.Td>
                                <Badge color={h.reservable ? 'green' : 'gray'}>
                                    {h.reservable ? 'Oui' : 'Non'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Group gap={5}>
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        title="Modifier"
                                        onClick={() => onEdit(h)}
                                    >
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="subtle"
                                        color={h.reservable ? 'orange' : 'green'}
                                        onClick={() => onToggleReservable(h.id_hebergement, h.reservable)}
                                        title={h.reservable ? 'Rendre indisponible' : 'Rendre disponible'}
                                    >
                                        {h.reservable ? <IconX size={16} /> : <IconCheck size={16} />}
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={() => onDelete(h.id_hebergement)}
                                        title="Supprimer"
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </>
    );
}
