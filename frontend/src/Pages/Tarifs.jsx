import { Container, Title, Table, Text, Badge, Loader, Center, Alert, Card, Group, Stack } from '@mantine/core';
import { IconAlertCircle, IconUsers, IconMoon, IconCurrencyEuro } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Tarifs() {
    const [tarifs, setTarifs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTarifs = async () => {
            try {
                const response = await axios.get('/api/tarif/public');
                setTarifs(response.data);
            } catch (err) {
                console.error("Erreur chargement tarifs:", err);
                setError("Impossible de charger les tarifs. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };
        fetchTarifs();
    }, []);

    if (loading) {
        return (
            <Center h={400}>
                <Loader size="xl" color="brand" />
            </Center>
        );
    }

    if (error) {
        return (
            <Container size="xl" py="xl">
                <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red">
                    {error}
                </Alert>
            </Container>
        );
    }

    // group des tarifs par type d'hébergement
    const tarifsByType = tarifs.reduce((acc, tarif) => {
        const type = tarif.type_hebergement;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(tarif);
        return acc;
    }, {});

    // ordre des saisons
    const saisonOrder = ['Basse saison', 'Moyenne saison', 'Haute saison', 'Très haute saison'];

    // couleurs des badges par saison
    const saisonColors = {
        'Basse saison': 'blue',
        'Moyenne saison': 'green',
        'Haute saison': 'orange',
        'Très haute saison': 'red'
    };

    return (
        <Container size="xl" py="xl">
            <Title order={1} ta="center" mb={20} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Nos Tarifs
            </Title>
            <Text ta="center" c="dimmed" mb={50} size="lg">
                Découvrez nos tarifs selon la saison et le type d'hébergement
            </Text>

            {Object.keys(tarifsByType).length === 0 ? (
                <Text ta="center" size="lg" c="dimmed">Aucun tarif disponible.</Text>
            ) : (
                <Stack gap="xl">
                    {Object.entries(tarifsByType).map(([type, typeTarifs]) => (
                        <Card key={type} shadow="sm" padding="lg" radius="md" withBorder>
                            <Title order={3} mb="md" c="brand">
                                {type}
                            </Title>
                            <Table striped highlightOnHover withTableBorder withColumnBorders>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Saison</Table.Th>
                                        <Table.Th style={{ textAlign: 'center' }}>
                                            <Group gap={5} justify="center">
                                                <IconCurrencyEuro size={16} />
                                                Prix / nuit
                                            </Group>
                                        </Table.Th>
                                        <Table.Th style={{ textAlign: 'center' }}>
                                            <Group gap={5} justify="center">
                                                <IconUsers size={16} />
                                                Pers. incluses
                                            </Group>
                                        </Table.Th>
                                        <Table.Th style={{ textAlign: 'center' }}>Suppl. / pers.</Table.Th>
                                        <Table.Th style={{ textAlign: 'center' }}>
                                            <Group gap={5} justify="center">
                                                <IconMoon size={16} />
                                                Min. nuits
                                            </Group>
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {typeTarifs
                                        .sort((a, b) => saisonOrder.indexOf(a.saison) - saisonOrder.indexOf(b.saison))
                                        .map((tarif) => (
                                            <Table.Tr key={tarif.id_tarif}>
                                                <Table.Td>
                                                    <Badge
                                                        color={saisonColors[tarif.saison] || 'gray'}
                                                        variant="light"
                                                        size="lg"
                                                    >
                                                        {tarif.saison}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td style={{ textAlign: 'center' }}>
                                                    <Text fw={700} size="lg" c="brand">
                                                        {parseFloat(tarif.prix_par_nuit).toFixed(2)} €
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td style={{ textAlign: 'center' }}>
                                                    <Text>{tarif.personnes_incluses}</Text>
                                                </Table.Td>
                                                <Table.Td style={{ textAlign: 'center' }}>
                                                    <Text c="dimmed">+{parseFloat(tarif.supplement_personne).toFixed(2)} €</Text>
                                                </Table.Td>
                                                <Table.Td style={{ textAlign: 'center' }}>
                                                    <Text>{tarif.min_nuits} nuit{tarif.min_nuits > 1 ? 's' : ''}</Text>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                </Table.Tbody>
                            </Table>
                        </Card>
                    ))}
                </Stack>
            )}

            <Card mt="xl" padding="lg" radius="md" bg="gray.0">
                <Title order={4} mb="sm">Informations importantes</Title>
                <Text size="sm" c="dimmed">
                    • Les tarifs sont indiqués par nuit et incluent le nombre de personnes mentionné.<br />
                    • Un supplément par personne additionnelle s'applique au-delà du nombre inclus.<br />
                    • Le nombre minimum de nuits peut varier selon la saison.<br />
                    • Taxe de séjour non incluse.
                </Text>
            </Card>
        </Container>
    );
}
