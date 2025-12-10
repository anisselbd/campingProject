import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    SimpleGrid,
    Alert,
    Loader
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from '@mantine/form';

export function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            nom: '',
            prenom: '',
            telephone: '',
            adresse_ligne1: '',
            adresse_ligne2: '',
            code_postal: '',
            ville: '',
            pays: 'France',
            terms: false,
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
            password: (value) => (value.length < 6 ? 'Le mot de passe doit faire au moins 6 caractères' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Les mots de passe ne correspondent pas' : null,
            nom: (value) => (value.trim().length === 0 ? 'Le nom est obligatoire' : null),
            prenom: (value) => (value.trim().length === 0 ? 'Le prénom est obligatoire' : null),
            terms: (value) => (value ? null : 'Vous devez accepter les conditions d\'utilisation'),
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        setError(null);
        try {
            const { confirmPassword, terms, ...startPayload } = values;

            await axios.post('/api/users/register', startPayload);
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={800} my={40}>
            <Title ta="center" order={1} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Créez votre compte
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Déjà un compte ?{' '}
                <Anchor size="sm" component="button" onClick={() => navigate('/login')}>
                    Se connecter
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {error && (
                        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb="md">
                            {error}
                        </Alert>
                    )}
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <TextInput label="Nom" placeholder="Votre nom" required {...form.getInputProps('nom')} />
                        <TextInput label="Prénom" placeholder="Votre prénom" required {...form.getInputProps('prenom')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <TextInput label="Email" placeholder="votre@email.com" required {...form.getInputProps('email')} />
                        <TextInput label="Téléphone" placeholder="06 12 34 56 78" {...form.getInputProps('telephone')} />
                    </SimpleGrid>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                        <PasswordInput label="Mot de passe" placeholder="Votre mot de passe" required {...form.getInputProps('password')} />
                        <PasswordInput label="Confirmer le mot de passe" placeholder="Répétez le mot de passe" required {...form.getInputProps('confirmPassword')} />
                    </SimpleGrid>
                    <Title order={4} mt="xl" mb="md">Adresse</Title>
                    <TextInput label="Adresse" placeholder="123 Rue de la base de données" mt="md" {...form.getInputProps('adresse_ligne1')} />
                    <TextInput label="Complément d'adresse" placeholder="Appartement, Étage..." mt="md" {...form.getInputProps('adresse_ligne2')} />
                    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                        <TextInput label="Code Postal" placeholder="59000" {...form.getInputProps('code_postal')} />
                        <TextInput label="Ville" placeholder="Lille" {...form.getInputProps('ville')} />
                        <TextInput label="Pays" placeholder="France" {...form.getInputProps('pays')} />
                    </SimpleGrid>
                    <Checkbox
                        label="J'accepte les termes et conditions"
                        mt="xl"
                        required
                        {...form.getInputProps('terms', { type: 'checkbox' })}
                    />
                    <Button fullWidth mt="xl" type="submit" disabled={loading} color="brand">
                        {loading ? <Loader size="xs" color="white" /> : 'S\'inscrire'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
