import { Table, Badge, Group, ActionIcon, Button, Loader, Center, Alert } from '@mantine/core';
import { IconTrash, IconEdit, IconPlus } from '@tabler/icons-react';

export function EmployeesTab({
    employees,
    loading,
    error,
    onAdd,
    onEdit,
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
                Ajouter un employé
            </Button>
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Nom</Table.Th>
                        <Table.Th>Prénom</Table.Th>
                        <Table.Th>Rôle</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {employees.map((e) => (
                        <Table.Tr key={e.id_employee}>
                            <Table.Td>{e.id_employee}</Table.Td>
                            <Table.Td>{e.nom}</Table.Td>
                            <Table.Td>{e.prenom}</Table.Td>
                            <Table.Td>
                                <Badge color={e.role_interne === 'Manager' ? 'violet' : e.role_interne === 'Technicien' ? 'cyan' : 'gray'}>
                                    {e.role_interne || 'Non défini'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>{e.email}</Table.Td>
                            <Table.Td>
                                <Group gap={5}>
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        title="Modifier"
                                        onClick={() => onEdit(e)}
                                    >
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        title="Supprimer"
                                        onClick={() => onDelete(e.id_employee)}
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
