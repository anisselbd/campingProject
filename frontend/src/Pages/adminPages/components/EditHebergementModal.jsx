import { Modal, TextInput, Textarea, NumberInput, SimpleGrid, Group, Button } from '@mantine/core';

export function EditHebergementModal({
    opened,
    onClose,
    form,
    setForm,
    onSave
}) {
    return (
        <Modal opened={opened} onClose={onClose} title="Modifier l'hébergement" size="lg">
            <TextInput
                label="Nom commercial"
                value={form.nom_commercial}
                onChange={(e) => setForm({ ...form, nom_commercial: e.target.value })}
                mb="md"
            />
            <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                minRows={3}
                mb="md"
            />
            <SimpleGrid cols={2} mb="md">
                <NumberInput
                    label="Capacité max"
                    value={form.capacite_max}
                    onChange={(val) => setForm({ ...form, capacite_max: val })}
                    min={1}
                />
                <NumberInput
                    label="Surface (m²)"
                    value={form.surface_m2}
                    onChange={(val) => setForm({ ...form, surface_m2: val })}
                    min={1}
                />
            </SimpleGrid>
            <TextInput
                label="Localisation"
                value={form.localisation}
                onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                mb="xl"
            />
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annuler</Button>
                <Button color="brand" onClick={onSave}>Enregistrer</Button>
            </Group>
        </Modal>
    );
}
