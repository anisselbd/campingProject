import { Modal, TextInput, Textarea, NumberInput, SimpleGrid, Group, Button, Select } from '@mantine/core';

export function AddHebergementModal({
    opened,
    onClose,
    form,
    setForm,
    typesHebergement,
    onTypeSelect,
    onCreate
}) {
    return (
        <Modal opened={opened} onClose={onClose} title="Ajouter un hébergement" size="lg">
            <SimpleGrid cols={2} mb="md">
                <Select
                    label="Type hébergement"
                    placeholder="Sélectionner un type"
                    data={[
                        ...typesHebergement.map(t => ({ value: String(t.id_type), label: t.nom })),
                        { value: 'new', label: '➕ Ajouter un nouveau type...' }
                    ]}
                    value={form.type_hebergement ? String(form.type_hebergement) : null}
                    onChange={onTypeSelect}
                    required
                />
                <TextInput
                    label="Référence interne"
                    placeholder="CH-001"
                    value={form.reference_interne}
                    onChange={(e) => setForm({ ...form, reference_interne: e.target.value })}
                    required
                />
            </SimpleGrid>
            <TextInput
                label="Nom commercial"
                placeholder="Chalet Vue Lac"
                value={form.nom_commercial}
                onChange={(e) => setForm({ ...form, nom_commercial: e.target.value })}
                mb="md"
                required
            />
            <Textarea
                label="Description"
                placeholder="Description de l'hébergement..."
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
                    required
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
                placeholder="Zone A, près du lac..."
                value={form.localisation}
                onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                mb="xl"
            />
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annuler</Button>
                <Button color="brand" onClick={onCreate}>Créer</Button>
            </Group>
        </Modal>
    );
}
