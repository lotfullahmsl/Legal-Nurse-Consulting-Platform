const { body, query, param } = require('express-validator');

exports.getAll = [
    query('conversation').optional().isMongoId().withMessage('Invalid conversation ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.getById = [
    param('id').isMongoId().withMessage('Invalid message ID')
];

exports.getByConversation = [
    param('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.send = [
    body('conversationId').notEmpty().withMessage('Conversation ID is required').isMongoId().withMessage('Invalid conversation ID'),
    body('content').notEmpty().withMessage('Content is required').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),
    body('replyTo').optional().isMongoId().withMessage('Invalid reply-to message ID')
];

exports.edit = [
    param('id').isMongoId().withMessage('Invalid message ID'),
    body('content').notEmpty().withMessage('Content is required').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters')
];

exports.delete = [
    param('id').isMongoId().withMessage('Invalid message ID')
];

exports.markRead = [
    param('id').isMongoId().withMessage('Invalid message ID')
];

exports.markConversationRead = [
    param('conversationId').isMongoId().withMessage('Invalid conversation ID')
];

exports.addAttachment = [
    param('id').isMongoId().withMessage('Invalid message ID'),
    body('filename').notEmpty().withMessage('Filename is required'),
    body('originalName').notEmpty().withMessage('Original name is required'),
    body('mimeType').notEmpty().withMessage('MIME type is required'),
    body('size').isInt({ min: 0 }).withMessage('Size must be a positive integer'),
    body('path').notEmpty().withMessage('Path is required')
];
