import { Container, Title, Text, Stack, Paper, Group, Button, Loader, Center, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, SimpleGrid } from '@mantine/core';



export function Profil() {
    const { user, token, login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   



     const form = useForm({
        initialValues: {
            nom: user?.nom || '',
            prenom: user?.prenom || '',
            email: user?.email || '',
            telephone: user?.telephone || '',
            
            adresse_ligne1: user?.adresse_ligne1 || '',
            adresse_ligne2: user?.adresse_ligne2 || '',
            code_postal: user?.code_postal || '',
            ville: user?.ville || '',
            pays: user?.pays || '',
            
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },

    });

const handleSubmit = async (values) => {

    setLoading(true);
    setError(null);


    const { currentPassword, newPassword, confirmPassword, ...updatedDetails } = values;
    
    const isPasswordChange = newPassword && newPassword.length > 0;

       const payload = {
        ...updatedDetails,
        
        ...(isPasswordChange && { 
            currentPassword, 
            newPassword 
        }),
       };

    try {
 
        const response = await axios.put(`/api/users/${user.id_user}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });


        const updatedUser = response.data.user; 
        const newToken = response.data.token || token; 

 
        login(updatedUser, newToken); 
        
      
        alert('Profil mis à jour avec succès!');

        Navigate('/profil');
        
        
        if (isPasswordChange) {
            form.setFieldValue('currentPassword', '');
            form.setFieldValue('newPassword', '');
            form.setFieldValue('confirmPassword', '');
        }

    } catch (err) {
        console.error("Erreur mise à jour profil:", err);
     
        setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        
        if (!user) {
            navigate('/login');
        } else {
        
            setLoading(false);
        }
    }, [user, navigate]);

    if (loading) {
        return (
            <Center h={400}>
                <Loader size="xl" color="brand" />
            </Center>
        );
    }


    
   

    return (
        <Container size={800} my={40}>
            <Title ta="center" order={1} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Mon Profil
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Gérez vos informations personnelles et votre mot de passe.
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {error && (
                    <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb="md">
                        {error}
                    </Alert>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                   
                    
                       
                  
                        <Title order={3} mb="md">Informations Personnelles</Title>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <TextInput label="Nom" placeholder="Votre nom" required {...form.getInputProps('nom')} />
                            <TextInput label="Prénom" placeholder="Votre prénom" required {...form.getInputProps('prenom')} />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                          
                            <TextInput label="Email" placeholder="votre@email.com" required disabled {...form.getInputProps('email')} />
                            <TextInput label="Téléphone" placeholder="06 12 34 56 78" {...form.getInputProps('telephone')} />
                        </SimpleGrid>

                        <Title order={4} mt="xl" mb="md">Adresse de Facturation</Title>
                        <TextInput label="Adresse" placeholder="123 Rue du Camping" {...form.getInputProps('adresse_ligne1')} />
                        <TextInput label="Complément d'adresse" placeholder="Appartement, Étage..." mt="md" {...form.getInputProps('adresse_ligne2')} />
                        <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md">
                            <TextInput label="Code Postal" placeholder="59000" {...form.getInputProps('code_postal')} />
                            <TextInput label="Ville" placeholder="Lille" {...form.getInputProps('ville')} />
                            <TextInput label="Pays" placeholder="France" {...form.getInputProps('pays')} />
                        </SimpleGrid>

                        <Title order={4} mt="xl" mb="md">Changement de Mot de Passe</Title>
                        <PasswordInput
                            label="Mot de passe actuel"
                            placeholder="Mot de passe actuel"
                            {...form.getInputProps('currentPassword')}
                        />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
                            <PasswordInput
                                label="Nouveau mot de passe"
                                placeholder="Nouveau mot de passe"
                                {...form.getInputProps('newPassword')}
                            />
                            <PasswordInput
                                label="Confirmer le nouveau mot de passe"
                                placeholder="Confirmer"
                                {...form.getInputProps('confirmPassword')}
                            />
                        </SimpleGrid>
                   

                        <Group justify="flex-end" mt="xl">
                            <Button type="submit" color="brand" disabled={loading}>
                                {loading ? <Loader size="xs" color="white" /> : 'Enregistrer les modifications'}
                            </Button>
                        </Group>
                    

                  
                </form>
            </Paper>
        </Container>
    );
}