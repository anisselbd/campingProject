import React, { useState, useCallback, useRef } from "react";
import "@mantine/core/styles.layer.css";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Container,
  Collapse,
  Box,
} from "@mantine/core";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import imageCard1 from "../assets/imageCard1.png";
import imageCard2 from "../assets/imageCard2.png";
import imageCard3 from "../assets/imageCard3.jpg";

const Actualites = () => {
  const [open, setOpen] = useState(false);
  const autoplay = useRef(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }, (emblaRoot, onStop) => {
      autoplay.current = { stop: onStop.stop, play: onStop.play };
    }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      image: imageCard1,
      title: "Fête d'inauguration",
      date: "01/06/2025",
      description:
        "Venez célébrer avec toute l'équipe de votre camping préféré, le lancement de la nouvelle saison.",
      details: [
        "Ambiance festive garantie, avec la présence de David Guetta et plein d'autres célébrités.",
        "Profiter d'un repas gastronomique sain et varié.",
        "Spectacle de magie, d'hypnose et plein d'autres, digne d'un cabaret.",
      ],
    },
    {
      image: imageCard2,
      title: "Soirée Barbeuc",
      date: "15/06/2025",
      description:
        "Une soirée barbecue pour profiter des belles soirées d'été en famille ou entre amis.",
      details: [
        "Viandes et légumes grillés à volonté.",
        "Ambiance musicale et jeux pour enfants.",
        "Boissons fraîches et desserts maison.",
        "Un concours pour désigner le Roi et la Reine du Barbecue",
        "Bonus : Des cadeaux à remporter en fin de soirée"
      ],
    },
    {
      image: imageCard3,
      title: "Tournoi Sportif",
      date: "22/06/2025",
      description:
        "Un tournoi sportif pour tous les âges et tous les niveaux. Venez participer ou encourager les équipes !",
      details: [
        "Participer à nos premiers Jeux Olympiques 'Sun Olympia'",
        "Prix pour les gagnants et ambiance conviviale.",
        "Repas et boissons inclus pour tous les participants.",
      ],
    },
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      autoplay.current.stop();
    } else {
      autoplay.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <Container
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            <div
              ref={emblaRef}
              style={{ overflow: "hidden", cursor: "pointer" }}
              onClick={togglePlayPause}
            >
              <div style={{ display: "flex" }}>
                {slides.map((slide, index) => (
                  <div key={index} style={{ flex: "0 0 100%", minWidth: 0 }}>
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      style={{ height: "100%" }}
                    >
                      <Card.Section
                        style={{ height: "400px", overflow: "hidden" }}
                      >
                        <Image
                          src={slide.image}
                          height="100%"
                          width="100%"
                          alt={slide.title}
                          fit="cover"
                        />
                      </Card.Section>

                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>{slide.title}</Text>
                        <Badge color="red">{slide.date}</Badge>
                      </Group>

                      <Text size="sm" c="dimmed">
                        {slide.description}
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "10px",
                        }}
                      >
                        <Button
                          style={{
                            backgroundColor: "#2E8B57",
                            color: "#FFFFFF",
                            width: "40%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={toggleOpen}
                        >
                          {open ? "Réduire" : "Voir en détails"}
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <Box
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                emblaApi && emblaApi.scrollPrev();
              }}
            >
              <IconChevronLeft color="white" size={20} />
            </Box>

            <Box
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                emblaApi && emblaApi.scrollNext();
              }}
            >
              <IconChevronRight color="white" size={20} />
            </Box>
          </div>

          <Collapse in={open}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                borderTop: "none",
                borderTopLeftRadius: "0",
                borderTopRightRadius: "0",
                marginTop: "-20px",
              }}
            >
              <Text mt="md">
                Détails :
                <ul>
                  {slides[selectedIndex].details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </Text>
            </Card>
          </Collapse>
        </div>
      </Container>
    </div>
  );
};

export default Actualites;
