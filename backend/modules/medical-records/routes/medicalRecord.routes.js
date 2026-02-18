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
    body('fileSize').isNumeric().withMessage('File size must be a number')
    // fileUrl is optional when using fileData (base64 storage)
];

// Get all records
router.get('/', protect, medicalRecordController.getAllRecords);

// Get statistics
router.get('/stats', protect, medicalRecordController.getStats);

// Get records by case
router.get('/case/:caseId', protect, medicalRecordController.getRecordsByCase);

// Get record by ID
router.get('/:id', protect, medicalRecordController.getRecordById);

// Get OCR text for a record
router.get('/:id/ocr-text', protect, async (req, res, next) => {
    try {
        const MedicalRecord = require('../../../models/MedicalRecord.model');
        const record = await MedicalRecord.findById(req.params.id);

        if (!record || record.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Medical record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ocrText: record.ocrText || 'No OCR text available',
                ocrStatus: record.ocrStatus,
                ocrProcessedAt: record.ocrProcessedAt
            }
        });
    } catch (error) {
        next(error);
    }
});

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
