import express from 'express';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware.js';
import invoiceController from '../controllers/invoiceController.js';

const router = express.Router();

// Rotta 1: POST - Creazione Fattura (Solo Admin)
// Endpoint: /api/invoice
router.post('/', [authMiddleware, adminMiddleware], invoiceController.createInvoice);


// Rotta 2: GET - Visualizza Fattura per ID Fattura (Admin o Utente Autenticato)
// Nota: La logica del Controller dovrà verificare se l'utente è Admin o se l'ID corrisponde alla sua prenotazione.
// Endpoint: /api/invoice/:id_facture
router.get('/:id_facture', [authMiddleware], invoiceController.getInvoiceById);


// Rotta 3: GET - Visualizza Fattura per ID Prenotazione (Utente Autenticato)
// Endpoint: /api/invoice/reservation/:reservation_id
router.get('/reservation/:reservation_id', [authMiddleware], invoiceController.getInvoiceByReservationId);


// Rotta 4: PUT - Modifica Fattura (Solo Admin)
// Endpoint: /api/invoice/:id_facture
router.put('/:id_facture', [authMiddleware, adminMiddleware], invoiceController.updateInvoice);


// Rotta 5: DELETE - Elimina Fattura (Solo Admin)
// Endpoint: /api/invoice/:id_facture
router.delete('/:id_facture', [authMiddleware, adminMiddleware], invoiceController.deleteInvoice);


export default router;
