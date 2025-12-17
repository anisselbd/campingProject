import { AspectRatio, Card, Container, Image, SimpleGrid, Text } from '@mantine/core';
import classes from './ArticlesCardsGrid.module.css';
import imageCard1 from '../assets/imageCard1.png'
import imageCard2 from '../assets/imageCard2.png'
import imageCard3 from '../assets/imageCard3.jpg'

const mockdata = [
    {
        title: 'Venez célébrer avec toute l\'équipe de votre camping préféré, le lancement de la nouvelle saison.',
        image:
            imageCard1,
        date: 'August 18, 2022',
    },
    {
        title: 'Une soirée barbecue pour profiter des belles soirées d\'été en famille ou entre amis.',
        image:
            imageCard2,
        date: 'August 27, 2022',
    },
    {
        title: 'Un tournoi sportif pour tous les âges et tous les niveaux. Venez participer ou encourager les équipes !',
        image:
            imageCard3,
        date: 'September 9, 2022',
    },
    {
        title: 'Venez profiter des magnifiques ciels etoilés de votre camping préféré.',
        image:
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
        date: 'September 12, 2022',
    },
];

export function ArticlesCardsGrid() {
    const cards = mockdata.map((article) => (
        <Card key={article.title} p="md" radius="md" component="a" href="#" className={classes.card}>
            <AspectRatio ratio={1920 / 1080}>
                <Image src={article.image} radius="md" />
            </AspectRatio>
            <Text className={classes.date}>{article.date}</Text>
            <Text className={classes.title}>{article.title}</Text>
        </Card>
    ));

    return (
        <Container py="xl">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: 0, sm: 'md' }}>
                {cards}
            </SimpleGrid>
        </Container>
    );
}

export default ArticlesCardsGrid;