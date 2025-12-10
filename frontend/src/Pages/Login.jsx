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
    Alert,
    Loader
} from '@mantine/core';
import { IconAt, IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../Context/AuthContext';

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/users/login', {
                email,
                password
            });
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erreur lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={80}>
            <Title ta="center" order={1} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Bon retour parmi nous !
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Vous n'avez pas encore de compte ?{' '}
                <Anchor size="sm" component="button" onClick={() => navigate('/register')}>
                    Créer un compte
                </Anchor>
            </Text>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={handleSubmit}>
                    {error && (
                        <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb="md">
                            {error}
                        </Alert>
                    )}
                    <TextInput
                        label="Email"
                        placeholder="votre@email.com"
                        required
                        leftSection={<IconAt size={16} />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PasswordInput
                        label="Mot de passe"
                        placeholder="Votre mot de passe"
                        required
                        mt="md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Se souvenir de moi" />
                        <Anchor component="button" size="sm">
                            Mot de passe oublié ?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" type="submit" disabled={loading} color="brand">
                        {loading ? <Loader size="xs" color="white" /> : 'Se connecter'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
