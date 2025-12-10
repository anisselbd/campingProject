import { Modal, TextInput, Select, Group, Button } from '@mantine/core';

export function EmployeeModal({
    opened,
    onClose,
    form,
    setForm,
    rolesInternes,
    onRoleSelect,
    onSubmit,
    isEditing = false
}) {
    const title = isEditing ? "Modifier l'employé" : "Ajouter un employé";
    const submitLabel = isEditing ? "Enregistrer" : "Créer";
    const formType = isEditing ? 'edit' : 'add';

    return (
        <Modal opened={opened} onClose={onClose} title={title} size="md">
            <TextInput
                label="Nom"
                placeholder={isEditing ? "" : "Dupont"}
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                mb="md"
                required={!isEditing}
            />
            <TextInput
                label="Prénom"
                placeholder={isEditing ? "" : "Jean"}
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                mb="md"
                required={!isEditing}
            />
            <Select
                label="Rôle"
                placeholder="Sélectionner un rôle"
                data={[
                    ...rolesInternes,
                    { value: 'new', label: '➕ Ajouter un nouveau rôle...' }
                ]}
                value={form.role_interne}
                onChange={(val) => onRoleSelect(val, formType)}
                mb="md"
                clearable={isEditing}
                required={!isEditing}
            />
            <TextInput
                label="Email"
                type="email"
                placeholder={isEditing ? "" : "jean.dupont@camping.com"}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                mb="xl"
                required={!isEditing}
            />
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annuler</Button>
                <Button color="brand" onClick={onSubmit}>{submitLabel}</Button>
            </Group>
        </Modal>
    );
}
