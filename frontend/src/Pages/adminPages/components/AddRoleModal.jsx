import { Modal, TextInput, Group, Button } from '@mantine/core';

export function AddRoleModal({
    opened,
    onClose,
    roleName,
    setRoleName,
    onCreate
}) {
    return (
        <Modal opened={opened} onClose={onClose} title="Nouveau rôle" size="sm">
            <TextInput
                label="Nom du rôle"
                placeholder="Ex: Animateur, Cuisinier..."
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                mb="xl"
                required
            />
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annuler</Button>
                <Button color="brand" onClick={onCreate}>Créer le rôle</Button>
            </Group>
        </Modal>
    );
}
