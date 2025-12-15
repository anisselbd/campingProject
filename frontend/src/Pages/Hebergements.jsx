import { Container, Title, SimpleGrid, Card, Image, Text, Badge, Button, Group, Loader, Center, Alert } from '@mantine/core';
import { IconUsers, IconRuler, IconMapPin, IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import chalet1 from '../assets/chalet1.jpg';
import tente from '../assets/tente.jpg';
import mobileHome1 from '../assets/mobileHome1.jpg';
const imageMap = {
    'Chalet': chalet1,
    'Tente': tente,
    'Mobil-home': mobileHome1,
    'default': chalet1
};

export function Hebergements() {
    const [hebergements, setHebergements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const [tarifs, setTarifs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hebergementsRes, tarifsRes] = await Promise.all([
                    axios.get('/api/hebergements/available'),
                    axios.get('/api/tarif/public')
                ]);

                let data = hebergementsRes.data;
                const travelers = searchParams.get('travelers');
                if (travelers) {
                    data = data.filter(h => h.capacite_max >= parseInt(travelers));
                }

                setHebergements(data);
                setTarifs(tarifsRes.data);
            } catch (err) {
                console.error("Erreur chargement hébergements:", err);
                setError("Impossible de charger les hébergements. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const getPrixMin = (typeHebergement) => {
        const tarifsType = tarifs.filter(t => t.type_hebergement === typeHebergement);
        if (tarifsType.length === 0) return null;
        return Math.min(...tarifsType.map(t => parseFloat(t.prix_par_nuit)));
    };

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
                        <Card key={item.id_hebergement || item.reference_interne} shadow="sm" padding="lg" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Card.Section>
                                <Image
                                    src={imageMap[item.type_hebergement] || imageMap.default}
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
                            <Text size="sm" c="dimmed" lineClamp={3} mb="md" style={{ flexGrow: 1 }}>
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

                            {getPrixMin(item.type_hebergement) && (
                                <Text size="lg" fw={700} c="brand" mt="xs" mb="md">
                                    À partir de {getPrixMin(item.type_hebergement).toFixed(2)}€
                                    <Text span size="sm" c="dimmed" fw={400}> / nuit</Text>
                                </Text>
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
