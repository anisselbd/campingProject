import { Container, Title, SimpleGrid, TextInput, Textarea, Button, Group, Text, Paper, ThemeIcon, Box } from '@mantine/core';
import { IconMapPin, IconPhone, IconMail, IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconSend } from '@tabler/icons-react';

export function Contact() {
    return (
        <Container size="xl" py="xl">
            <Title order={1} align="center" mb={50} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Contactez-nous
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={50}>
                <Box>
                    <Title order={2} size="h3" mb="xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Nos Coordonnées
                    </Title>
                    <Text c="dimmed" mb="xl">
                        Une question sur votre futur séjour ? Besoin d'aide pour réserver ?
                        Notre équipe est à votre disposition pour vous répondre dans les plus brefs délais.
                    </Text>
                    <Group mb="md">
                        <ThemeIcon size={40} radius="md" variant="light" color="brand">
                            <IconMapPin />
                        </ThemeIcon>
                        <Box>
                            <Text size="sm" fw={500}>Adresse</Text>
                            <Text c="dimmed" size="sm">156 Rue Léon Jouhaux, 59290 Wasquehal</Text>
                        </Box>
                    </Group>
                    <Group mb="md">
                        <ThemeIcon size={40} radius="md" variant="light" color="brand">
                            <IconMail />
                        </ThemeIcon>
                        <Box>
                            <Text size="sm" fw={500}>Email</Text>
                            <Text c="dimmed" size="sm">contact@camping-foreach.fr</Text>
                        </Box>
                    </Group>

                    <Group mb="xl">
                        <ThemeIcon size={40} radius="md" variant="light" color="brand">
                            <IconPhone />
                        </ThemeIcon>
                        <Box>
                            <Text size="sm" fw={500}>Téléphone</Text>
                            <Text c="dimmed" size="sm">+33 5 56 00 00 00</Text>
                        </Box>
                    </Group>

                    <Title order={3} size="h4" mb="md">Suivez-nous</Title>
                    <Group>
                        <ThemeIcon size="lg" radius="md" variant="subtle" color="gray">
                            <IconBrandFacebook />
                        </ThemeIcon>
                        <ThemeIcon size="lg" radius="md" variant="subtle" color="gray">
                            <IconBrandTwitter />
                        </ThemeIcon>
                        <ThemeIcon size="lg" radius="md" variant="subtle" color="gray">
                            <IconBrandInstagram />
                        </ThemeIcon>
                    </Group>
                </Box>
                <Paper shadow="md" radius="md" p="xl" withBorder>
                    <Title order={2} size="h3" mb="lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Envoyez-nous un message
                    </Title>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput label="Nom" placeholder="Votre nom" required />
                            <TextInput label="Prénom" placeholder="Votre prénom" required />
                        </SimpleGrid>

                        <TextInput label="Email" placeholder="votre@email.com" mt="md" required />
                        <TextInput label="Sujet" placeholder="Demande de réservation" mt="md" required />
                        <Textarea
                            label="Message"
                            placeholder="Votre message..."
                            minRows={4}
                            mt="md"
                            required
                        />
                        <Group justify="flex-end" mt="xl">
                            <Button type="submit" size="md" color="brand" leftSection={<IconSend size={18} />}>
                                Envoyer
                            </Button>
                        </Group>
                    </form>
                </Paper>
            </SimpleGrid>
        </Container>
    );
}
