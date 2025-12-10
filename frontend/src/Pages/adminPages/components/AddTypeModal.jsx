import { Modal, TextInput, Textarea, Group, Button } from '@mantine/core';

export function AddTypeModal({
    opened,
    onClose,
    form,
    setForm,
    onCreate
}) {
    return (
        <Modal opened={opened} onClose={onClose} title="Nouveau type d'hébergement" size="md">
            <TextInput
                label="Nom du type"
                placeholder="Mobil-home, Tente, Caravane..."
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                mb="md"
                required
            />
            <TextInput
                label="Code"
                placeholder="MH, TE, CA..."
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                mb="md"
                required
            />
            <Textarea
                label="Description"
                placeholder="Description du type d'hébergement..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                minRows={2}
                mb="xl"
            />
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annuler</Button>
                <Button color="brand" onClick={onCreate}>Créer le type</Button>
            </Group>
        </Modal>
    );
}
