const { body, query, param } = require('express-validator');

exports.getAll = [
    query('type').optional().isIn(['direct', 'group', 'case']).withMessage('Invalid conversation type'),
    query('case').optional().isMongoId().withMessage('Invalid case ID'),
    query('isArchived').optional().isBoolean(),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.getById = [
    param('id').isMongoId().withMessage('Invalid conversation ID')
];

exports.create = [
    body('type').notEmpty().withMessage('Type is required').isIn(['direct', 'group', 'case']).withMessage('Invalid conversation type'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('participants').isArray({ min: 1 }).withMessage('At least one participant is required'),
    body('participants.*').isMongoId().withMessage('Invalid participant user ID'),
    body('caseId').optional().isMongoId().withMessage('Invalid case ID')
];

exports.update = [
    param('id').isMongoId().withMessage('Invalid conversation ID'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
];

exports.addParticipants = [
    param('id').isMongoId().withMessage('Invalid conversation ID'),
    body('participants').isArray({ min: 1 }).withMessage('At least one participant is required'),
    body('participants.*').isMongoId().withMessage('Invalid participant user ID')
];

exports.removeParticipant = [
    param('id').isMongoId().withMessage('Invalid conversation ID'),
    param('participantId').isMongoId().withMessage('Invalid participant ID')
];
