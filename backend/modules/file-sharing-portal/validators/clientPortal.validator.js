const { body, param, query } = require('express-validator');

exports.sendMessageValidation = [
    body('conversationId')
        .notEmpty()
        .withMessage('Conversation ID is required')
        .isMongoId()
        .withMessage('Invalid conversation ID'),
    body('content')
        .notEmpty()
        .withMessage('Message content is required')
        .isString()
        .withMessage('Content must be a string')
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Content must be between 1 and 5000 characters'),
    body('attachments')
        .optional()
        .isArray()
        .withMessage('Attachments must be an array')
];

exports.getCaseByIdValidation = [
    param('id')
        .notEmpty()
        .withMessage('Case ID is required')
        .isMongoId()
        .withMessage('Invalid case ID')
];

exports.getTimelineValidation = [
    param('caseId')
        .notEmpty()
        .withMessage('Case ID is required')
        .isMongoId()
        .withMessage('Invalid case ID')
];

exports.getDocumentsValidation = [
    query('caseId')
        .optional()
        .isMongoId()
        .withMessage('Invalid case ID'),
    query('fileType')
        .optional()
        .isString()
        .withMessage('File type must be a string')
];

exports.getMessagesValidation = [
    query('caseId')
        .optional()
        .isMongoId()
        .withMessage('Invalid case ID')
];

exports.getCasesValidation = [
    query('status')
        .optional()
        .isString()
        .withMessage('Status must be a string')
        .isIn(['Open', 'In Progress', 'Under Review', 'Closed', 'On Hold'])
        .withMessage('Invalid status value')
];

exports.getUpdatesValidation = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];
