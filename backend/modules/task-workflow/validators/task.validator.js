const { body, param, query } = require('express-validator');

/**
 * Task Validators
 */

exports.createTaskValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Task title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

    body('case')
        .notEmpty().withMessage('Case ID is required')
        .isMongoId().withMessage('Invalid case ID'),

    body('assignedTo')
        .notEmpty().withMessage('Assigned user is required')
        .isMongoId().withMessage('Invalid user ID'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),

    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status value'),

    body('type')
        .optional()
        .isIn(['general', 'review', 'analysis', 'communication', 'administrative', 'billing', 'legal', 'medical', 'document-request', 'indexing', 'processing', 'timeline']).withMessage('Invalid task type'),

    body('dueDate')
        .optional()
        .isISO8601().withMessage('Invalid due date format')
        .custom((value) => {
            const date = new Date(value);
            if (date < new Date()) {
                throw new Error('Due date cannot be in the past');
            }
            return true;
        }),

    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),

    body('isRecurring')
        .optional()
        .isBoolean().withMessage('isRecurring must be a boolean'),

    body('recurringPattern')
        .optional()
        .isObject().withMessage('Recurring pattern must be an object'),

    body('recurringPattern.frequency')
        .optional()
        .isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid frequency')
];

exports.updateTaskValidator = [
    param('id')
        .isMongoId().withMessage('Invalid task ID'),

    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

    body('assignedTo')
        .optional()
        .isMongoId().withMessage('Invalid user ID'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),

    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status value'),

    body('type')
        .optional()
        .isIn(['general', 'review', 'analysis', 'communication', 'administrative', 'billing', 'legal', 'medical', 'document-request', 'indexing', 'processing', 'timeline']).withMessage('Invalid task type'),

    body('dueDate')
        .optional()
        .isISO8601().withMessage('Invalid due date format')
];

exports.updateTaskStatusValidator = [
    param('id')
        .isMongoId().withMessage('Invalid task ID'),

    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status value')
];

exports.assignTaskValidator = [
    param('id')
        .isMongoId().withMessage('Invalid task ID'),

    body('assignedTo')
        .notEmpty().withMessage('Assigned user is required')
        .isMongoId().withMessage('Invalid user ID')
];

exports.addCommentValidator = [
    param('id')
        .isMongoId().withMessage('Invalid task ID'),

    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
];

exports.getTasksValidator = [
    query('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status value'),

    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),

    query('assignedTo')
        .optional()
        .isMongoId().withMessage('Invalid user ID'),

    query('case')
        .optional()
        .isMongoId().withMessage('Invalid case ID'),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.getTaskByIdValidator = [
    param('id')
        .isMongoId().withMessage('Invalid task ID')
];

exports.getTasksByCaseValidator = [
    param('caseId')
        .isMongoId().withMessage('Invalid case ID')
];

module.exports = exports;
