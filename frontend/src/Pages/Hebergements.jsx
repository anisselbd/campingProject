import { Container, Title, SimpleGrid, Card, Image, Text, Badge, Button, Group, Loader, Center, Alert } from '@mantine/core';
import { IconUsers, IconRuler, IconMapPin, IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export function Hebergements() {
    const [hebergements, setHebergements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchHebergements = async () => {
            try {
                const response = await axios.get('/api/hebergements/available');
                let data = response.data;
                const travelers = searchParams.get('travelers');
                if (travelers) {
                    data = data.filter(h => h.capacite_max >= parseInt(travelers));
                }

                setHebergements(data);
            } catch (err) {
                console.error("Erreur chargement hébergements:", err);
                setError("Impossible de charger les hébergements. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchHebergements();
    }, [searchParams]);

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

    return (
        <Container size="xl" py="xl">
            <Title order={1} align="center" mb={50} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Nos Hébergements
            </Title>
            {hebergements.length === 0 ? (
                <Text align="center" size="lg" c="dimmed">Aucun hébergement trouvé.</Text>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                    {hebergements.map((item) => (
                        <Card key={item.id_hebergement || item.reference_interne} shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section>
                                <Image
                                    src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    height={160}
                                    alt={item.nom_commercial}
                                />
                            </Card.Section>
                            <Group justify="space-between" mt="md" mb="xs">
                                <Text fw={500}>{item.nom_commercial}</Text>
                                <Badge color="brand" variant="light">
                                    {item.type_hebergement || 'Premium'}
                                </Badge>
                            </Group>
                            <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                                {item.description || "Profitez d'un séjour inoubliable dans cet hébergement tout confort."}
                            </Text>

                            <Group gap="lg" mb="md">
                                <Group gap={5}>
                                    <IconUsers size={16} color="gray" />
                                    <Text size="sm" c="dimmed">{item.capacite_max} Pers.</Text>
                                </Group>
                                <Group gap={5}>
                                    <IconRuler size={16} color="gray" />
                                    <Text size="sm" c="dimmed">{item.surface_m2} m²</Text>
                                </Group>
                            </Group>
                            {item.localisation && (
                                <Group gap={5} mb="md">
                                    <IconMapPin size={16} color="gray" />
                                    <Text size="sm" c="dimmed">{item.localisation}</Text>
                                </Group>
                            )}
                            <Button
                                color="brand"
                                fullWidth
                                mt="md"
                                radius="md"
                                component="a"
                                href={`/hebergements/${item.id_hebergement}`}
                            >
                                Voir les détails
                            </Button>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}
