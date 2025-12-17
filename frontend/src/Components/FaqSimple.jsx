import { Accordion, Container, Title } from '@mantine/core';
import classes from './FaqSimple.module.css';



export function FaqSimple() {
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        Foire aux questions
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="reset-password">
          <Accordion.Control>Comment puis-je réinitialiser mon mot de passe?</Accordion.Control>
          <Accordion.Panel>Vous pouvez réinitialiser votre mot de passe en cliquant sur le bouton "Mot de passe oublié" sur la page de connexion. Vous recevrez ensuite un email avec un lien de réinitialisation.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="another-account">
          <Accordion.Control>Puis-je créer plus d'un compte?</Accordion.Control>
          <Accordion.Panel>Non, vous ne pouvez pas créer plus d'un compte.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="newsletter">
          <Accordion.Control>Comment puis-je m'abonner à la newsletter?</Accordion.Control>
          <Accordion.Panel>Vous pouvez vous abonner à la newsletter en cliquant sur le bouton "S'abonner" dans le bas de la page.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="credit-card">
          <Accordion.Control>Est-ce que vous stockez des informations de carte de crédit de manière sécurisée?</Accordion.Control>
          <Accordion.Panel>Non, nous ne stockons pas d'informations de carte de crédit.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="payment">
          <Accordion.Control>Quels systèmes de paiement travaillez-vous?</Accordion.Control>
          <Accordion.Panel>Vous pouvez payer en ligne en utilisant les cartes de crédit suivantes : Visa, Mastercard, American Express et Discover. Nous utilisons Stripe pour sécuriser les transactions.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default FaqSimple;
