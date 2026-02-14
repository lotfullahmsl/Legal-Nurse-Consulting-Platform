const { body, query, param } = require('express-validator');

exports.getAll = [
    query('case').optional().isMongoId().withMessage('Invalid case ID'),
    query('type').optional().isIn(['general', 'medical', 'legal', 'administrative', 'research', 'communication']).withMessage('Invalid note type'),
    query('tags').optional().isString(),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.getById = [
    param('id').isMongoId().withMessage('Invalid note ID')
];

exports.getByCase = [
    param('caseId').isMongoId().withMessage('Invalid case ID'),
    query('type').optional().isIn(['general', 'medical', 'legal', 'administrative', 'research', 'communication']),
    query('isPinned').optional().isBoolean()
];

exports.create = [
    body('case').notEmpty().withMessage('Case is required').isMongoId().withMessage('Invalid case ID'),
    body('title').notEmpty().withMessage('Title is required').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('content').notEmpty().withMessage('Content is required'),
    body('type').optional().isIn(['general', 'medical', 'legal', 'administrative', 'research', 'communication']).withMessage('Invalid note type'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('tags.*').optional().isString().trim(),
    body('mentions').optional().isArray().withMessage('Mentions must be an array'),
    body('mentions.*').optional().isMongoId().withMessage('Invalid user ID in mentions'),
    body('isPrivate').optional().isBoolean(),
    body('isPinned').optional().isBoolean()
];

exports.update = [
    param('id').isMongoId().withMessage('Invalid note ID'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('type').optional().isIn(['general', 'medical', 'legal', 'administrative', 'research', 'communication']).withMessage('Invalid note type'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('mentions').optional().isArray().withMessage('Mentions must be an array'),
    body('isPrivate').optional().isBoolean(),
    body('isPinned').optional().isBoolean()
];

exports.delete = [
    param('id').isMongoId().withMessage('Invalid note ID')
];

exports.addAttachment = [
    param('id').isMongoId().withMessage('Invalid note ID'),
    body('filename').notEmpty().withMessage('Filename is required'),
    body('originalName').notEmpty().withMessage('Original name is required'),
    body('mimeType').notEmpty().withMessage('MIME type is required'),
    body('size').isInt({ min: 0 }).withMessage('Size must be a positive integer'),
    body('path').notEmpty().withMessage('Path is required')
];

exports.manageTags = [
    param('id').isMongoId().withMessage('Invalid note ID'),
    body('tags').isArray({ min: 1 }).withMessage('Tags array is required'),
    body('tags.*').isString().trim()
];

exports.search = [
    query('q').notEmpty().withMessage('Search query is required'),
    query('case').optional().isMongoId().withMessage('Invalid case ID'),
    query('type').optional().isIn(['general', 'medical', 'legal', 'administrative', 'research', 'communication']),
    query('tags').optional().isString()
];
