import express from 'express';
import {
    getAll,
    getAvailable,
    getById,
    getByType,
    create,
    update,
    remove,
    deactivate,
    activate,
    toggleReservable
} from '../controllers/hebergementsController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.get('/available', getAvailable);          
router.get('/:id', getById);                     
router.get('/type/:typeId', getByType);     
     
// Routes protégées (admin uniquement)
router.get('/', authMiddleware, adminMiddleware, getAll);                     
router.post('/', authMiddleware, adminMiddleware, create);                     
router.put('/:id', authMiddleware, adminMiddleware, update);                   
router.delete('/:id', authMiddleware, adminMiddleware, remove);                
router.put('/:id/deactivate', authMiddleware, adminMiddleware, deactivate);    
router.put('/:id/activate', authMiddleware, adminMiddleware, activate);        
router.put('/:id/reservable', authMiddleware, adminMiddleware, toggleReservable); 

export default router;
