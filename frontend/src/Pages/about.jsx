import { Container, Title, Text } from "@mantine/core";

export function About() {
    return (
        <Container>
            <Title order={2}>À propos</Title>
            <Text>
                Ce site a été développé par :
                <br />
                <br />
                <Text fw={500}>Giuseppe</Text>
                <Text fw={500}>Julien</Text>
                <Text fw={500}>Cédric</Text>
                <Text fw={500}>Anisse</Text>

                <Text fw={500}>Contact : </Text>
                <Text>anisse@anisse.com</Text>
                <Text>Giuseppe : giuseppe@giuseppe.com</Text>
                <Text>Julien : julien@julien.com</Text>
                <Text>Cédric : cedric@cedric.com</Text>

                <Text fw={500}>GitHub : </Text>
                <Text>Giuseppe : <a href="https://github.com/giuseppe">Giuseppe</a></Text>
                <Text>Julien : <a href="https://github.com/julien">Julien</a></Text>
                <Text>Cédric : <a href="https://github.com/cedric">Cédric</a></Text>
                <Text>Anisse : <a href="https://github.com/anisse">Anisse</a></Text>

                <Text fw={500}>LinkedIn : </Text>
                <Text>Giuseppe : <a href="https://linkedin.com/in/giuseppe">Giuseppe</a></Text>
                <Text>Julien : <a href="https://linkedin.com/in/julien">Julien</a></Text>
                <Text>Cédric : <a href="https://linkedin.com/in/cedric">Cédric</a></Text>
                <Text>Anisse : <a href="https://linkedin.com/in/anisse">Anisse</a></Text>
            </Text>
        </Container>
    );
}