import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { testConnection } from './config/bdd.js';
import usersRoutes from './routes/usersRoutes.js';
import hebergementsRoutes from './routes/hebergementsRoutes.js';
import typesHebergementRoutes from './routes/typesHebergementRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import optionRoutes from './routes/optionRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import rolesRoutes from "./routes/rolesRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import seasonRoutes from './routes/seasonRoutes.js';
import tarifRoutes from './routes/tarifRoutes.js';
import emailLogsRoutes from "./routes/emailLogsRoutes.js";
import roleAffectationsRoutes from "./routes/roleAffectationsRoutes.js";
import equipmentsRoutes from "./routes/equipmentsRoutes.js";
import hebergementEquipementsRoutes from "./routes/hebergementEquipementsRoutes.js";
import employeeShiftsRoutes from "./routes/employeeShiftsRoutes.js";

// // Charger les variables d'environnement
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
app.use('/api/booking', bookingRoutes);
app.use('/api/option', optionRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/invoice', invoiceRoutes)
app.use('/api/payment', paymentRoutes);
app.use("/api/shift", employeeShiftsRoutes);
app.use('/api/stripe', stripeRoutes);



// Gestion des erreurs
app.use("/api/roles", rolesRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/season', seasonRoutes);
app.use('/api/tarif', tarifRoutes);

app.use("/api/log", emailLogsRoutes);
app.use("/api/affectation", roleAffectationsRoutes);
app.use("/api/equipment", equipmentsRoutes);
app.use("/api/hebergementEquipement", hebergementEquipementsRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur serveur interne' });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});