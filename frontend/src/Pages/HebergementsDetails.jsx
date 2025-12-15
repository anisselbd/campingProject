import { Container, Title, Text, Button, Image, SimpleGrid, Group, Badge, Paper, List, ThemeIcon, Loader, Center, Alert, Box, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUsers, IconRuler, IconMapPin, IconCheck, IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { BookingModal } from '../Components/BookingModal';
import { trackViewHebergement } from '../utils/analytics';
import chalet1 from '../assets/chalet1.jpg';
import chalet2 from '../assets/chalet2.jpg';
import tente from '../assets/tente.jpg';
import mobileHome1 from '../assets/mobileHome1.jpg';
import mobilHome2 from '../assets/mobilHome2.jpg';
import mobilHome3 from '../assets/mobilHome3.jpg';


const imageMap = {
    'Chalet': chalet1,
    'Tente': tente,
    'Mobil-home': mobileHome1,
    'default': chalet1
};

const galleryMap = {
    'Chalet': [chalet2, chalet1],
    'Tente': [tente, tente],
    'Mobil-home': [mobilHome2, mobilHome3],
    'default': [chalet1, chalet2]
};

export function HebergementsDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [hebergement, setHebergement] = useState(null);
    const [equipements, setEquipements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [tarifs, setTarifs] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [hebergementRes, tarifsRes] = await Promise.all([
                    axios.get(`/api/hebergements/${id}`),
                    axios.get('/api/tarif/public')
                ]);

                setHebergement(hebergementRes.data);
                setTarifs(tarifsRes.data);

                // Track GA4 event: visualisation d'un hébergement
                trackViewHebergement(hebergementRes.data);
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

    // Fetch équipements de l'hébergement
    useEffect(() => {
        const fetchEquipements = async () => {
            try {
                const response = await axios.get(`/api/hebergementEquipement/public/${id}`);
                setEquipements(response.data);
            } catch (err) {
                console.error("Erreur chargement équipements:", err);
            }
        };

        if (id) {
            fetchEquipements();
        }
    }, [id]);

    // Fonction pour trouver le prix minimum d'un type d'hébergement
    const getPrixMin = (typeHebergement) => {
        const tarifsType = tarifs.filter(t => t.type_hebergement === typeHebergement);
        if (tarifsType.length === 0) return null;
        return Math.min(...tarifsType.map(t => parseFloat(t.prix_par_nuit)));
    };

    const handleReserverClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            openModal();
        }
    };

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
        <Container size="xl" py="xl" sx={(theme) => ({
            '@media (max-width: 767px)': {
                paddingTop: theme.spacing.lg,
                paddingBottom: theme.spacing.lg,
            },
        })}>
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
                        src={imageMap[hebergement.type_hebergement] || imageMap.default}
                        radius="md"
                        h={400}
                        fit="cover"
                        alt={hebergement.nom_commercial}
                        mb="sm"
                        onClick={() => setSelectedImage(imageMap[hebergement.type_hebergement] || imageMap.default)}
                        sx={(theme) => ({
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.02)',
                            },
                            '@media (max-width: 767px)': {
                                height: 300,
                            },
                        })}
                    />
                    <Group visibleFrom="sm">
                        {(galleryMap[hebergement.type_hebergement] || galleryMap.default).map((img, idx) => (
                            <Image
                                key={idx}
                                src={img}
                                w={100}
                                h={80}
                                radius="sm"
                                fit="cover"
                                onClick={() => setSelectedImage(img)}
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    },
                                }}
                            />
                        ))}
                    </Group>
                </Box>
                <Box>
                    <Group justify="space-between" align="flex-start">
                        <Title order={1} style={{ fontFamily: 'Montserrat, sans-serif' }}>{hebergement.nom_commercial}</Title>
                        <Badge size="lg" color="brand" variant="light">{hebergement.type_hebergement}</Badge>
                    </Group>

                    <Text size="xl" fw={700} c="brand" mt="sm">
                        {getPrixMin(hebergement.type_hebergement) ? (
                            <>À partir de {getPrixMin(hebergement.type_hebergement).toFixed(2)}€ <Text span size="sm" c="dimmed" fw={400}>/ nuit</Text></>
                        ) : (
                            'Prix sur demande'
                        )}
                    </Text>
                    <Text mt="md" size="lg" c="dimmed">
                        {hebergement.description}
                    </Text>
                    <Group mt="xl" spacing="xl" sx={(theme) => ({
                        '@media (max-width: 767px)': {
                            flexWrap: 'wrap',
                            gap: theme.spacing.md,
                        },
                    })}>
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
                        {equipements.length > 0 ? (
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
                                {equipements.map((equip) => (
                                    <List.Item key={equip.id_equipment}>{equip.nom}</List.Item>
                                ))}
                            </List>
                        ) : (
                            <Text c="dimmed" size="sm">Aucun équipement spécifié</Text>
                        )}
                    </Paper>
                    <Button fullWidth size="lg" color="brand" mt="xl" onClick={handleReserverClick}>
                        Réserver maintenant
                    </Button>
                </Box>
            </SimpleGrid>

            <BookingModal
                opened={modalOpened}
                onClose={closeModal}
                hebergement={hebergement}
                user={user}
                token={token}
            />
            <Modal
                opened={selectedImage !== null}
                onClose={() => setSelectedImage(null)}
                size="xl"
                centered
                padding={0}
                withCloseButton={true}
                overlayProps={{
                    opacity: 0.9,
                    blur: 3,
                }}
            >
                <Image
                    src={selectedImage}
                    alt="Image agrandie"
                    fit="contain"
                    style={{ maxHeight: '90vh' }}
                />
            </Modal>
        </Container>
    );
}

