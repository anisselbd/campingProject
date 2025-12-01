import express from 'express';
import {getAll, getById, register, login, update, changePassword, remove, desactivate, activate
} from '../controllers/usersController.js';
import { authMiddleware, adminMiddleware, ownerOrAdminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques (sans authentification)
router.post('/register', register);      
router.post('/login', login);            

// Routes protégées (authentification requise)
router.get('/', authMiddleware, adminMiddleware, getAll);                 
router.get('/:id', authMiddleware, ownerOrAdminMiddleware, getById);      
router.put('/:id', authMiddleware, ownerOrAdminMiddleware, update);       
router.put('/:id/password', authMiddleware, ownerOrAdminMiddleware, changePassword);  
router.delete('/:id', authMiddleware, adminMiddleware, remove);

// Routes pr l'admin uniquement
router.put('/:id/deactivate', authMiddleware, adminMiddleware, desactivate);  
router.put('/:id/activate', authMiddleware, adminMiddleware, activate); 

export default router;
