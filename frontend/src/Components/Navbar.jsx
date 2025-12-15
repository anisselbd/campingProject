import { useState } from 'react';
import { Container, Group, Burger, Button, Text, Box, Drawer, ScrollArea, Divider, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import logoCamping from '../assets/logoCamping.svg';

const links = [
    { link: '/', label: 'Accueil' },
    { link: '/hebergements', label: 'Hébergements' },
    { link: '/actualites', label: 'Actualités' },
    { link: '/galerie', label: 'Galerie' },
    { link: '/tarifs', label: 'Tarifs' },
    { link: '/contact', label: 'Contact' },
];

import { useAuth } from '../Context/AuthContext';
import { Menu, ActionIcon, Avatar, rem } from '@mantine/core';
import { IconUser, IconLogout, IconSettings, IconDashboard, IconCalendar } from '@tabler/icons-react';

export function Navbar() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const items = links.map((link) => {
        const isActive = location.pathname === link.link || (link.link !== '/' && location.pathname.startsWith(link.link));

        return (
            <Button
                key={link.label}
                variant="subtle"
                color={isActive ? "brand" : "gray"}
                onClick={() => {
                    navigate(link.link);
                    close();
                }}
                style={{
                    borderBottom: isActive ? '2px solid #2E8B57' : '2px solid transparent',
                    borderRadius: 0,
                    color: isActive ? '#2E8B57' : undefined
                }}
            >
                {link.label}
            </Button>
        )
    });

    return (
        <Box>
            <header style={{ height: 60, borderBottom: '1px solid #e9ecef', backgroundColor: 'white' }}>
                <Container size="xl" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <img src={logoCamping} alt="Logo Camping" style={{ width: 40, height: 40 }} />
                        <Text fw={1000} size="lg" style={{ textShadow: '5px 5px 5px rgba(0, 0, 0, 0.5)' }} >Ô Soleil Brulant</Text>
                    </Group>

                    <Group gap={5} visibleFrom="md">
                        {items}
                        {user ? (
                            <Group gap={5}>
                                {user.type_compte === 'admin' && (
                                    <Button
                                        variant="dark"
                                        color="blue"
                                        leftSection={<IconDashboard size={18} />}
                                        onClick={() => navigate('/admin/dashboard')}
                                    >
                                        Dashboard Admin
                                    </Button>
                                )}
                                <Menu shadow="md" width={200}>
                                    <Menu.Target>
                                        <Button variant="subtle" color="gray" leftSection={<Avatar size={26} radius="xl" />}>
                                            {user.prenom}
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Mon compte</Menu.Label>
                                        <Menu.Item
                                            leftSection={<IconCalendar style={{ width: rem(14), height: rem(14) }} />}
                                            onClick={() => navigate('/mes-reservations')}
                                        >
                                            Mes réservations
                                        </Menu.Item>
                                        <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
                                            onClick={() => navigate('/profil')}>
                                            Profil
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item
                                            color="red"
                                            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                                            onClick={() => {
                                                logout();
                                                navigate('/');
                                            }}
                                        >
                                            Déconnexion
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>
                        ) : (
                            <>
                                <Button onClick={() => navigate('/register')}>Inscription</Button>
                                <Button variant="default" onClick={() => navigate('/login')}>Connexion</Button>
                            </>
                        )}
                    </Group>

                    <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
                </Container>
            </header>

            <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="md"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - 80px)`} mx="-md">
                    <Divider my="sm" />

                    <Stack justify="center" pb="xl" px="md">
                        {items}
                    </Stack>

                    <Divider my="sm" />

                    {user ? (
                        <Stack pb="xl" px="md">
                            <Text size="sm" fw={700} c="dimmed">Connecté en tant que {user.prenom}</Text>
                            {user.type_compte === 'admin' && (
                                <Button
                                    variant="light"
                                    color="red"
                                    leftSection={<IconDashboard size={18} />}
                                    onClick={() => { navigate('/admin/dashboard'); close(); }}
                                >
                                    Dashboard
                                </Button>
                            )}
                            <Button
                                variant="subtle"
                                leftSection={<IconCalendar size={18} />}
                                onClick={() => { navigate('/mes-reservations'); close(); }}
                            >
                                Mes réservations
                            </Button>
                            <Button
                                variant="subtle"
                                leftSection={<IconSettings size={18} />}
                                onClick={() => { navigate('/profil'); close(); }}
                            >
                                Mon profil
                            </Button>
                            <Button
                                variant="outline"
                                color="red"
                                leftSection={<IconLogout size={18} />}
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                    close();
                                }}
                            >
                                Déconnexion
                            </Button>
                        </Stack>
                    ) : (
                        <Stack justify="center" pb="xl" px="md">
                            <Button onClick={() => { navigate('/register'); close(); }}>Inscription</Button>
                            <Button variant="light" onClick={() => { navigate('/login'); close(); }}>Connexion</Button>
                        </Stack>
                    )}
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
