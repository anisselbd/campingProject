# Backend - API Camping Premium

## 1. Présentation du projet

### Rôle du back-end

Le back-end de ce projet fournit une API REST sécurisée pour la gestion complète d'un camping. Il expose des endpoints permettant de gérer les utilisateurs, les hébergements, les réservations, les paiements, les employés, les tarifs, ainsi que divers services annexes (coupons, options, factures, tickets de support).

### Fonctionnement global dans l'application

L'API agit comme interface centralisée entre la base de données MySQL et le front-end React. Elle assure:
- L'authentification et l'autorisation via JWT
- La validation et le traitement des requêtes
- L'intégrité des données métier (disponibilité des hébergements, calcul des tarifs, gestion des réservations)
- L'intégration avec des services tiers (Stripe pour les paiements)
- La gestion des rôles (admin, user)

## 2. Stack technique

### Runtime
- Node.js (ES Modules)

### Framework
- Express.js `^5.1.0`

### Base de données
- MySQL 2 (via `mysql2` `^3.15.3`)
- Pool de connexions pour optimiser les performances

### ORM / système de requêtes
Requêtes SQL natives via `mysql2/promise`

### Authentification / sécurité
- JSON Web Token (`jsonwebtoken` `^9.0.2`)
- Bcrypt.js (`bcryptjs` `^3.0.3`) pour le hachage des mots de passe
- Middleware d'authentification personnalisé
- Middleware de contrôle des rôles (admin, user, ownerOrAdmin)
- CORS (`cors` `^2.8.5`)

### Services externes
- Stripe (`stripe` `^20.0.0`) - Intégration pour les paiements en ligne

### Autres dépendances
- dotenv (`^17.2.3`) - Gestion des variables d'environnement
- nodemon (`^3.1.11`) - Rechargement automatique en développement

## 3. Architecture du projet

### Arborescence des dossiers

```
backend/
├── config/
│   └── bdd.js                    # Configuration de la connexion MySQL
├── middleware/
│   └── authMiddleware.js         # Middleware JWT et contrôles d'accès
├── models/
│   ├── usersModel.js             # Gestion des utilisateurs
│   ├── hebergementsModel.js      # Gestion des hébergements
│   ├── typesHebergementModel.js  # Types d'hébergements
│   ├── bookingModel.js           # Réservations et séjours
│   ├── paymentModel.js           # Paiements
│   ├── invoiceModel.js           # Factures
│   ├── couponModel.js            # Coupons de réduction
│   ├── couponUsageModel.js       # Utilisation des coupons
│   ├── optionModel.js            # Options supplémentaires
│   ├── stayOptionModel.js        # Options appliquées aux séjours
│   ├── tarifModel.js             # Tarifs par type et saison
│   ├── seasonModel.js            # Saisons tarifaires
│   ├── employeeModel.js          # Employés
│   ├── roleModel.js              # Rôles employés
│   ├── roleAffectationModel.js   # Affectations de rôles
│   ├── employeeShiftModel.js     # Planning employés
│   ├── ticketModel.js            # Tickets de support
│   ├── emailLogModel.js          # Logs d'emails
│   ├── equipmentModel.js         # Équipements
│   └── hebergementEquipementModel.js  # Équipements par hébergement
├── controllers/
│   ├── usersController.js
│   ├── hebergementsController.js
│   ├── typesHebergementController.js
│   ├── bookingController.js
│   ├── paymentController.js
│   ├── invoiceController.js
│   ├── couponController.js
│   ├── optionController.js
│   ├── tarifController.js
│   ├── seasonController.js
│   ├── stripeController.js
│   ├── employeeController.js
│   ├── roleController.js
│   ├── roleAffectationController.js
│   ├── employeeShiftController.js
│   ├── ticketController.js
│   ├── emailLogController.js
│   ├── equipmentController.js
│   └── hebergementEquipmentController.js
├── routes/
│   ├── usersRoutes.js
│   ├── hebergementsRoutes.js
│   ├── typesHebergementRoutes.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   ├── invoiceRoutes.js
│   ├── couponRoutes.js
│   ├── optionRoutes.js
│   ├── tarifRoutes.js
│   ├── seasonRoutes.js
│   ├── stripeRoutes.js
│   ├── employeeRoutes.js
│   ├── rolesRoutes.js
│   ├── roleAffectationsRoutes.js
│   ├── employeeShiftsRoutes.js
│   ├── ticketsRoutes.js
│   ├── emailLogsRoutes.js
│   ├── equipmentsRoutes.js
│   └── hebergementEquipementsRoutes.js
├── index.js                      # Point d'entrée de l'application
├── package.json
└── .env                          # Variables d'environnement (ignoré par git)
```

### Pattern utilisé

Architecture **MVC (Model-View-Controller)** adaptée pour une API REST:

- **Models**: Couche d'accès aux données (interactions avec MySQL)
- **Controllers**: Logique métier et traitement des requêtes
- **Routes**: Définition des endpoints et application des middlewares

### Flux d'une requête

```
Client (Frontend)
    ↓
[HTTP Request]
    ↓
Express Router (routes/)
    ↓
Middleware (authMiddleware, adminMiddleware, etc.)
    ↓
Controller (controllers/)
    ↓
Model (models/)
    ↓
MySQL Database
    ↓
[Response avec données ou erreur]
    ↓
Client (Frontend)
```

## 4. Configuration de l'environnement

### Variables d'environnement nécessaires

Les variables suivantes doivent être définies dans un fichier `.env` à la racine du dossier backend:

| Variable | Rôle | Exemple |
|----------|------|---------|
| `PORT` | Port d'écoute du serveur | `3000` |
| `HOST` | Hôte de la base de données MySQL | `localhost` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | `password` |
| `DB_NAME` | Nom de la base de données | `camping_db` |
| `JWT_SECRET` | Clé secrète pour signer les JWT | `votre_secret_jwt_complexe` |
| `JWT_EXPIRES_IN` | Durée de validité du token JWT | `72h` |
| `JWT_REFRESH_SECRET` | Clé pour les refresh tokens (optionnel) | `votre_refresh_secret` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe pour les paiements | `sk_test_...` |

### Exemple `.env.example`

```env
# Serveur
PORT=3000

# Base de données MySQL
HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=camping_db

# Authentification JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=72h
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## 5. Base de données

### Type de base

MySQL

### Tables / entités détectées

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs du système (clients et admins) |
| `accomodation` | Hébergements disponibles (mobil-homes, emplacements, etc.) |
| `accomodation_type` | Types d'hébergements |
| `booking` | Réservations globales |
| `stay` | Séjours individuels liés à une réservation |
| `payment` | Paiements effectués |
| `invoice` | Factures générées |
| `coupon` | Coupons de réduction |
| `coupon_usage` | Utilisation des coupons |
| `option` | Options supplémentaires (petit-déjeuner, vélo, etc.) |
| `stay_option` | Options associées aux séjours |
| `tarif` | Tarifs par type d'hébergement et saison |
| `season` | Saisons tarifaires (haute, basse, moyenne) |
| `employee` | Employés du camping |
| `role` | Rôles des employés |
| `role_affectation` | Affectations de rôles aux employés |
| `employee_shift` | Planning des employés |
| `support_ticket` | Tickets de support client |
| `email_log` | Historique des emails envoyés |
| `equipment` | Équipements disponibles |
| `hebergement_equipement` | Liaison entre hébergements et équipements |

### Relations principales

- `users` (1) ↔ (N) `booking` : Un utilisateur peut avoir plusieurs réservations
- `booking` (1) ↔ (N) `stay` : Une réservation peut contenir plusieurs séjours
- `accomodation` (1) ↔ (N) `stay` : Un hébergement peut être réservé plusieurs fois
- `accomodation_type` (1) ↔ (N) `accomodation` : Un type regroupe plusieurs hébergements
- `booking` (1) ↔ (N) `payment` : Une réservation peut avoir plusieurs paiements
- `booking` (1) ↔ (1) `invoice` : Une réservation génère une facture
- `stay` (N) ↔ (N) `option` via `stay_option` : Un séjour peut avoir plusieurs options
- `accomodation_type` (1) ↔ (N) `tarif` : Tarifs définis par type et saison
- `season` (1) ↔ (N) `tarif` : Une saison a différents tarifs selon le type
- `employee` (N) ↔ (N) `role` via `role_affectation` : Employés avec plusieurs rôles
- `accomodation` (N) ↔ (N) `equipment` via `hebergement_equipement` : Équipements par hébergement

### Scripts SQL ou migrations

 La structure de la base de données est fournie dans le fichier `scriptCampingProject.sql`.

## 6. Documentation de l'API

### Routes groupées par ressource

#### **Utilisateurs** (`/api/users`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| POST | `/register` | Publique | Créer un compte utilisateur |
| POST | `/login` | Publique | Authentification et génération du JWT |
| GET | `/` | Admin | Récupérer tous les utilisateurs |
| GET | `/:id` | User/Admin | Récupérer un utilisateur par ID |
| PUT | `/:id` | User/Admin | Modifier les informations utilisateur |
| PUT | `/:id/password` | User/Admin | Changer le mot de passe |
| DELETE | `/:id` | Admin | Supprimer un utilisateur |
| PUT | `/:id/deactivate` | Admin | Désactiver un compte |
| PUT | `/:id/activate` | Admin | Activer un compte |

**Corps de requête - Register**:
```json
{
  "email": "client@example.com",
  "password": "password123",
  "prenom": "John",
  "nom": "Doe",
  "telephone": "0612345678",
  "adresse_ligne1": "123 Rue Exemple",
  "adresse_ligne2": "Apt 4",
  "code_postal": "75001",
  "ville": "Paris",
  "pays": "France"
}
```

**Corps de requête - Login**:
```json
{
  "email": "client@example.com",
  "password": "password123"
}
```

---

#### **Hébergements** (`/api/hebergements`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/available` | Publique | Récupérer les hébergements disponibles et actifs |
| GET | `/:id` | Publique | Détails d'un hébergement |
| GET | `/type/:typeId` | Publique | Hébergements par type |
| GET | `/` | Admin | Tous les hébergements |
| POST | `/` | Admin | Créer un hébergement |
| PUT | `/:id` | Admin | Modifier un hébergement |
| DELETE | `/:id` | Admin | Supprimer un hébergement |
| PUT | `/:id/deactivate` | Admin | Désactiver un hébergement |
| PUT | `/:id/activate` | Admin | Activer un hébergement |
| PUT | `/:id/reservable` | Admin | Basculer l'état réservable |

**Corps de requête - Create/Update**:
```json
{
  "type_hebergement": 1,
  "reference_interne": "MH-001",
  "nom_commercial": "Mobil-home Premium",
  "description": "Mobil-home tout équipé...",
  "capacite_max": 6,
  "surface_m2": 35,
  "localisation": "Zone A - Emplacement 12",
  "reservable": 1
}
```

---

#### **Types d'hébergement** (`/api/types-hebergement`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/active` | Publique | Types d'hébergement actifs |
| GET | `/:id` | Publique | Détails d'un type |
| GET | `/` | Admin | Tous les types |
| POST | `/` | Admin | Créer un type |
| PUT | `/:id` | Admin | Modifier un type |
| DELETE | `/:id` | Admin | Supprimer un type |
| PUT | `/:id/deactivate` | Admin | Désactiver un type |
| PUT | `/:id/activate` | Admin | Activer un type |

---

#### **Réservations** (`/api/booking`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/my-bookings` | User | Réservations de l'utilisateur connecté |
| DELETE | `/my-bookings/:id_reservation` | User | Annuler une réservation personnelle |
| GET | `/` | Admin | Toutes les réservations |
| POST | `/` | User | Créer une réservation |
| GET | `/:id_reservation` | Admin | Détails d'une réservation |
| PUT | `/:id_reservation` | Admin | Modifier une réservation |
| PATCH | `/:id_reservation/status` | Admin | Modifier le statut d'une réservation |
| DELETE | `/:id_reservation` | Admin | Supprimer une réservation |
| POST | `/:sejour_id/option` | User | Ajouter une option à un séjour |
| DELETE | `/:sejour_id/option` | User | Retirer une option d'un séjour |
| POST | `/:sejour_id/coupon` | User | Appliquer un coupon à un séjour |

**Corps de requête - Create Booking**:
```json
{
  "hebergement_id": 1,
  "arrivee": "2024-07-01",
  "depart": "2024-07-08",
  "adultes": 2,
  "enfants": 1
}
```

---

#### **Paiements** (`/api/payment`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| POST | `/` | Admin | Créer un paiement |
| GET | `/:id_payment` | User | Détails d'un paiement |
| GET | `/reservation/:reservation_id` | User | Paiement par réservation |
| PUT | `/:id_payment` | Admin | Modifier un paiement |
| DELETE | `/:id_payment` | Admin | Supprimer un paiement |

---

#### **Stripe** (`/api/stripe`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| POST | `/create-payment-intent` | User | Créer un PaymentIntent Stripe |

**Corps de requête**:
```json
{
  "amount": 25000
}
```

---

#### **Factures** (`/api/invoice`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| POST | `/` | Admin | Créer une facture |
| GET | `/:id_facture` | User | Détails d'une facture |
| GET | `/reservation/:reservation_id` | User | Facture par réservation |
| PUT | `/:id_facture` | Admin | Modifier une facture |
| DELETE | `/:id_facture` | Admin | Supprimer une facture |

---

#### **Coupons** (`/api/coupons`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/` | Admin | Tous les coupons |
| GET | `/:id_coupon` | Admin | Détails d'un coupon |
| POST | `/` | Admin | Créer un coupon |
| PUT | `/:id_coupon` | Admin | Modifier un coupon |
| DELETE | `/:id_coupon` | Admin | Supprimer un coupon |

---

#### **Options** (`/api/option`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/` | Admin | Toutes les options |
| GET | `/:id_option` | Admin | Détails d'une option |
| POST | `/` | Admin | Créer une option |
| PUT | `/:id_option` | Admin | Modifier une option |
| DELETE | `/:id_option` | Admin | Supprimer une option |

---

#### **Tarifs** (`/api/tarif`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/public` | Publique | Tarifs publics pour consultation |
| POST | `/calculate` | Publique | Calculer le prix d'une réservation |
| GET | `/` | Admin | Tous les tarifs |
| GET | `/:id_tarif` | Admin | Détails d'un tarif |
| POST | `/` | Admin | Créer un tarif |
| PUT | `/:id_tarif` | Admin | Modifier un tarif |
| DELETE | `/:id_tarif` | Admin | Supprimer un tarif |

---

#### **Saisons** (`/api/season`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/` | Admin | Toutes les saisons |
| GET | `/:id_saison` | Admin | Détails d'une saison |
| POST | `/` | Admin | Créer une saison |
| PUT | `/:id_saison` | Admin | Modifier une saison |
| DELETE | `/:id_saison` | Admin | Supprimer une saison |

---

#### **Employés** (`/api/employee`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/` | Admin | Tous les employés |
| GET | `/:id_employee` | Admin | Détails d'un employé |
| POST | `/` | Publique | Créer un employé |
| PUT | `/:id_employee` | Admin | Modifier un employé |
| DELETE | `/:id_employee` | Admin | Supprimer un employé |

---

#### **Rôles** (`/api/roles`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/` | Publique | Tous les rôles |
| GET | `/:id_role` | Publique | Détails d'un rôle |
| POST | `/` | Admin | Créer un rôle |
| PUT | `/:id_role` | Admin | Modifier un rôle |
| DELETE | `/:id_role` | Admin | Supprimer un rôle |

---

#### **Affectations de rôles** (`/api/affectation`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| Routes définies | - | - | CRUD pour les affectations de rôles |

---

#### **Planning employés** (`/api/shift`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| Routes définies | - | - | CRUD pour les plannings |

---

#### **Tickets de support** (`/api/tickets`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/` | Admin | Tous les tickets |
| GET | `/:id_ticket` | Admin | Détails d'un ticket |
| POST | `/` | Publique | Créer un ticket |
| PUT | `/:id_ticket` | Admin | Modifier un ticket |
| DELETE | `/:id_ticket` | Admin | Supprimer un ticket |

---

#### **Logs d'emails** (`/api/log`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| Routes définies | - | - | CRUD pour les logs d'emails |

---

#### **Équipements** (`/api/equipment`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| Routes définies | - | - | CRUD pour les équipements |

---

#### **Équipements par hébergement** (`/api/hebergementEquipement`)

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| Routes définies | - | - | Liaison hébergements-équipements |

---

## 7. Installation et lancement

### Prérequis

- Node.js (version 16+ recommandée)
- MySQL Server installé et configuré
- npm ou yarn
- Base de données MySQL créée

### Étapes d'installation

1. Cloner le projet et naviguer vers le dossier backend:
```bash
cd backend
```

2. Installer les dépendances:
```bash
npm install
```

3. Créer le fichier `.env` à la racine du dossier `backend` en se basant sur l'exemple fourni dans la section 4.

4. Configurer la base de données MySQL (créer la base si nécessaire):
```sql
CREATE DATABASE camping_db;
```

5. Importer le schéma de la base de données (si disponible via un fichier SQL externe).

### Commandes pour lancer le serveur

**Mode développement (avec rechargement automatique)**:
```bash
npm start
```

Le serveur démarrera sur le port défini dans `.env` (par défaut `3000`).

**Test de connexion**:
Accéder à `http://localhost:3000/` pour vérifier le statut de l'API.

Réponse attendue:
```json
{
  "message": "Bienvenue sur l'API du Camping",
  "status": "online"
}
```

## 8. Gestion des erreurs et validation

### Stratégie de gestion des erreurs

L'application utilise deux middlewares globaux pour gérer les erreurs:

1. **Middleware 404** (route non trouvée):
```javascript
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});
```

2. **Middleware d'erreur serveur**:
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur serveur interne' });
});
```

### Validation des données

La validation se fait au niveau des controllers via:
- Vérification de la présence des champs requis
- Validation du format des données (email, dates, etc.)
- Contrôles métier (disponibilité des hébergements, montants cohérents)

Les erreurs de validation retournent des codes HTTP appropriés:
- `400` : Données invalides ou manquantes
- `401` : Authentification requise ou token invalide/expiré
- `403` : Accès refusé (rôle insuffisant)
- `404` : Ressource non trouvée
- `500` : Erreur serveur

## 9. Notes de développement

### Conventions de code

- **Format ES Modules** : `import`/`export` (spécifié dans `package.json` avec `"type": "module"`)
- **Async/Await** : Toutes les opérations asynchrones utilisent `async/await`
- **Nomenclature des fichiers** : camelCase pour les fichiers (ex: `usersController.js`)
- **Structure des exports** :
  - Export par défaut pour les controllers utilisant un objet regroupant les fonctions
  - Export nommé pour les models et middlewares

### Commandes utiles

```bash
# Démarrer le serveur en développement
npm start

# Installer une nouvelle dépendance
npm install <package-name>

# Vérifier les logs de la base de données
# Les logs de connexion apparaissent au démarrage du serveur
```

### Limitations visibles dans le code

1. **Pas de système de migration** : La structure de la base de données doit être créée manuellement
2. **Validation limitée** : Certaines routes pourraient bénéficier d'une validation plus stricte (ex: bibliothèque `joi` ou `express-validator`)
3. **Gestion des erreurs hétérogène** : Certains controllers utilisent `try/catch`, d'autres non
4. **Pas de logging structuré** : Utilisation de `console.log` et `console.error` uniquement
5. **Pas de tests automatisés** : Aucun test unitaire ou d'intégration détecté
6. **Refresh tokens non implémentés** : Le système de refresh token est défini mais pas utilisé dans les routes
7. **Documentation API absente** : Pas d'outil comme Swagger/OpenAPI pour documenter les endpoints

## 10. Améliorations futures

### Propositions réalistes basées sur l'architecture actuelle

1. **Validation des données**
   - Intégrer `express-validator` ou `joi` pour valider les corps de requêtes de manière cohérente sur toutes les routes

2. **Système de migrations**
   - Utiliser `knex` ou `sequelize` pour gérer les migrations de base de données de manière versionnée

3. **Logging structuré**
   - Remplacer `console.log` par une bibliothèque comme `winston` ou `pino` pour des logs structurés et configurables

4. **Tests automatisés**
   - Implémenter des tests unitaires avec `jest` ou `mocha`
   - Ajouter des tests d'intégration pour les endpoints critiques

5. **Documentation automatique de l'API**
   - Intégrer Swagger/OpenAPI avec `swagger-jsdoc` et `swagger-ui-express` pour auto-documenter l'API

6. **Gestion centralisée des erreurs**
   - Créer une classe d'erreur personnalisée et un middleware de gestion des erreurs unifié

7. **Rate limiting**
   - Ajouter `express-rate-limit` pour protéger l'API contre les abus

8. **Pagination**
   - Implémenter la pagination sur les endpoints retournant de nombreux enregistrements (réservations, utilisateurs, etc.)

9. **Caching**
   - Utiliser Redis pour mettre en cache les données fréquemment consultées (types d'hébergements, tarifs publics)

10. **Refresh tokens**
    - Finaliser l'implémentation des refresh tokens pour améliorer la sécurité et l'expérience utilisateur

11. **Webhooks Stripe**
    - Implémenter un endpoint pour recevoir les webhooks Stripe et mettre à jour automatiquement les statuts de paiement

12. **Upload de fichiers**
    - Ajouter la gestion d'upload d'images pour les hébergements (via `multer` et stockage cloud)

13. **Email transactionnel**
    - Intégrer un service d'emailing (SendGrid, Mailgun) pour envoyer des confirmations de réservation et factures

14. **Audit trail**
    - Implémenter un système de logs d'audit pour tracer les modifications sur les données sensibles

15. **Health check endpoint**
    - Créer un endpoint `/health` pour vérifier l'état du serveur et de la base de données
