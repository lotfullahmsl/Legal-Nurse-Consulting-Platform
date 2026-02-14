const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../../../shared/middleware/validation.middleware');

// Validation rules
const clientValidation = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required')
];

// Get all clients (requires authentication)
router.get('/', protect, clientController.getAllClients);

// Get client statistics (requires authentication)
router.get('/stats', protect, clientController.getClientStats);

// Get client by ID (requires authentication)
router.get('/:id', protect, clientController.getClientById);

// Create new client (admin, attorney, consultant)
router.post('/',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    clientValidation,
    validate,
    clientController.createClient
);

// Update client (admin, attorney, consultant)
router.put('/:id',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    clientController.updateClient
);

// Delete client (admin only)
router.delete('/:id',
    protect,
    authorize('admin'),
    clientController.deleteClient
);

module.exports = router;
