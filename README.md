# Camping Premium

Plateforme complète de gestion et réservation en ligne pour camping.

## Vue d'ensemble

Camping Premium est une application web full-stack permettant aux visiteurs de consulter et réserver des hébergements en ligne avec paiement sécurisé, et aux administrateurs de gérer l'ensemble des opérations du camping via un tableau de bord complet.

## Architecture du projet

```
PROJET CAMPING/
├── backend/          # API REST Node.js/Express + MySQL
├── frontend/         # Application React + Vite
└── README.md         # Ce fichier
```

## Technologies principales

### Backend
- Node.js + Express.js 5
- MySQL (base de données)
- JWT (authentification)
- Stripe (paiements)

### Frontend
- React 19 + Vite 7
- Mantine UI 8 (composants)
- React Router 7 (navigation)
- Stripe React (paiements)
- Google Analytics 4

## Fonctionnalités

### Pour les visiteurs
- Consultation des hébergements disponibles
- Recherche par dates et nombre de voyageurs
- Visualisation des tarifs et de la galerie
- Formulaire de contact

### Pour les clients
- Inscription et connexion sécurisées
- Réservation en ligne avec paiement Stripe
- Gestion des réservations
- Modification du profil

### Pour les administrateurs
- Tableau de bord complet
- Gestion des utilisateurs et employés
- Gestion des hébergements et types
- Gestion des réservations et statuts
- Configuration des saisons et tarifs
- Gestion des équipements

## Installation rapide

### Prérequis
- Node.js 16+
- MySQL Server
- npm ou yarn

### Backend

```bash
cd backend
npm install
# Créer un fichier .env (voir backend/README.md pour les variables)
npm start
```

Le backend démarre sur `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
# Créer un fichier .env (voir frontend/README.md pour les variables)
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

### Base de données

Importer le fichier SQL pour créer la structure de la base de données:
```bash
mysql -u root -p < scriptCampingProject.sql
```

## Documentation complète

- **[Documentation Backend](./backend/README.md)** - Architecture API, routes, modèles, configuration
- **[Documentation Frontend](./frontend/README.md)** - Architecture React, composants, pages, routing

## Scripts disponibles

### Backend
```bash
npm start    # Démarre le serveur avec nodemon (port 3000)
```

### Frontend
```bash
npm run dev     # Serveur de développement (port 5173)
npm run build   # Build de production
npm run preview # Prévisualisation du build
npm run lint    # Vérification ESLint
```

## Variables d'environnement

### Backend (.env)
```env
PORT=3000
HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=camping_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=72h
STRIPE_SECRET_KEY=sk_test_...
```

### Frontend (.env)
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Workflow de développement

1. Démarrer MySQL
2. Lancer le backend: `cd backend && npm start`
3. Lancer le frontend: `cd frontend && npm run dev`
4. Accéder à l'application: `http://localhost:5173`

Le proxy Vite redirige automatiquement les requêtes `/api/*` vers le backend.

## Structure des données

### Tables principales
- `users` - Utilisateurs (clients et admins)
- `accomodation` - Hébergements
- `accomodation_type` - Types d'hébergements
- `booking` - Réservations
- `stay` - Séjours
- `payment` - Paiements
- `tarif` - Tarifs par type et saison
- `season` - Saisons tarifaires
- `equipment` - Équipements

Voir la [documentation backend](./backend/README.md#5-base-de-données) pour le schéma complet.

## Sécurité

- Authentification JWT avec tokens stockés en localStorage
- Mots de passe hashés avec bcrypt
- Middleware de protection des routes (admin, user, ownerOrAdmin)
- Paiements sécurisés via Stripe
- CORS configuré

## Support et contribution

Pour toute question ou contribution, consulter les README détaillés du [backend](./backend/README.md) et [frontend](./frontend/README.md).
