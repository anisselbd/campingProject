import { useState, useEffect, useRef } from 'react';
import { ActionIcon, Paper, Text, TextInput, Stack, ScrollArea, Group, Badge } from '@mantine/core';
import { IconMessageChatbot, IconX, IconSend } from '@tabler/icons-react';
import './ChatBot.css';

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef(null);

    // Initialiser avec un message de bienvenue
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                type: 'bot',
                text: 'Bonjour ! 👋 Je suis votre assistant virtuel du Camping O Soleil Brulant. Comment puis-je vous aider aujourd\'hui ?',
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    }, []);

    // Auto-scroll vers le bas quand nouveaux messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    // Base de connaissances pour le chatbot
    const getResponse = (message) => {
        const lowerMessage = message.toLowerCase().trim();

        // Hébergements
        if (lowerMessage.includes('hébergement') || lowerMessage.includes('hebergement') ||
            lowerMessage.includes('logement') || lowerMessage.includes('type')) {
            return 'Nous proposons 3 types d\'hébergements :\n\n🏕️ **Tentes** - Pour une expérience authentique en pleine nature\n🏠 **Mobilhomes** - Tout le confort d\'une maison\n🏔️ **Chalets** - Le luxe en montagne\n\nVous pouvez voir tous nos hébergements sur la page "Hébergements".';
        }

        // Tarifs
        if (lowerMessage.includes('tarif') || lowerMessage.includes('prix') ||
            lowerMessage.includes('coût') || lowerMessage.includes('cout') ||
            lowerMessage.includes('combien')) {
            return 'Nos tarifs varient selon la saison et le type d\'hébergement. 💰\n\nVous pouvez consulter tous nos tarifs détaillés sur la page "Tarifs" du site.\n\nNos prix sont compétitifs et nous proposons régulièrement des offres spéciales !';
        }

        // Réservation
        if (lowerMessage.includes('réserv') || lowerMessage.includes('reserv') ||
            lowerMessage.includes('book') || lowerMessage.includes('disponib')) {
            return 'Pour effectuer une réservation, c\'est très simple ! 📅\n\n1. Consultez nos hébergements disponibles\n2. Sélectionnez celui qui vous plaît\n3. Choisissez vos dates\n4. Remplissez vos informations\n5. Confirmez votre réservation\n\nVous devez créer un compte pour réserver. Si vous avez déjà un compte, connectez-vous dans "Mon Compte".';
        }

        // Services et équipements
        if (lowerMessage.includes('service') || lowerMessage.includes('équipement') ||
            lowerMessage.includes('equipement') || lowerMessage.includes('activité') ||
            lowerMessage.includes('activite')) {
            return 'Le Camping Premium propose de nombreux services ! 🌟\n\n✅ Piscine\n✅ Wifi gratuit\n✅ Restaurant\n✅ Aire de jeux pour enfants\n✅ Terrain de sport\n✅ Animations en saison\n\nContactez-nous pour plus de détails sur nos services.';
        }

        // Contact
        if (lowerMessage.includes('contact') || lowerMessage.includes('appel') ||
            lowerMessage.includes('téléphone') || lowerMessage.includes('telephone') ||
            lowerMessage.includes('email') || lowerMessage.includes('joindre')) {
            return 'Vous pouvez nous contacter de plusieurs façons : 📞\n\n📧 Email : contact@campingpremium.fr\n☎️ Téléphone : +33 1 23 45 67 89\n📍 Adresse : Route de la Montagne, 74000 Annecy\n\nOu utilisez notre formulaire de contact sur la page "Contact".';
        }

        // Horaires
        if (lowerMessage.includes('horaire') || lowerMessage.includes('heure') ||
            lowerMessage.includes('ouvert') || lowerMessage.includes('ouvre')) {
            return 'Nos horaires d\'accueil : 🕐\n\n⏰ Lundi - Dimanche : 8h00 - 20h00\n⏰ Réception : 9h00 - 19h00\n\n✅ Check-in : à partir de 14h00\n✅ Check-out : avant 11h00';
        }

        // Blague (doit être avant "Localisation" à cause du mot "ou")
        if (lowerMessage.includes('beurre')) {
            return 'Tu es trop con Cedric';
        }

        // Localisation
        if (lowerMessage.includes('où') || lowerMessage.includes('ou') ||
            lowerMessage.includes('adresse') || lowerMessage.includes('situe') ||
            lowerMessage.includes('localisation') || lowerMessage.includes('trouver')) {
            return 'Nous sommes situés dans un cadre exceptionnel ! 📍\n\n🏔️ Adresse : Route de la Montagne, 74000 Annecy\n\nÀ proximité du lac d\'Annecy et des montagnes. Facilement accessible en voiture.\n\nConsultez la page "Contact" pour voir la carte interactive.';
        }

        // Animaux
        if (lowerMessage.includes('animal') || lowerMessage.includes('chien') ||
            lowerMessage.includes('chat') || lowerMessage.includes('animaux')) {
            return 'Concernant les animaux de compagnie : 🐕\n\nLes animaux sont acceptés dans certains hébergements selon conditions.\n\nMerci de nous contacter directement pour connaître les modalités et les suppléments éventuels.';
        }

        // Annulation
        if (lowerMessage.includes('annul') || lowerMessage.includes('rembours') ||
            lowerMessage.includes('modifi')) {
            return 'Politique d\'annulation : 📋\n\n✅ Annulation gratuite jusqu\'à 7 jours avant l\'arrivée\n⚠️ Entre 7 et 3 jours : 50% du montant sera retenu\n❌ Moins de 3 jours : pas de remboursement\n\nPour modifier ou annuler votre réservation, rendez-vous dans "Mes Réservations".';
        }

        // Paiement
        if (lowerMessage.includes('paiement') || lowerMessage.includes('payer') ||
            lowerMessage.includes('carte') || lowerMessage.includes('cb')) {
            return 'Moyens de paiement acceptés : 💳\n\n✅ Carte bancaire (Visa, Mastercard)\n✅ Paiement sécurisé via Stripe\n✅ Paiement en ligne lors de la réservation\n\nVos données sont 100% sécurisées.';
        }

        // Saisons
        if (lowerMessage.includes('saison') || lowerMessage.includes('période') ||
            lowerMessage.includes('quand') || lowerMessage.includes('mois')) {
            return 'Le Camping Premium est ouvert : 📅\n\n🌸 De avril à octobre\n☀️ Haute saison : juillet - août\n🍂 Basse saison : avril, mai, septembre, octobre\n\nChaque saison a son charme ! Consultez nos tarifs selon les périodes.';
        }

        // Merci
        if (lowerMessage.includes('merci') || lowerMessage.includes('super') ||
            lowerMessage.includes('parfait') || lowerMessage.includes('ok')) {
            return 'Je vous en prie ! 😊 N\'hésitez pas si vous avez d\'autres questions. Bon séjour au Camping Premium ! 🏕️';
        }

        // Salutations
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') ||
            lowerMessage.includes('hello') || lowerMessage.includes('coucou')) {
            return 'Bonjour ! 👋 Comment puis-je vous aider concernant le Camping Premium ?';
        }

        // Au revoir
        if (lowerMessage.includes('au revoir') || lowerMessage.includes('bye') ||
            lowerMessage.includes('ciao') || lowerMessage.includes('adieu')) {
            return 'Au revoir ! À très bientôt au Camping Premium ! 👋🏕️';
        }

        // Question par défaut
        return 'Je ne suis pas sûr de comprendre votre question. 🤔\n\nVoici quelques sujets sur lesquels je peux vous aider :\n\n• Hébergements et types de logements\n• Tarifs et prix\n• Réservations\n• Services et équipements\n• Contact et localisation\n• Horaires\n• Animaux de compagnie\n• Politique d\'annulation\n\nN\'hésitez pas à reformuler votre question !';
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Ajouter le message de l'utilisateur
        const userMessage = {
            type: 'user',
            text: inputValue,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);

        // Simuler un délai de réponse
        setTimeout(() => {
            const botResponse = {
                type: 'bot',
                text: getResponse(inputValue),
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botResponse]);
        }, 500);

        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const quickQuestions = [
        'Quels sont les types d\'hébergements ?',
        'Quels sont vos tarifs ?',
        'Comment réserver ?',
        'Où êtes-vous situés ?',
        'Quels services proposez-vous ?'
    ];

    return (
        <>
            {/* Bouton flottant */}
            <ActionIcon
                className={`chatbot-button ${isOpen ? 'open' : ''}`}
                size={60}
                radius="xl"
                variant="filled"
                color="blue"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <IconX size={28} /> : <IconMessageChatbot size={28} />}
            </ActionIcon>

            {/* Fenêtre de chat */}
            {isOpen && (
                <Paper className="chatbot-window" shadow="xl" radius="lg" withBorder>
                    {/* Header */}
                    <div className="chatbot-header">
                        <Group justify="space-between">
                            <Group gap="xs">
                                <IconMessageChatbot size={24} />
                                <div>
                                    <Text size="sm" fw={600}>Oh !.. Chatbot Brulant..</Text>
                                    <Badge size="xs" color="green" variant="dot">En ligne</Badge>
                                </div>
                            </Group>
                            <ActionIcon variant="subtle" onClick={() => setIsOpen(false)}>
                                <IconX size={20} />
                            </ActionIcon>
                        </Group>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="chatbot-messages" viewportRef={scrollRef}>
                        <Stack gap="md" p="md">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message ${msg.type}`}>
                                    <div className="message-bubble">
                                        <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                                            {msg.text}
                                        </Text>
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {msg.time}
                                        </Text>
                                    </div>
                                </div>
                            ))}

                            {/* Questions rapides (affichées seulement au début) */}
                            {messages.length <= 1 && (
                                <div>
                                    <Text size="xs" c="dimmed" mb="xs">Questions fréquentes :</Text>
                                    <Stack gap="xs">
                                        {quickQuestions.map((q, idx) => (
                                            <button
                                                key={idx}
                                                className="quick-question"
                                                onClick={() => {
                                                    setInputValue(q);
                                                    setTimeout(() => handleSend(), 100);
                                                }}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </Stack>
                                </div>
                            )}
                        </Stack>
                    </ScrollArea>

                    {/* Input */}
                    <div className="chatbot-input">
                        <TextInput
                            placeholder="Posez votre question..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rightSection={
                                <ActionIcon
                                    variant="filled"
                                    color="blue"
                                    onClick={handleSend}
                                    disabled={!inputValue.trim()}
                                >
                                    <IconSend size={18} />
                                </ActionIcon>
                            }
                        />
                    </div>
                </Paper>
            )}
        </>
    );
}
