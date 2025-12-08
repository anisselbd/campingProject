import { Container, Title, Tabs, Table, Badge, Button, Group, Text, Loader, Center, Alert, ActionIcon, TextInput, Modal, SimpleGrid, Textarea, NumberInput, Select } from '@mantine/core';
import { IconUsers, IconHome, IconSearch, IconTrash, IconEdit, IconPlus, IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';

export function Dashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);
    const [hebergements, setHebergements] = useState([]);
    const [hebergementsLoading, setHebergementsLoading] = useState(true);
    const [hebergementsError, setHebergementsError] = useState(null);
    const [typesHebergement, setTypesHebergement] = useState([]);
    const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
    const [editingHebergement, setEditingHebergement] = useState(null);
    const [editForm, setEditForm] = useState({
        nom_commercial: '',
        description: '',
        capacite_max: 0,
        surface_m2: 0,
        localisation: ''
    });

    const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [addForm, setAddForm] = useState({
        type_hebergement: '',
        reference_interne: '',
        nom_commercial: '',
        description: '',
        capacite_max: 4,
        surface_m2: 30,
        localisation: '',
        reservable: true
    });

    const [typeModalOpened, { open: openTypeModal, close: closeTypeModal }] = useDisclosure(false);
    const [newTypeForm, setNewTypeForm] = useState({
        nom: '',
        code: '',
        description: ''
    });



    useEffect(() => {
        if (user && user.type_compte !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (err) {
                console.error("Erreur chargement users:", err);
                setUsersError("Impossible de charger les utilisateurs.");
            } finally {
                setUsersLoading(false);
            }
        };
        if (token) fetchUsers();
    }, [token]);

    useEffect(() => {
        const fetchHebergements = async () => {
            try {
                const response = await axios.get('/api/hebergements', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHebergements(response.data);
            } catch (err) {
                console.error("Erreur chargement hebergements:", err);
                setHebergementsError("Impossible de charger les hébergements.");
            } finally {
                setHebergementsLoading(false);
            }
        };
        if (token) fetchHebergements();
    }, [token]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await axios.get('/api/types-hebergement/active');
                setTypesHebergement(response.data);
            } catch (err) {
                console.error("Erreur chargement types:", err);
            }
        };
        fetchTypes();
    }, []);

    const handleToggleUserActive = async (userId, isActive) => {
        try {
            const endpoint = isActive ? 'deactivate' : 'activate';
            await axios.put(`/api/users/${userId}/${endpoint}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(u =>
                u.id_user === userId ? { ...u, compte_actif: isActive ? 0 : 1 } : u
            ));
        } catch (err) {
            console.error("Erreur toggle user:", err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
        try {
            await axios.delete(`/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id_user !== userId));
        } catch (err) {
            console.error("Erreur suppression user:", err);
        }
    };

    const handleDeleteHebergement = async (hebergementId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet hébergement ?")) return;
        try {
            await axios.delete(`/api/hebergements/${hebergementId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHebergements(hebergements.filter(h => h.id_hebergement !== hebergementId));
        } catch (err) {
            console.error("Erreur suppression hebergement:", err);
        }
    };

    const handleToggleReservable = async (hebergementId, isReservable) => {
        try {
            const newReservableValue = isReservable ? false : true;
            await axios.put(`/api/hebergements/${hebergementId}/reservable`,
                { reservable: newReservableValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setHebergements(hebergements.map(h =>
                h.id_hebergement === hebergementId ? { ...h, reservable: newReservableValue ? 1 : 0 } : h
            ));
        } catch (err) {
            console.error("Erreur toggle reservable:", err);
        }
    };

    const handleOpenEditModal = (hebergement) => {
        setEditingHebergement(hebergement);
        setEditForm({
            nom_commercial: hebergement.nom_commercial || '',
            description: hebergement.description || '',
            capacite_max: hebergement.capacite_max || 0,
            surface_m2: hebergement.surface_m2 || 0,
            localisation: hebergement.localisation || ''
        });
        openEditModal();
    };

    const handleSaveHebergement = async () => {
        try {
            await axios.put(`/api/hebergements/${editingHebergement.id_hebergement}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHebergements(hebergements.map(h =>
                h.id_hebergement === editingHebergement.id_hebergement ? { ...h, ...editForm } : h
            ));
            closeEditModal();
        } catch (err) {
            console.error("Erreur mise à jour hebergement:", err);
        }
    };

    const handleCreateHebergement = async () => {
        try {
            const payload = {
                ...addForm,
                reservable: addForm.reservable ? 1 : 0
            };
            const response = await axios.post('/api/hebergements', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newHebergement = { ...addForm, id_hebergement: response.data.hebergementId };
            setHebergements([...hebergements, newHebergement]);
            closeAddModal();
            setAddForm({
                type_hebergement: '',
                reference_interne: '',
                nom_commercial: '',
                description: '',
                capacite_max: 4,
                surface_m2: 30,
                localisation: '',
                reservable: true
            });
        } catch (err) {
            console.error("Erreur création hebergement:", err);
            alert(err.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleCreateType = async () => {
        try {
            const response = await axios.post('/api/types-hebergement', newTypeForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newType = { ...newTypeForm, id_type: response.data.typeId };
            setTypesHebergement([...typesHebergement, newType]);
            setAddForm({ ...addForm, type_hebergement: response.data.typeId });
            closeTypeModal();
            setNewTypeForm({ nom: '', code: '', description: '' });
        } catch (err) {
            console.error("Erreur création type:", err);
            alert(err.response?.data?.message || "Erreur lors de la création du type");
        }
    };

    const handleTypeSelect = (val) => {
        if (val === 'new') {
            openTypeModal();
        } else {
            setAddForm({ ...addForm, type_hebergement: parseInt(val) });
        }
    };

    if (!user || user.type_compte !== 'admin') {
        return (
            <Center h={400}>
                <Alert icon={<IconAlertCircle size={16} />} title="Accès refusé" color="red">
                    Vous devez être administrateur pour accéder à cette page.
                </Alert>
            </Center>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Title order={1} mb="xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Tableau de bord Admin
            </Title>

            <Tabs defaultValue="users">
                <Tabs.List mb="xl">
                    <Tabs.Tab value="users" leftSection={<IconUsers size={16} />}>
                        Utilisateurs ({users.length})
                    </Tabs.Tab>
                    <Tabs.Tab value="hebergements" leftSection={<IconHome size={16} />}>
                        Hébergements ({hebergements.length})
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="users">
                    {usersLoading ? (
                        <Center h={200}><Loader /></Center>
                    ) : usersError ? (
                        <Alert color="red">{usersError}</Alert>
                    ) : (
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
                                                    onClick={() => handleToggleUserActive(u.id_user, u.compte_actif)}
                                                    title={u.compte_actif ? 'Désactiver' : 'Activer'}
                                                >
                                                    {u.compte_actif ? <IconX size={16} /> : <IconCheck size={16} />}
                                                </ActionIcon>
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => handleDeleteUser(u.id_user)}
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
                    )}
                </Tabs.Panel>
                <Tabs.Panel value="hebergements">
                    {hebergementsLoading ? (
                        <Center h={200}><Loader /></Center>
                    ) : hebergementsError ? (
                        <Alert color="red">{hebergementsError}</Alert>
                    ) : (
                        <>
                            <Button leftSection={<IconPlus size={16} />} mb="md" color="brand" onClick={openAddModal}>
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
                                                        onClick={() => handleOpenEditModal(h)}
                                                    >
                                                        <IconEdit size={16} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color={h.reservable ? 'orange' : 'green'}
                                                        onClick={() => handleToggleReservable(h.id_hebergement, h.reservable)}
                                                        title={h.reservable ? 'Rendre indisponible' : 'Rendre disponible'}
                                                    >
                                                        {h.reservable ? <IconX size={16} /> : <IconCheck size={16} />}
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={() => handleDeleteHebergement(h.id_hebergement)}
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
                    )}
                </Tabs.Panel>
            </Tabs>

            {/* Modal d'édition d'hébergement */}
            <Modal opened={editModalOpened} onClose={closeEditModal} title="Modifier l'hébergement" size="lg">
                <TextInput
                    label="Nom commercial"
                    value={editForm.nom_commercial}
                    onChange={(e) => setEditForm({ ...editForm, nom_commercial: e.target.value })}
                    mb="md"
                />
                <Textarea
                    label="Description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    minRows={3}
                    mb="md"
                />
                <SimpleGrid cols={2} mb="md">
                    <NumberInput
                        label="Capacité max"
                        value={editForm.capacite_max}
                        onChange={(val) => setEditForm({ ...editForm, capacite_max: val })}
                        min={1}
                    />
                    <NumberInput
                        label="Surface (m²)"
                        value={editForm.surface_m2}
                        onChange={(val) => setEditForm({ ...editForm, surface_m2: val })}
                        min={1}
                    />
                </SimpleGrid>
                <TextInput
                    label="Localisation"
                    value={editForm.localisation}
                    onChange={(e) => setEditForm({ ...editForm, localisation: e.target.value })}
                    mb="xl"
                />
                <Group justify="flex-end">
                    <Button variant="default" onClick={closeEditModal}>Annuler</Button>
                    <Button color="brand" onClick={handleSaveHebergement}>Enregistrer</Button>
                </Group>
            </Modal>

            {/* Modal d'ajout d'hébergement */}
            <Modal opened={addModalOpened} onClose={closeAddModal} title="Ajouter un hébergement" size="lg">
                <SimpleGrid cols={2} mb="md">
                    <Select
                        label="Type hébergement"
                        placeholder="Sélectionner un type"
                        data={[
                            ...typesHebergement.map(t => ({ value: String(t.id_type), label: t.nom })),
                            { value: 'new', label: '➕ Ajouter un nouveau type...' }
                        ]}
                        value={addForm.type_hebergement ? String(addForm.type_hebergement) : null}
                        onChange={handleTypeSelect}
                        required
                    />
                    <TextInput
                        label="Référence interne"
                        placeholder="CH-001"
                        value={addForm.reference_interne}
                        onChange={(e) => setAddForm({ ...addForm, reference_interne: e.target.value })}
                        required
                    />
                </SimpleGrid>
                <TextInput
                    label="Nom commercial"
                    placeholder="Chalet Vue Lac"
                    value={addForm.nom_commercial}
                    onChange={(e) => setAddForm({ ...addForm, nom_commercial: e.target.value })}
                    mb="md"
                    required
                />
                <Textarea
                    label="Description"
                    placeholder="Description de l'hébergement..."
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    minRows={3}
                    mb="md"
                />
                <SimpleGrid cols={2} mb="md">
                    <NumberInput
                        label="Capacité max"
                        value={addForm.capacite_max}
                        onChange={(val) => setAddForm({ ...addForm, capacite_max: val })}
                        min={1}
                        required
                    />
                    <NumberInput
                        label="Surface (m²)"
                        value={addForm.surface_m2}
                        onChange={(val) => setAddForm({ ...addForm, surface_m2: val })}
                        min={1}
                    />
                </SimpleGrid>
                <TextInput
                    label="Localisation"
                    placeholder="Zone A, près du lac..."
                    value={addForm.localisation}
                    onChange={(e) => setAddForm({ ...addForm, localisation: e.target.value })}
                    mb="xl"
                />
                <Group justify="flex-end">
                    <Button variant="default" onClick={closeAddModal}>Annuler</Button>
                    <Button color="brand" onClick={handleCreateHebergement}>Créer</Button>
                </Group>
            </Modal>

            {/* Modal d'ajout de type */}
            <Modal opened={typeModalOpened} onClose={closeTypeModal} title="Nouveau type d'hébergement" size="md">
                <TextInput
                    label="Nom du type"
                    placeholder="Mobil-home, Tente, Caravane..."
                    value={newTypeForm.nom}
                    onChange={(e) => setNewTypeForm({ ...newTypeForm, nom: e.target.value })}
                    mb="md"
                    required
                />
                <TextInput
                    label="Code"
                    placeholder="MH, TE, CA..."
                    value={newTypeForm.code}
                    onChange={(e) => setNewTypeForm({ ...newTypeForm, code: e.target.value.toUpperCase() })}
                    mb="md"
                    required
                />
                <Textarea
                    label="Description"
                    placeholder="Description du type d'hébergement..."
                    value={newTypeForm.description}
                    onChange={(e) => setNewTypeForm({ ...newTypeForm, description: e.target.value })}
                    minRows={2}
                    mb="xl"
                />
                <Group justify="flex-end">
                    <Button variant="default" onClick={closeTypeModal}>Annuler</Button>
                    <Button color="brand" onClick={handleCreateType}>Créer le type</Button>
                </Group>
            </Modal>
        </Container>
    );
}
