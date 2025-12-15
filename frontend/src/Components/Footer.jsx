import { Container, Group, ActionIcon, Text, Box, rem, SimpleGrid, TextInput, Button, Stack, Title } from '@mantine/core';
import { IconBrandTwitter, IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconTent } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const socialProps = { size: 24, stroke: 1.5, color: 'white' };

export function Footer() {
    const navigate = useNavigate();
    return (
        <Box style={{ backgroundColor: '#2b2b2b', color: 'white', marginTop: rem(80), padding: `${rem(60)} 0` }} sx={(theme) => ({
            '@media (max-width: 767px)': {
                marginTop: theme.spacing.xl,
                padding: `${theme.spacing.xl} 0`,
            },
        })}>
            <Container size="xl">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={50}>


                    <Stack gap="xs">
                        <Text fw={700} mb="sm" c="white">Nous</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }} onClick={() => navigate('/about')}>À propos</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Pourquoi nous  hoisir ?</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Prix</Text>
                    </Stack>


                    <Stack gap="xs">
                        <Text fw={700} mb="sm" c="white">Ressources</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Politique de confidentialité</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Conditions générales de vente</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>FAQ</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Termes et conditions</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }} onClick={() => navigate('/contact')}>Contactez-nous</Text>
                    </Stack>


                    <Stack gap="xs">
                        <Text fw={700} mb="sm" c="white">Services</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Gestion de projet</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Planning</Text>
                        <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Collaboration</Text>
                    </Stack>


                    <Stack gap="lg">
                        <Group gap="xs">

                            <Box style={{ backgroundColor: '#555', borderRadius: 8, padding: '0 8px' }}>
                                <Text fw={900} size={rem(28)} c="white">C</Text>
                            </Box>
                            <Text fw={700} size={rem(24)} c="dimgray">amping</Text>
                        </Group>

                        <Text size="sm" fw={700}>Souscrivez à notre newsletter</Text>
                        <Group gap={0} sx={(theme) => ({
                            '@media (max-width: 767px)': {
                                flexDirection: 'column',
                                alignItems: 'stretch',
                            },
                        })}>
                            <TextInput
                                placeholder="Entre votre mail"
                                radius="md"
                                size="md"
                                styles={{ input: { borderRadius: '8px 0 0 8px', borderColor: '#444', backgroundColor: '#3b3b3b', color: 'white' } }}
                                sx={(theme) => ({
                                    flex: 1,
                                    '@media (max-width: 767px)': {
                                        '& input': {
                                            borderRadius: '8px 8px 0 0 !important',
                                        },
                                    },
                                })}
                            />
                            <Button variant="white" color="dark" size="md" radius="md" style={{ borderRadius: '0 8px 8px 0', border: 'none' }} sx={(theme) => ({
                                '@media (max-width: 767px)': {
                                    borderRadius: '0 0 8px 8px !important',
                                },
                            })}>
                                S'abonner
                            </Button>
                        </Group>
                    </Stack>
                </SimpleGrid>

                <Group justify="center" mt={60} style={{ position: 'relative' }} sx={(theme) => ({
                    '@media (max-width: 767px)': {
                        marginTop: theme.spacing.xl,
                    },
                })}>

                    <Text c="dimmed" size="sm">
                        Copyright @2025
                    </Text>


                    <Group gap="md" style={{ position: 'absolute', right: 0 }} visibleFrom="sm">
                        <ActionIcon size="lg" color="gray" variant="subtle"><IconBrandFacebook {...socialProps} /></ActionIcon>
                        <ActionIcon size="lg" color="gray" variant="subtle"><IconBrandTwitter {...socialProps} /></ActionIcon>
                        <ActionIcon size="lg" color="gray" variant="subtle"><IconBrandInstagram {...socialProps} /></ActionIcon>
                        <ActionIcon size="lg" color="gray" variant="subtle"><IconBrandLinkedin {...socialProps} /></ActionIcon>
                    </Group>
                    <Group gap="md" hiddenFrom="sm" mt="md">
                        <ActionIcon size="lg" color="gray" variant="subtle"><IconBrandFacebook {...socialProps} /></ActionIcon>
                        <ActionIcon size="lg" color="gray" variant="subtle"><IconBrandTwitter {...socialProps} /></ActionIcon>
                        <ActionIcon size="lg" color="gray" variant="subtle"><IconBrandInstagram {...socialProps} /></ActionIcon>
                        <ActionIcon size="lg" color="gray" variant="subtle"><IconBrandLinkedin {...socialProps} /></ActionIcon>
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}
