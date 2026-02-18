const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecord.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../../../shared/middleware/validation.middleware');

// Validation rules
const uploadValidation = [
    body('case').notEmpty().withMessage('Case ID is required'),
    body('fileName').notEmpty().withMessage('File name is required'),
    body('fileType').isIn(['pdf', 'image', 'doc', 'other']).withMessage('Valid file type is required'),
    body('fileUrl').notEmpty().withMessage('File URL is required'),
    body('fileSize').isNumeric().withMessage('File size must be a number')
];

// Get all records
router.get('/', protect, medicalRecordController.getAllRecords);

// Get statistics
router.get('/stats', protect, medicalRecordController.getStats);

// Get records by case
router.get('/case/:caseId', protect, medicalRecordController.getRecordsByCase);

// Get record by ID
router.get('/:id', protect, medicalRecordController.getRecordById);

// Download record file
router.get('/:id/download', protect, medicalRecordController.downloadRecord);

// Upload record
router.post('/upload',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    uploadValidation,
    validate,
    medicalRecordController.uploadRecord
);

// Update record
router.put('/:id',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    medicalRecordController.updateRecord
);

// Delete record
router.delete('/:id',
    protect,
    authorize('admin'),
    medicalRecordController.deleteRecord
);

// Trigger OCR
router.post('/:id/ocr',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    medicalRecordController.triggerOCR
);

module.exports = router;
