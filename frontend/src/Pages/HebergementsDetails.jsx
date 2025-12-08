import { Container, Title, Text, Button, Image, SimpleGrid, Group, Badge, Paper, List, ThemeIcon, Loader, Center, Alert, Box } from '@mantine/core';
import { IconUsers, IconRuler, IconMapPin, IconCheck, IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function HebergementsDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hebergement, setHebergement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`/api/hebergements/${id}`);
                setHebergement(response.data);
            } catch (err) {
                console.error("Erreur chargement détails:", err);
                setError("Impossible de charger les détails de cet hébergement.");
            } finally { //finally peut etre remplace par un return 
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <Center h={400}>
                <Loader size="xl" color="brand" />
            </Center>
        );
    }

    if (error || !hebergement) {
        return (
            <Container size="xl" py="xl">
                <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb="xl">
                    {error || "Hébergement non trouvé"}
                </Alert>
                <Button leftSection={<IconArrowLeft size={16} />} variant="subtle" onClick={() => navigate('/hebergements')}>
                    Retour aux hébergements
                </Button>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Button
                leftSection={<IconArrowLeft size={16} />}
                variant="subtle"
                color="gray"
                mb="md"
                onClick={() => navigate('/hebergements')}
            >
                Retour
            </Button>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                <Box>
                    <Image
                        src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                        radius="md"
                        h={400}
                        fit="cover"
                        alt={hebergement.nom_commercial}
                        mb="sm"
                    />
                    <Group>
                        <Image src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" w={100} h={80} radius="sm" fit="cover" />
                        <Image src="https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" w={100} h={80} radius="sm" fit="cover" />
                    </Group>
                </Box>
                <Box>
                    <Group justify="space-between" align="flex-start">
                        <Title order={1} style={{ fontFamily: 'Montserrat, sans-serif' }}>{hebergement.nom_commercial}</Title>
                        <Badge size="lg" color="brand" variant="light">{hebergement.type_hebergement}</Badge>
                    </Group>

                    <Text size="xl" fw={700} c="brand" mt="sm">{hebergement.prix_base_nuitee}€ <Text span size="sm" c="dimmed" fw={400}>/ nuit</Text></Text>
                    <Text mt="md" size="lg" c="dimmed">
                        {hebergement.description}
                    </Text>
                    <Group mt="xl" spacing="xl">
                        <Group gap={5}>
                            <IconUsers size={20} color="gray" />
                            <Text>{hebergement.capacite_max} Personnes</Text>
                        </Group>
                        <Group gap={5}>
                            <IconRuler size={20} color="gray" />
                            <Text>{hebergement.surface_m2} m²</Text>
                        </Group>
                        <Group gap={5}>
                            <IconMapPin size={20} color="gray" />
                            <Text>{hebergement.localisation || "Emplacement calme"}</Text>
                        </Group>
                    </Group>
                    <Paper withBorder p="md" radius="md" mt="xl">
                        <Title order={3} size="h4" mb="md">Équipements inclus</Title>
                        <List
                            spacing="xs"
                            size="sm"
                            center
                            icon={
                                <ThemeIcon color="green" size={20} radius="xl">
                                    <IconCheck size={12} />
                                </ThemeIcon>
                            }
                        >
                            <List.Item>Wi-Fi gratuit</List.Item>
                            <List.Item>Place de parking</List.Item>
                            <List.Item>Accès piscine</List.Item>
                            <List.Item>Cuisine équipée</List.Item>
                        </List>
                    </Paper>
                    <Button fullWidth size="lg" color="brand" mt="xl">
                        Réserver maintenant
                    </Button>
                </Box>
            </SimpleGrid>
        </Container>
    );
}
