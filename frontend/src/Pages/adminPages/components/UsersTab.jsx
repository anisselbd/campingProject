import { Table, Badge, Group, ActionIcon, Loader, Center, Alert } from '@mantine/core';
import { IconTrash, IconCheck, IconX } from '@tabler/icons-react';

export function UsersTab({
    users,
    loading,
    error,
    onToggleActive,
    onDelete
}) {
    if (loading) {
        return <Center h={200}><Loader /></Center>;
    }

    if (error) {
        return <Alert color="red">{error}</Alert>;
    }

    return (
        <Table striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Nom</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Statut</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {users.map((u) => (
                    <Table.Tr key={u.id_user}>
                        <Table.Td>{u.id_user}</Table.Td>
                        <Table.Td>{u.prenom} {u.nom}</Table.Td>
                        <Table.Td>{u.email}</Table.Td>
                        <Table.Td>
                            <Badge color={u.type_compte === 'admin' ? 'red' : 'blue'}>
                                {u.type_compte}
                            </Badge>
                        </Table.Td>
                        <Table.Td>
                            <Badge color={u.compte_actif ? 'green' : 'gray'}>
                                {u.compte_actif ? 'Actif' : 'Inactif'}
                            </Badge>
                        </Table.Td>
                        <Table.Td>
                            <Group gap={5}>
                                <ActionIcon
                                    variant="subtle"
                                    color={u.compte_actif ? 'orange' : 'green'}
                                    onClick={() => onToggleActive(u.id_user, u.compte_actif)}
                                    title={u.compte_actif ? 'Désactiver' : 'Activer'}
                                >
                                    {u.compte_actif ? <IconX size={16} /> : <IconCheck size={16} />}
                                </ActionIcon>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    onClick={() => onDelete(u.id_user)}
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
    );
}
