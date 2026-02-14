const express = require('express');
const router = express.Router();
const lawFirmController = require('../controllers/lawFirm.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../../../shared/middleware/validation.middleware');

// Validation rules
const lawFirmValidation = [
    body('firmName').trim().notEmpty().withMessage('Firm name is required'),
    body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required')
];

// Get all law firms (requires authentication)
router.get('/', protect, lawFirmController.getAllLawFirms);

// Get law firm by ID (requires authentication)
router.get('/:id', protect, lawFirmController.getLawFirmById);

// Create new law firm (admin, attorney)
router.post('/',
    protect,
    authorize('admin', 'attorney'),
    lawFirmValidation,
    validate,
    lawFirmController.createLawFirm
);

// Update law firm (admin, attorney)
router.put('/:id',
    protect,
    authorize('admin', 'attorney'),
    lawFirmController.updateLawFirm
);

// Delete law firm (admin only)
router.delete('/:id',
    protect,
    authorize('admin'),
    lawFirmController.deleteLawFirm
);

module.exports = router;
