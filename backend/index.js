import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { testConnection } from './config/bdd.js';
import usersRoutes from './routes/usersRoutes.js';
import hebergementsRoutes from './routes/hebergementsRoutes.js';
import typesHebergementRoutes from './routes/typesHebergementRoutes.js';
import employeeRoutes from "./routes/employeeRoutes.js";

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


testConnection();

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API du Camping',
        status: 'online'
    });
});

// Routes API
app.use('/api/users', usersRoutes);
app.use('/api/hebergements', hebergementsRoutes);
app.use('/api/types-hebergement', typesHebergementRoutes);
app.use('/api/employee', employeeRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur serveur interne' });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur le port ${port}`);
});