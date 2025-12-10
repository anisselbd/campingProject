import { useState } from 'react';
import { Container, Group, Burger, Button, Text, Box, Drawer, ScrollArea, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconTent } from '@tabler/icons-react';

const links = [
    { link: '/', label: 'Accueil' },
    { link: '/hebergements', label: 'Hébergements' },
    { link: '/galerie', label: 'Galerie' },
    { link: '/tarifs', label: 'Tarifs' },
    { link: '/contact', label: 'Contact' },
];

import { useAuth } from '../Context/AuthContext';
import { Menu, ActionIcon, Avatar, rem } from '@mantine/core';
import { IconUser, IconLogout, IconSettings, IconDashboard } from '@tabler/icons-react';

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
                        <IconTent size={30} color="#2E8B57" />
                        <Text fw={700} size="lg">Camping Premium</Text>
                    </Group>

                    <Group gap={5} visibleFrom="md">
                        {items}
                        {user ? (
                            <Group gap={5}>
                                {user.type_compte === 'admin' && (
                                    <Button
                                        variant="light"
                                        color="red"
                                        leftSection={<IconDashboard size={18} />}
                                        onClick={() => navigate('/admin/dashboard')}
                                    >
                                        Dashboard
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
                                        <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
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

                    <Group justify="center" grow pb="xl" px="md">
                        {items}
                    </Group>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button onClick={() => { navigate('/register'); close(); }}>Inscription</Button>
                        <Button variant="light" onClick={() => { navigate('/login'); close(); }}>Connexion</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
