import { Container, Title, SimpleGrid, TextInput, Textarea, Button, Group, Text, Paper, ThemeIcon, Box } from '@mantine/core';
import { IconMapPin, IconPhone, IconMail, IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconSend } from '@tabler/icons-react';
import emailjs from '@emailjs/browser';

import { useState } from 'react';



export function Contact() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        sujet: '',
        message: ''
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);


    const SERVICE_ID = 'service_kev4anb';
    const TEMPLATE_ID = 'template_slm3n2g';
    const PUBLIC_KEY = 'OUkE5zQHHfP7OYFEy'; // Remplacez par votre clé publique EmailJS



    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
        setSuccess(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);


        const requiredFields = ['nom', 'prenom', 'email', 'sujet', 'message'];
        const missingField = requiredFields.find(field => !formData[field].trim());

        if (missingField) {
            setError('Veuillez remplir tous les champs requis.');
            setLoading(false);
            return;
        }

        try {

            const templateParams = {

                from_name: `${formData.prenom} ${formData.nom}`,
                from_email: formData.email,
                subject: formData.sujet,
                message: formData.message,
            };


            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);


            setSuccess(true);

            setFormData({ nom: '', prenom: '', email: '', sujet: '', message: '' });

        } catch (err) {
            console.error('Erreur lors de l\'envoi de l\'email:', err);
            setError('Échec de l\'envoi du message. Veuillez vérifier la console o riprovare.');
        } finally {
            setLoading(false);
        }
    };







    return (

        <Container size="xl" py="xl" sx={(theme) => ({
            '@media (max-width: 767px)': {
                paddingTop: theme.spacing.lg,
                paddingBottom: theme.spacing.lg,
            },
        })}>
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
                    <form onSubmit={handleSubmit}>
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                            <TextInput name="nom" value={formData.nom} onChange={handleChange} label="Nom" placeholder="Votre nom" required />
                            <TextInput name="prenom" value={formData.prenom} onChange={handleChange} label="Prénom" placeholder="Votre prénom" required />
                        </SimpleGrid>

                        <TextInput name="email" value={formData.email} onChange={handleChange} label="Email" placeholder="votre@email.com" mt="md" required />
                        <TextInput name="sujet" value={formData.sujet} onChange={handleChange} label="Sujet" placeholder="Demande de réservation" mt="md" required />
                        <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            label="Message"
                            placeholder="Votre message..."
                            minRows={4}
                            mt="md"
                            required
                        />
                        <Group justify="flex-end" mt="xl">
                            <Button type="submit" size="md" color="brand" leftSection={<IconSend size={18} />} loading={loading}>
                                Envoyer
                            </Button>
                        </Group>
                    </form>
                    {error && <Text color="red" size="sm" mt="sm">{error}</Text>}
                    {success && <Text color="green" size="sm" mt="sm">Message envoyé avec succès !</Text>}
                </Paper>
            </SimpleGrid>
        </Container>
    );
}
