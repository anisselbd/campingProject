import { Container, Title, Tabs, Center, Alert } from '@mantine/core';
import { IconUsers, IconHome, IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';

// Import des composants
import {
    UsersTab,
    EmployeesTab,
    HebergementsTab,
    EditHebergementModal,
    AddHebergementModal,
    AddTypeModal,
    EmployeeModal,
    AddRoleModal
} from './components';

export function Dashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    // États des données
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [employeesError, setEmployeesError] = useState(null);
    const [hebergements, setHebergements] = useState([]);
    const [hebergementsLoading, setHebergementsLoading] = useState(true);
    const [hebergementsError, setHebergementsError] = useState(null);
    const [typesHebergement, setTypesHebergement] = useState([]);

    // États des modals hébergements
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

    // États des modals employés
    const [editEmployeeModalOpened, { open: openEditEmployeeModal, close: closeEditEmployeeModal }] = useDisclosure(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editEmployeeForm, setEditEmployeeForm] = useState({
        nom: '',
        prenom: '',
        role_interne: '',
        email: ''
    });

    const [addEmployeeModalOpened, { open: openAddEmployeeModal, close: closeAddEmployeeModal }] = useDisclosure(false);
    const [addEmployeeForm, setAddEmployeeForm] = useState({
        nom: '',
        prenom: '',
        role_interne: '',
        email: ''
    });

    const [roleModalOpened, { open: openRoleModal, close: closeRoleModal }] = useDisclosure(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [rolesInternes, setRolesInternes] = useState([
        { value: 'Manager', label: 'Manager' },
        { value: 'Technicien', label: 'Technicien' },
        { value: 'Receptionniste', label: 'Réceptionniste' },
        { value: 'Entretien', label: 'Entretien' }
    ]);

    // Redirection si non-admin
    useEffect(() => {
        if (user && user.type_compte !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    // Chargement des données
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
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/api/employee', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(response.data);
            } catch (err) {
                console.error("Erreur chargement employees:", err);
                setEmployeesError("Impossible de charger les employés.");
            } finally {
                setEmployeesLoading(false);
            }
        };
        if (token) fetchEmployees();
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

    // Handlers Utilisateurs
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

    // Handlers Hébergements
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

    // Handlers Employés
    const handleOpenEditEmployeeModal = (employee) => {
        setEditingEmployee(employee);
        setEditEmployeeForm({
            nom: employee.nom || '',
            prenom: employee.prenom || '',
            role_interne: employee.role_interne || '',
            email: employee.email || ''
        });
        openEditEmployeeModal();
    };

    const handleSaveEmployee = async () => {
        try {
            await axios.put(`/api/employee/${editingEmployee.id_employee}`, editEmployeeForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(employees.map(e =>
                e.id_employee === editingEmployee.id_employee ? { ...e, ...editEmployeeForm } : e
            ));
            closeEditEmployeeModal();
        } catch (err) {
            console.error("Erreur mise à jour employé:", err);
            alert(err.response?.data?.message || "Erreur lors de la mise à jour");
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) return;
        try {
            await axios.delete(`/api/employee/${employeeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(employees.filter(e => e.id_employee !== employeeId));
        } catch (err) {
            console.error("Erreur suppression employé:", err);
        }
    };

    const handleCreateEmployee = async () => {
        try {
            const response = await axios.post('/api/employee', addEmployeeForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newEmployee = { ...addEmployeeForm, id_employee: response.data.employeeId };
            setEmployees([...employees, newEmployee]);
            closeAddEmployeeModal();
            setAddEmployeeForm({
                nom: '',
                prenom: '',
                role_interne: '',
                email: ''
            });
        } catch (err) {
            console.error("Erreur création employé:", err);
            alert(err.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleRoleSelect = (val, formType) => {
        if (val === 'new') {
            openRoleModal();
        } else {
            if (formType === 'add') {
                setAddEmployeeForm({ ...addEmployeeForm, role_interne: val });
            } else {
                setEditEmployeeForm({ ...editEmployeeForm, role_interne: val });
            }
        }
    };

    const handleCreateRole = () => {
        if (newRoleName.trim()) {
            const newRole = { value: newRoleName.trim(), label: newRoleName.trim() };
            setRolesInternes([...rolesInternes, newRole]);
            setAddEmployeeForm({ ...addEmployeeForm, role_interne: newRoleName.trim() });
            closeRoleModal();
            setNewRoleName('');
        }
    };

    // Vérification accès admin
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
                    <Tabs.Tab value="employees" leftSection={<IconUsers size={16} />}>
                        Employés ({employees.length})
                    </Tabs.Tab>
                    <Tabs.Tab value="hebergements" leftSection={<IconHome size={16} />}>
                        Hébergements ({hebergements.length})
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users">
                    <UsersTab
                        users={users}
                        loading={usersLoading}
                        error={usersError}
                        onToggleActive={handleToggleUserActive}
                        onDelete={handleDeleteUser}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="employees">
                    <EmployeesTab
                        employees={employees}
                        loading={employeesLoading}
                        error={employeesError}
                        onAdd={openAddEmployeeModal}
                        onEdit={handleOpenEditEmployeeModal}
                        onDelete={handleDeleteEmployee}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="hebergements">
                    <HebergementsTab
                        hebergements={hebergements}
                        loading={hebergementsLoading}
                        error={hebergementsError}
                        onAdd={openAddModal}
                        onEdit={handleOpenEditModal}
                        onToggleReservable={handleToggleReservable}
                        onDelete={handleDeleteHebergement}
                    />
                </Tabs.Panel>
            </Tabs>

            {/* Modals Hébergements */}
            <EditHebergementModal
                opened={editModalOpened}
                onClose={closeEditModal}
                form={editForm}
                setForm={setEditForm}
                onSave={handleSaveHebergement}
            />

            <AddHebergementModal
                opened={addModalOpened}
                onClose={closeAddModal}
                form={addForm}
                setForm={setAddForm}
                typesHebergement={typesHebergement}
                onTypeSelect={handleTypeSelect}
                onCreate={handleCreateHebergement}
            />

            <AddTypeModal
                opened={typeModalOpened}
                onClose={closeTypeModal}
                form={newTypeForm}
                setForm={setNewTypeForm}
                onCreate={handleCreateType}
            />

            {/* Modals Employés */}
            <EmployeeModal
                opened={editEmployeeModalOpened}
                onClose={closeEditEmployeeModal}
                form={editEmployeeForm}
                setForm={setEditEmployeeForm}
                rolesInternes={rolesInternes}
                onRoleSelect={handleRoleSelect}
                onSubmit={handleSaveEmployee}
                isEditing={true}
            />

            <EmployeeModal
                opened={addEmployeeModalOpened}
                onClose={closeAddEmployeeModal}
                form={addEmployeeForm}
                setForm={setAddEmployeeForm}
                rolesInternes={rolesInternes}
                onRoleSelect={handleRoleSelect}
                onSubmit={handleCreateEmployee}
                isEditing={false}
            />

            <AddRoleModal
                opened={roleModalOpened}
                onClose={closeRoleModal}
                roleName={newRoleName}
                setRoleName={setNewRoleName}
                onCreate={handleCreateRole}
            />
        </Container>
    );
}
