import { Container, Title, Text, Button, Image, SimpleGrid, Card, Group, Center, Box, Select, Badge, ThemeIcon, Overlay, rem, Paper } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendar, IconUser, IconSearch, IconWifi, IconSwimming, IconTrees } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import headerVideo from '../assets/header.mp4';
import { Avatar, TypographyStylesProvider } from '@mantine/core';
import classes from './CommentHtml.module.css';
import Giuseppe from '../assets/Giuseppe.png';
import Julien from '../assets/Julien.png';
import Cedric from '../assets/Cedric.png';
import FaqSimple from '../Components/FaqSimple'
import ArticlesCardsGrid from '../Components/ArticlesCardsGrid'




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
        // header
        <Box style={{ position: 'relative', height: 600 }} sx={(theme) => ({
            '@media (max-width: 767px)': {
                height: 500,
            },
        })}>
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                }}
            >
                <source src={headerVideo} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <Overlay gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)" opacity={1} zIndex={1} />
            <Container size="xl" style={{ height: '100%', position: 'relative', zIndex: 1 }}>
                <Center h="100%">
                    <Box style={{ color: 'white', textAlign: 'center' }}>
                        <Title order={1} sx={(theme) => ({
                            fontSize: rem(60),
                            fontWeight: 900,
                            marginBottom: rem(20),
                            '@media (max-width: 767px)': {
                                fontSize: rem(32),
                                marginBottom: rem(16),
                            },
                            '@media (min-width: 768px) and (max-width: 991px)': {
                                fontSize: rem(48),
                            },
                        })}>
                            Évadez-vous en pleine nature
                        </Title>
                        <Text size="xl" fw={500} sx={(theme) => ({
                            maxWidth: 600,
                            margin: '0 auto',
                            marginBottom: rem(40),
                            '@media (max-width: 767px)': {
                                fontSize: theme.fontSizes.md,
                                marginBottom: rem(24),
                                padding: '0 8px',
                            },
                        })}>
                            Vivez une expérience inoubliable dans nos hébergements premium. Calme, confort et aventure vous attendent.
                        </Text>

                        <Box sx={(theme) => ({
                            width: '100%',
                            maxWidth: 900,
                            '@media (max-width: 767px)': {
                                padding: '0 16px',
                            },
                        })}>
                            <Paper
                                shadow="xl"
                                radius="xl"
                                p="xs"
                                sx={(theme) => ({
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    '@media (max-width: 767px)': {
                                        padding: theme.spacing.md,
                                    },
                                })}
                            >
                                <Group
                                    gap={0}
                                    wrap="nowrap"
                                    sx={(theme) => ({
                                        '@media (max-width: 767px)': {
                                            flexDirection: 'column',
                                            gap: theme.spacing.sm,
                                        },
                                    })}
                                >
                                    <DateInput
                                        value={dateDebut}
                                        onChange={(d) => { setDateDebut(d); setErrors({ ...errors, dateDebut: null }); }}
                                        placeholder="Date d'arrivée"
                                        leftSection={<IconCalendar size={18} />}
                                        minDate={new Date()}
                                        error={errors.dateDebut}
                                        size="lg"
                                        styles={{
                                            input: {
                                                border: 'none',
                                                borderRight: '1px solid #e9ecef',
                                                borderRadius: 0,
                                                backgroundColor: 'transparent',
                                                '&:focus': {
                                                    borderColor: '#e9ecef',
                                                },
                                            },
                                        }}
                                        sx={(theme) => ({
                                            flex: 1,
                                            '@media (max-width: 767px)': {
                                                width: '100%',
                                                '& input': {
                                                    borderRight: 'none',
                                                    borderBottom: '1px solid #e9ecef',
                                                },
                                            },
                                        })}
                                    />
                                    <DateInput
                                        value={dateFin}
                                        onChange={(d) => { setDateFin(d); setErrors({ ...errors, dateFin: null }); }}
                                        placeholder="Date de départ"
                                        leftSection={<IconCalendar size={18} />}
                                        minDate={dateDebut || new Date()}
                                        error={errors.dateFin}
                                        size="lg"
                                        styles={{
                                            input: {
                                                border: 'none',
                                                borderRight: '1px solid #e9ecef',
                                                borderRadius: 0,
                                                backgroundColor: 'transparent',
                                                '&:focus': {
                                                    borderColor: '#e9ecef',
                                                },
                                            },
                                        }}
                                        sx={(theme) => ({
                                            flex: 1,
                                            '@media (max-width: 767px)': {
                                                width: '100%',
                                                '& input': {
                                                    borderRight: 'none',
                                                    borderBottom: '1px solid #e9ecef',
                                                },
                                            },
                                        })}
                                    />
                                    <Select
                                        placeholder="Voyageurs"
                                        leftSection={<IconUser size={18} />}
                                        data={['1 Voyageur', '2 Voyageurs', '4 Voyageurs', '6 Voyageurs', '8 Voyageurs']}
                                        value={travelers}
                                        onChange={(v) => { setTravelers(v); setErrors({ ...errors, travelers: null }); }}
                                        error={errors.travelers}
                                        size="lg"
                                        styles={{
                                            input: {
                                                border: 'none',
                                                borderRight: '1px solid #e9ecef',
                                                borderRadius: 0,
                                                backgroundColor: 'transparent',
                                                '&:focus': {
                                                    borderColor: '#e9ecef',
                                                },
                                            },
                                        }}
                                        sx={(theme) => ({
                                            flex: 1,
                                            '@media (max-width: 767px)': {
                                                width: '100%',
                                                '& input': {
                                                    borderRight: 'none',
                                                    borderBottom: '1px solid #e9ecef',
                                                },
                                            },
                                        })}
                                    />
                                    <Button
                                        size="lg"
                                        leftSection={<IconSearch size={22} />}
                                        onClick={handleSearch}
                                        radius="xl"
                                        sx={(theme) => ({
                                            background: 'linear-gradient(135deg, #2E8B57 0%, #228B22 100%)',
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            padding: '0 32px',
                                            height: 54,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #228B22 0%, #1a6b1a 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 16px rgba(46, 139, 87, 0.3)',
                                            },
                                            '@media (max-width: 767px)': {
                                                width: '100%',
                                                marginTop: theme.spacing.sm,
                                            },
                                        })}
                                    >
                                        Rechercher
                                    </Button>
                                </Group>
                            </Paper>
                        </Box>
                    </Box>
                </Center>
            </Container>
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
        <Container size="xl" py={80} sx={(theme) => ({
            '@media (max-width: 767px)': {
                paddingTop: theme.spacing.xl,
                paddingBottom: theme.spacing.xl,
            },
        })}>
            <Title order={2} ta="center" mb="xl">Pourquoi nous choisir ?</Title>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                {items}
            </SimpleGrid>
        </Container>
    );
}

function AvisClients() {
    const avis = [
        {
            avatar: Giuseppe,
            nom: "Giuseppe  ⭐⭐⭐⭐⭐",
            date: "Il y a 2 semaines",
            commentaire: '<p>Séjour <strong>extraordinaire</strong> au camping Ô Soleil Brulant ! Les emplacements sont spacieux et bien entretenus. Le personnel est aux petits soins. Nous reviendrons sans hésiter !</p>'
        },
        {
            avatar: Julien,
            nom: "Julien ⭐⭐⭐⭐⭐",
            date: "Il y a 1 mois",
            commentaire: '<p>Un camping <strong>familial</strong> parfait ! Les enfants ont adoré les activités proposées. L\'emplacement est idéal pour visiter la région. Très bon rapport qualité-prix. 👨‍👩‍👧‍👦</p>'
        },
        {
            avatar: Cedric,
            nom: "Cedric ⭐⭐⭐⭐⭐",
            date: "Il y a 3 semaines",
            commentaire: '<p>Cadre <strong>magnifique</strong> et reposant. Le chalet était impeccable et très confortable. Les propriétaires sont charmants et de bon conseil. Une vraie pépite ! 🌟</p>'
        }
    ];

    return (
        <Container size="xl" py={60}>
            <Title order={2} ta="center" mb={60}>Avis de nos clients</Title>
            <Box visibleFrom="md" style={{ position: 'relative', minHeight: '800px' }}>
                <Paper
                    withBorder
                    radius="md"
                    className={classes.comment}
                    shadow="sm"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '5%',
                        width: '35%',
                        zIndex: 1,
                    }}
                >
                    <Group>
                        <Avatar src={avis[0].avatar} alt={avis[0].nom} radius="xl" size="lg" />
                        <div>
                            <Text fw={600} fz="sm">{avis[0].nom}</Text>
                            <Text fz="xs" c="dimmed">{avis[0].date}</Text>
                        </div>
                    </Group>
                    <TypographyStylesProvider className={classes.body}>
                        <div className={classes.content} dangerouslySetInnerHTML={{ __html: avis[0].commentaire }} />
                    </TypographyStylesProvider>
                </Paper>
                <Box style={{
                    position: 'absolute',
                    top: '140px',
                    left: '36%',
                    zIndex: 0,
                }}>
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <path
                            d="M 20 20 Q 80 60, 120 100 Q 150 130, 180 170"
                            stroke="#2E8B57"
                            strokeWidth="2.5"
                            fill="none"
                            strokeDasharray="6,4"
                        />
                        <path
                            d="M 180 170 L 170 165 M 180 170 L 175 178"
                            stroke="#2E8B57"
                            strokeWidth="2.5"
                            fill="none"
                        />
                    </svg>
                </Box>
                <Paper
                    withBorder
                    radius="md"
                    className={classes.comment}
                    shadow="sm"
                    style={{
                        position: 'absolute',
                        top: '280px',
                        right: '5%',
                        width: '35%',
                        zIndex: 1,
                    }}
                >
                    <Group>
                        <Avatar src={avis[1].avatar} alt={avis[1].nom} radius="xl" size="lg" />
                        <div>
                            <Text fw={600} fz="sm">{avis[1].nom}</Text>
                            <Text fz="xs" c="dimmed">{avis[1].date}</Text>
                        </div>
                    </Group>
                    <TypographyStylesProvider className={classes.body}>
                        <div className={classes.content} dangerouslySetInnerHTML={{ __html: avis[1].commentaire }} />
                    </TypographyStylesProvider>
                </Paper>
                <Box style={{
                    position: 'absolute',
                    top: '420px',
                    left: '43%',
                    zIndex: 0,
                }}>
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <path
                            d="M 180 20 Q 120 60, 80 100 Q 50 130, 20 170"
                            stroke="#2E8B57"
                            strokeWidth="2.5"
                            fill="none"
                            strokeDasharray="6,4"
                        />
                        <path
                            d="M 20 170 L 30 165 M 20 170 L 25 178"
                            stroke="#2E8B57"
                            strokeWidth="2.5"
                            fill="none"
                        />
                    </svg>
                </Box>
                <Paper
                    withBorder
                    radius="md"
                    className={classes.comment}
                    shadow="sm"
                    style={{
                        position: 'absolute',
                        top: '560px',
                        left: '5%',
                        width: '35%',
                        zIndex: 1,
                    }}
                >
                    <Group>
                        <Avatar src={avis[2].avatar} alt={avis[2].nom} radius="xl" size="lg" />
                        <div>
                            <Text fw={600} fz="sm">{avis[2].nom}</Text>
                            <Text fz="xs" c="dimmed">{avis[2].date}</Text>
                        </div>
                    </Group>
                    <TypographyStylesProvider className={classes.body}>
                        <div className={classes.content} dangerouslySetInnerHTML={{ __html: avis[2].commentaire }} />
                    </TypographyStylesProvider>
                </Paper>
            </Box>
            <Box hiddenFrom="md">
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    {avis.map((item, index) => (
                        <Paper key={index} withBorder radius="md" className={classes.comment} shadow="sm">
                            <Group>
                                <Avatar
                                    src={item.avatar}
                                    alt={item.nom}
                                    radius="xl"
                                    size="lg"
                                />
                                <div>
                                    <Text fw={600} fz="sm">{item.nom}</Text>
                                    <Text fz="xs" c="dimmed">{item.date}</Text>
                                </div>
                            </Group>
                            <TypographyStylesProvider className={classes.body}>
                                <div
                                    className={classes.content}
                                    dangerouslySetInnerHTML={{ __html: item.commentaire }}
                                />
                            </TypographyStylesProvider>
                        </Paper>
                    ))}
                </SimpleGrid>
            </Box>
        </Container>
    );
}

export function Home() {
    return (
        <>
            <Hero />
            <Features />
            <AvisClients />
            <ArticlesCardsGrid />
            <FaqSimple />
        </>
    );
}