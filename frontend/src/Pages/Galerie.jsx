import { Container, Title, SimpleGrid, Image, Text, Modal, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

const images = [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1525811902676-d458d3726580?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
];

export function Galerie() {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (src) => {
        setSelectedImage(src);
        open();
    };

    return (
        <Container size="xl" py="xl">
            <Title order={1} align="center" mb={20} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Notre Galerie
            </Title>
            <Text align="center" c="dimmed" mb={50} maw={600} mx="auto">
                Découvrez la beauté de notre camping et de ses environs. Un cadre idyllique pour des vacances inoubliables.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {images.map((src, index) => (
                    <Box
                        key={index}
                        onClick={() => handleImageClick(src)}
                        style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: 8 }}
                    >
                        <Image
                            src={src}
                            radius="md"
                            h={300}
                            fit="cover"
                            style={{ transition: 'transform 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </Box>
                ))}
            </SimpleGrid>
            <Modal opened={opened} onClose={close} size="xl" centered withCloseButton={false} padding={0}>
                {selectedImage && (
                    <Image src={selectedImage} />
                )}
            </Modal>
        </Container>
    );
}
