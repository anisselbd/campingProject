import express from 'express';
import optionController from '../controllers/optionController.js';

import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 1. READ ALL (GET /api/option)
router.get('/', [authMiddleware, adminMiddleware], optionController.getAllOptions);

// 2. CREATE (POST /api/option)
router.post('/', [authMiddleware, adminMiddleware], optionController.createOption);

// 3. READ ONE (GET /api/option/:id_option)
router.get('/:id_option', [authMiddleware, adminMiddleware], optionController.getOptionById);

// 4. UPDATE (PUT /api/option/:id_option)
router.put('/:id_option', [authMiddleware, adminMiddleware], optionController.updateOption);

// 5. DELETE (DELETE /api/option/:id_option)
router.delete('/:id_option', [authMiddleware, adminMiddleware], optionController.deleteOption);

export default router;