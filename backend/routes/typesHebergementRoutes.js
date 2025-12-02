import express from 'express';
import {
    getAll,
    getActive,
    getById,
    create,
    update,
    remove,
    deactivate,
    activate
} from '../controllers/typesHebergementController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.get('/active', getActive);       
router.get('/:id', getById);            

// Routes protégées (admin uniquement)
router.get('/', authMiddleware, adminMiddleware, getAll);                    
router.post('/', authMiddleware, adminMiddleware, create);                   
router.put('/:id', authMiddleware, adminMiddleware, update);                 
router.delete('/:id', authMiddleware, adminMiddleware, remove);              
router.put('/:id/deactivate', authMiddleware, adminMiddleware, deactivate);  
router.put('/:id/activate', authMiddleware, adminMiddleware, activate);      

export default router;
