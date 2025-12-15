# Frontend - Camping Premium

## 1. Présentation du projet

### Objectif de l'application front-end

L'application front-end constitue l'interface utilisateur complète pour la plateforme de gestion de camping. Elle permet aux visiteurs de consulter les hébergements disponibles, effectuer des réservations en ligne avec paiement sécurisé, et gérer leur compte. Elle offre également un tableau de bord d'administration complet pour la gestion opérationnelle du camping.

### Utilisateurs ciblés

- **Visiteurs non authentifiés**: Consultation des hébergements, tarifs, galerie et informations de contact
- **Clients enregistrés**: Réservation d'hébergements, gestion des réservations, modification du profil, paiements en ligne
- **Administrateurs**: Gestion complète des hébergements, types, tarifs, saisons, équipements, employés, utilisateurs et réservations

## 2. Stack technique

### Framework / librairie
- React `^19.2.0` (Latest version)
- React DOM `^19.2.0`

### Outil de build
- Vite `^7.2.4`
- Plugin React pour Vite `@vitejs/plugin-react` `^5.1.1`

### Gestion d'état
- React Context API (AuthContext pour l'authentification globale)
- Hooks React natifs (useState, useEffect, useContext)
- LocalStorage pour la persistance de l'authentification

### Méthode de stylisation
- Mantine UI `^8.3.9` - Bibliothèque de composants React
  - `@mantine/core`: Composants UI principaux
  - `@mantine/dates`: Composants de sélection de dates
  - `@mantine/form`: Gestion des formulaires
  - `@mantine/hooks`: Hooks utilitaires
- PostCSS `^8.5.6` avec présets Mantine
- Thème personnalisé avec palette de couleurs "brand" (vert #2E8B57)
- Typographie: Google Fonts (Montserrat pour titres, Open Sans pour texte)

### Communication avec l'API
- Axios `^1.13.2` pour les requêtes HTTP
- Proxy Vite configuré (`/api` → `http://localhost:3000`)
- JWT stocké dans localStorage et envoyé via headers Authorization

### Bibliothèques additionnelles
- **Routing**: React Router DOM `^7.10.1`
- **Authentification**: jwt-decode `^4.0.0`
- **Paiement**: Stripe React (`@stripe/react-stripe-js` `^5.4.1`, `@stripe/stripe-js` `^8.5.3`)
- **Icônes**: Tabler Icons React `^3.35.0`
- **Dates**: Day.js `^1.11.19`
- **Analytics**: Google Analytics 4 (intégration custom pour les besoins du projet)

### Outils de développement
- ESLint `^9.39.1` avec plugins React
- TypeScript definitions pour React
- Vite DevServer avec Hot Module Replacement

## 3. Architecture de l'application

### Organisation des dossiers

```
frontend/
├── public/                      # Ressources statiques
├── src/
│   ├── Components/              # Composants réutilisables
│   │   ├── Navbar.jsx          # Navigation principale avec menu utilisateur
│   │   ├── Footer.jsx          # Pied de page
│   │   ├── BookingModal.jsx    # Modale de réservation avec calculs
│   │   └── PaymentForm.jsx     # Formulaire de paiement Stripe
│   ├── Pages/                   # Pages de l'application
│   │   ├── Home.jsx            # Page d'accueil avec hero et recherche
│   │   ├── Hebergements.jsx    # Liste des hébergements disponibles
│   │   ├── HebergementsDetails.jsx  # Détails d'un hébergement
│   │   ├── Galerie.jsx         # Galerie photos
│   │   ├── Tarifs.jsx          # Grille tarifaire
│   │   ├── Contact.jsx         # Formulaire de contact
│   │   ├── Login.jsx           # Connexion
│   │   ├── Register.jsx        # Inscription
│   │   ├── MesReservations.jsx # Réservations de l'utilisateur
│   │   ├── Profil.jsx          # Gestion du profil utilisateur
│   │   └── adminPages/         # Pages d'administration
│   │       ├── Dashboard.jsx   # Tableau de bord admin
│   │       └── components/     # Composants du dashboard
│   │           ├── UsersTab.jsx
│   │           ├── EmployeesTab.jsx
│   │           ├── HebergementsTab.jsx
│   │           ├── ReservationsTab.jsx
│   │           ├── SeasonsTab.jsx
│   │           ├── TarifsTab.jsx
│   │           ├── EquipmentsTab.jsx
│   │           ├── AddHebergementModal.jsx
│   │           ├── EditHebergementModal.jsx
│   │           ├── AddTypeModal.jsx
│   │           ├── AddRoleModal.jsx
│   │           ├── EmployeeModal.jsx
│   │           └── index.js    # Exports centralisés
│   ├── Context/
│   │   └── AuthContext.jsx     # Contexte d'authentification global
│   ├── hooks/
│   │   └── usePageTracking.js  # Hook pour tracking GA4
│   ├── utils/
│   │   └── analytics.js        # Fonctions Google Analytics 4
│   ├── assets/                  # Images et ressources
│   ├── App.jsx                  # Composant racine avec routing
│   ├── main.jsx                 # Point d'entrée React
│   ├── index.css                # Styles globaux
│   └── App.css                  # Styles du composant App
├── index.html                   # Template HTML + GA4 script
├── vite.config.js               # Configuration Vite
├── eslint.config.js             # Configuration ESLint
├── postcss.config.cjs           # Configuration PostCSS
├── package.json                 # Dépendances et scripts
└── .env                         # Variables d'environnement
```

### Logique des composants

**Composants partagés**:
- `Navbar`: Navigation responsive avec menu burger mobile, affichage conditionnel selon authentification, menu dropdown pour utilisateur connecté, bouton Dashboard pour admins
- `Footer`: Informations de contact, liens, réseaux sociaux
- `BookingModal`: Modale complexe de réservation avec calcul automatique de prix, validation de disponibilité, sélection de dates, nombre de personnes, intégration Stripe
- `PaymentForm`: Formulaire Stripe Elements pour paiement par carte

**Pages publiques**:
- `Home`: Hero avec image de fond, formulaire de recherche (dates + voyageurs), section features
- `Hebergements`: Liste des hébergements avec filtres par type, capacité, dates
- `HebergementsDetails`: Détails complets d'un hébergement, bouton de réservation
- `Galerie`: Grille d'images avec modale de visualisation
- `Tarifs`: Tableau des tarifs par type et saison
- `Contact`: Formulaire de contact avec informations

**Pages authentifiées**:
- `Login`: Formulaire de connexion avec redirection
- `Register`: Formulaire d'inscription complet (infos personnelles + adresse)
- `MesReservations`: Liste des réservations de l'utilisateur avec statuts, possibilité d'annulation
- `Profil`: Modification des informations personnelles, changement de mot de passe

**Dashboard Admin**:
- `Dashboard`: Interface à onglets (Tabs) regroupant 7 sections de gestion
  - **UsersTab**: Liste des utilisateurs, modification du rôle, désactivation
  - **EmployeesTab**: Gestion des employés
  - **HebergementsTab**: CRUD des hébergements avec modales
  - **ReservationsTab**: Liste et modification des réservations, changement de statut
  - **SeasonsTab**: Gestion des saisons tarifaires
  - **TarifsTab**: Configuration des tarifs par type et saison
  - **EquipmentsTab**: Gestion des équipements et liaison avec hébergements

### Routing et navigation

Routes définies dans `App.jsx`:

| Route | Composant | Protection | Description |
|-------|-----------|------------|-------------|
| `/` | Home | Publique | Page d'accueil |
| `/hebergements` | Hebergements | Publique | Liste hébergements |
| `/hebergements/:id` | HebergementsDetails | Publique | Détails hébergement |
| `/galerie` | Galerie | Publique | Galerie photos |
| `/tarifs` | Tarifs | Publique | Grille tarifaire |
| `/contact` | Contact | Publique | Contact |
| `/register` | Register | Publique | Inscription |
| `/login` | Login | Publique | Connexion |
| `/mes-reservations` | MesReservations | User | Réservations utilisateur |
| `/profil` | Profil | User | Profil utilisateur |
| `/admin/dashboard` | Dashboard | Admin | Tableau de bord admin |

**Navigation**:
- Utilisation de `useNavigate()` pour navigation programmatique
- `useLocation()` pour détection de route active (style navbar)
- Protection des routes via vérification de `user.type_compte` dans les composants

## 4. Configuration de l'environnement

### Variables d'environnement utilisées

Les variables d'environnement sont préfixées `VITE_` pour être accessibles dans le code client Vite.

| Variable | Rôle |
|----------|------|
| `VITE_GA_MEASUREMENT_ID` | ID de mesure Google Analytics 4 pour le tracking des événements et pages vues |

### Rôle de chaque variable

**VITE_GA_MEASUREMENT_ID**:
- Format attendu: `G-XXXXXXXXXX`
- Chargé dans `index.html` pour initialiser le script gtag.js
- Utilisé par `analytics.js` pour envoyer les événements GA4
- Si absent, les événements analytics sont désactivés avec warnings en console

### Configuration supplémentaire

**Proxy Vite** (`vite.config.js`):
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```
Redirige toutes les requêtes `/api/*` vers le backend sur port 3000.

**Thème Mantine** (`main.jsx`):
- Couleur primaire: `brand` (palette verte personnalisée #2E8B57)
- Polices: Montserrat (titres), Open Sans (texte)
- Rayon des boutons: `md` (8px)

## 5. Fonctionnalités disponibles

### Fonctionnalités visiteurs

**Navigation et Information**:
- Consultation de la liste des hébergements disponibles
- Filtrage des hébergements par type et capacité
- Visualisation des détails complets d'un hébergement
- Consultation de la galerie photos
- Affichage des tarifs par type d'hébergement et saison
- Formulaire de contact

**Recherche d'hébergements**:
- Sélection de dates d'arrivée et départ (calendrier DateInput)
- Sélection du nombre de voyageurs
- Validation des champs obligatoires
- Redirection vers `/hebergements` avec paramètres de recherche en query string

### Fonctionnalités utilisateurs authentifiés

**Authentification**:
- Inscription avec formulaire complet (email, mot de passe, nom, prénom, téléphone, adresse complète)
- Connexion avec email et mot de passe
- Stockage du JWT et des données utilisateur dans localStorage
- Déconnexion avec nettoyage du localStorage
- Persistance de la session (reload de page)

**Réservations**:
- Ouverture de modale de réservation depuis la page de détails d'un hébergement
- Sélection de dates d'arrivée et départ
- Sélection du nombre d'adultes et enfants
- Calcul automatique du nombre de nuits
- Calcul automatique du montant total selon le tarif
- Validation de disponibilité de l'hébergement
- Paiement intégré via Stripe (carte bancaire)
- Création de la réservation après confirmation de paiement
- Tracking GA4 des étapes de réservation

**Gestion du compte**:
- Visualisation de toutes ses réservations avec statuts
- Annulation de réservations
- Modification du profil (informations personnelles, adresse)
- Changement de mot de passe

### Fonctionnalités administrateur

**Gestion des utilisateurs**:
- Liste de tous les utilisateurs inscrits
- Modification du rôle utilisateur (user/admin)
- Activation/désactivation de comptes

**Gestion des employés**:
- Ajout, modification, suppression d'employés

**Gestion des hébergements**:
- Création de nouveaux hébergements (type, référence, nom, description, capacité, surface, localisation)
- Modification des hébergements existants
- Suppression d'hébergements
- Activation/désactivation d'hébergements
- Basculer l'état réservable

**Gestion des types d'hébergement**:
- Ajout de nouveaux types (nom, code, description, capacité par défaut, surface moyenne)
- Modification des types existants
- Activation/désactivation de types

**Gestion des réservations**:
- Visualisation de toutes les réservations
- Recherche et filtrage des réservations
- Modification du statut (en attente, confirmée, annulée, terminée)
- Suppression de réservations

**Gestion des saisons**:
- Création de saisons tarifaires (nom, dates de début et fin)
- Modification des périodes de saisons
- Suppression de saisons

**Gestion des tarifs**:
- Définition des prix par type d'hébergement et par saison
- Création de nouveaux tarifs
- Modification des tarifs existants
- Suppression de tarifs

**Gestion des équipements**:
- Ajout d'équipements (nom, description, icône)
- Association d'équipements aux hébergements
- Modification et suppression d'équipements

### Analytics et tracking

**Google Analytics 4**:
- Tracking automatique des pages vues à chaque changement de route
- Événements personnalisés trackés:
  - `view_hebergement`: Consultation d'un hébergement
  - `start_reservation`: Début du processus de réservation
  - `reservation_submitted`: Soumission d'une réservation
  - `payment_success`: Paiement réussi
- Gestion du consentement analytics (variable `consentGranted`)
- Logs en mode développement pour debugging

### Comportement de l'UI

**Formulaires**:
- Validation en temps réel avec affichage d'erreurs
- Messages d'erreur contextuels
- États de chargement (loading states) lors des requêtes API
- Notifications de succès/erreur après actions

**Navigation responsive**:
- Menu burger sur mobile (Drawer Mantine)
- Menu horizontal sur desktop
- Adaptation automatique selon la taille d'écran

**Interactions**:
- Hover effects sur boutons et liens
- Active state sur liens de navigation
- Modales pour actions importantes (réservation, ajout/modification)
- Confirmations avant suppressions

## 6. Scripts disponibles

### Scripts npm

Définis dans `package.json`:

| Script | Commande | Description |
|--------|----------|-------------|
| `dev` | `vite` | Lance le serveur de développement Vite sur port 5173 par défaut |
| `build` | `vite build` | Compile l'application pour la production (dist/) |
| `lint` | `eslint .` | Exécute ESLint sur tout le projet |
| `preview` | `vite preview` | Prévisualise le build de production en local |

### Rôle de chaque commande

**dev**:
- Active le Hot Module Replacement (HMR)
- Proxy `/api` vers `http://localhost:3000`
- Rechargement automatique à chaque modification
- Mode développement avec source maps et logs GA4

**build**:
- Minification du code JavaScript et CSS
- Tree-shaking des dépendances inutilisées
- Optimisation des assets
- Génération du dossier `dist/` prêt pour déploiement

**lint**:
- Vérifie le code selon les règles ESLint configurées
- Détecte les erreurs de syntaxe et mauvaises pratiques
- Applique les règles React hooks et React refresh

**preview**:
- Sert le contenu du dossier `dist/` après build
- Permet de tester le build de production localement avant déploiement

## 7. Installation et lancement

### Prérequis

- Node.js version 16+ (recommandé: 18+)
- npm ou yarn
- Backend API en cours d'exécution sur `http://localhost:3000`
- Compte Stripe (pour les paiements)
- Compte Google Analytics 4 (optionnel, pour analytics)

### Installation

1. Naviguer vers le dossier frontend:
```bash
cd frontend
```

2. Installer les dépendances:
```bash
npm install
```

3. Créer un fichier `.env` à la racine du dossier `frontend`:
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Vérifier que le backend est bien lancé sur le port 3000.

### Lancement en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (port par défaut Vite).

Le terminal affichera:
```
VITE v7.2.4  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Lancement en mode production

1. Builder l'application:
```bash
npm run build
```

2. Prévisualiser le build:
```bash
npm run preview
```

3. Pour un déploiement réel, servir le contenu du dossier `dist/` avec un serveur web (nginx, Apache, ou plateforme cloud).

### Vérification de l'installation

1. Accéder à `http://localhost:5173`
2. Vérifier que la page d'accueil s'affiche correctement
3. Vérifier la console pour les messages GA4 (si configuré)
4. Tester la navigation vers `/hebergements`
5. Vérifier que les requêtes API fonctionnent (via Network tab)

## 8. Qualité du code

### Bonnes pratiques détectées

**Architecture et organisation**:
- Séparation claire des responsabilités (Components, Pages, Context, Hooks, Utils)
- Composants réutilisables extraits (Navbar, Footer, Modales)
- Centralisation de la logique d'authentification dans un Context
- Exports centralisés pour les composants admin (`index.js`)

**React moderne**:
- Utilisation exclusive des functional components
- Hooks natifs (useState, useEffect, useContext, useLocation, useNavigate)
- Custom hooks pour logique réutilisable (`usePageTracking`)
- Respect des règles des hooks

**Gestion d'état**:
- Context API pour état global (authentification)
- LocalStorage pour persistance
- États locaux pertinents aux composants
- Pas de prop drilling excessif grâce au Context

**UI/UX**:
- Bibliothèque de composants cohérente (Mantine)
- Thème personnalisé centralisé
- Navigation responsive native
- Accessibilité via composants Mantine (aria labels, keyboard navigation)

**Performance**:
- Lazy evaluation possible via React Router (non implémenté mais architecture prête)
- Proxy Vite pour requêtes API (évite CORS en dev)
- Build optimisé avec Vite (HMR, tree-shaking)

**Analytics et monitoring**:
- Intégration GA4 complète avec événements métier
- Logs conditionnels en mode développement
- Gestion du consentement analytics

### Structure et lisibilité

**Code lisible**:
- Nommage descriptif des variables et fonctions
- Indentation cohérente
- Composants de taille raisonnable (découpage admin dashboard pour plus de lisibilité et de maintenabilité)

**Conventions**:
- Extensions `.jsx` pour fichiers React
- PascalCase pour composants
- camelCase pour fonctions et variables
- Imports groupés logiquement

**Modularité**:
- Composants admin séparés dans leur propre dossier
- Utilitaires dans `/utils`
- Hooks personnalisés dans `/hooks`
- Contexts dans `/Context`

