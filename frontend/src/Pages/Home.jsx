import { Container, Title, Text, Button, Image, SimpleGrid, Card, Group, BackgroundImage, Center, Box, Select, Badge, ThemeIcon, Overlay, rem } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar, IconUser, IconSearch, IconWifi, IconSwimming, IconTrees } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
    const [dateDebut, setDateDebut] = useState(null);
    const [dateFin, setDateFin] = useState(null);
    const [travelers, setTravelers] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSearch = () => {
        const newErrors = {};
        if (!dateDebut) newErrors.dateDebut = "Date d'arrivée requise";
        if (!dateFin) newErrors.dateFin = "Date de départ requise";
        if (!travelers) newErrors.travelers = "Nombre de voyageurs requis";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        let url = '/hebergements';
        const params = new URLSearchParams();

        if (dateDebut) params.append('dateDebut', new Date(dateDebut).toISOString());
        if (dateFin) params.append('dateFin', new Date(dateFin).toISOString());

        if (travelers) {
            // "2 Voyageurs" -> 2
            const count = parseInt(travelers.split(' ')[0]);
            params.append('travelers', count);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        navigate(url);
    };

    return (
        <Box style={{ position: 'relative', height: 600 }}>
            <BackgroundImage
                src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                radius={0}
                h="100%"
            >
                <Overlay gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)" opacity={1} zIndex={0} />
                <Container size="xl" style={{ height: '100%', position: 'relative', zIndex: 1 }}>
                    <Center h="100%">
                        <Box style={{ color: 'white', textAlign: 'center' }}>
                            <Title order={1} style={{ fontSize: rem(60), fontWeight: 900, marginBottom: rem(20) }}>
                                Évadez-vous en pleine nature
                            </Title>
                            <Text size="xl" fw={500} style={{ maxWidth: 600, margin: '0 auto', marginBottom: rem(40) }}>
                                Vivez une expérience inoubliable dans nos hébergements premium. Calme, confort et aventure vous attendent.
                            </Text>

                            <Card padding="lg" radius="md" shadow="sm" style={{ backgroundColor: 'white', display: 'inline-block' }}>
                                <Group align="flex-end">
                                    <DateInput
                                        value={dateDebut}
                                        onChange={(d) => { setDateDebut(d); setErrors({ ...errors, dateDebut: null }); }}
                                        label="Arrivée"
                                        placeholder="Date d'arrivée"
                                        leftSection={<IconCalendar size={16} />}
                                        minDate={new Date()}
                                        error={errors.dateDebut}
                                        w={180}
                                    />
                                    <DateInput
                                        value={dateFin}
                                        onChange={(d) => { setDateFin(d); setErrors({ ...errors, dateFin: null }); }}
                                        label="Départ"
                                        placeholder="Date de départ"
                                        leftSection={<IconCalendar size={16} />}
                                        minDate={dateDebut || new Date()}
                                        error={errors.dateFin}
                                        w={180}
                                    />
                                    <Select
                                        label="Voyageurs"
                                        placeholder="2 adultes"
                                        leftSection={<IconUser size={16} />}
                                        data={['1 Voyageur', '2 Voyageurs', '4 Voyageurs', '6 Voyageurs', '8 Voyageurs']}
                                        value={travelers}
                                        onChange={(v) => { setTravelers(v); setErrors({ ...errors, travelers: null }); }}
                                        error={errors.travelers}
                                        w={150}
                                    />
                                    <Button
                                        size="md"
                                        leftSection={<IconSearch size={20} />}
                                        color="brand"
                                        onClick={handleSearch}
                                    >
                                        Rechercher
                                    </Button>
                                </Group>
                            </Card>
                        </Box>
                    </Center>
                </Container>
            </BackgroundImage>
        </Box>
    );
}


function Features() {
    const features = [
        { icon: IconWifi, title: 'Wi-Fi Haut Débit', description: 'Restez connectés même en pleine forêt grâce à notre fibre optique.' },
        { icon: IconSwimming, title: 'Piscine Chauffée', description: 'Profitez de notre espace aquatique chauffé toute l\'année.' },
        { icon: IconTrees, title: 'Cadre Naturel', description: 'Des emplacements spacieux au cœur d\'une forêt préservée.' },
    ];

    const items = features.map((feature) => (
        <Card key={feature.title} shadow="sm" radius="md" padding="xl" withBorder>
            <ThemeIcon size={50} radius={50} variant="light" color="brand">
                <feature.icon size={26} stroke={1.5} />
            </ThemeIcon>
            <Text mt="sm" mb={7} fw={700} size="lg">
                {feature.title}
            </Text>
            <Text size="sm" c="dimmed" lh={1.6}>
                {feature.description}
            </Text>
        </Card>
    ));

    return (
        <Container size="xl" py={80}>
            <Title order={2} ta="center" mb="xl">Pourquoi nous choisir ?</Title>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                {items}
            </SimpleGrid>
        </Container>
    );
}

export function Home() {
    return (
        <>
            <Hero />
            <Features />

        </>
    );
}