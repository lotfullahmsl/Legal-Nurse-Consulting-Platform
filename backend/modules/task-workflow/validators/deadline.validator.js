const { body, param, query } = require('express-validator');

/**
 * Deadline Validators
 */

exports.createDeadlineValidator = [
    body('case')
        .notEmpty().withMessage('Case ID is required')
        .isMongoId().withMessage('Invalid case ID'),

    body('title')
        .trim()
        .notEmpty().withMessage('Deadline title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

    body('type')
        .notEmpty().withMessage('Deadline type is required')
        .isIn([
            'statute-of-limitations',
            'court-date',
            'discovery',
            'filing',
            'response',
            'expert-disclosure',
            'motions',
            'settlement',
            'trial',
            'appeal',
            'general'
        ]).withMessage('Invalid deadline type'),

    body('deadlineDate')
        .notEmpty().withMessage('Deadline date is required')
        .isISO8601().withMessage('Invalid deadline date format')
        .custom((value) => {
            const date = new Date(value);
            if (date < new Date()) {
                throw new Error('Deadline date cannot be in the past');
            }
            return true;
        }),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),

    body('assignedTo')
        .optional()
        .isMongoId().withMessage('Invalid user ID'),

    body('reminderDates')
        .optional()
        .isArray().withMessage('Reminder dates must be an array'),

    body('reminderDates.*')
        .optional()
        .isISO8601().withMessage('Invalid reminder date format'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),

    body('relatedTask')
        .optional()
        .isMongoId().withMessage('Invalid task ID')
];

exports.updateDeadlineValidator = [
    param('id')
        .isMongoId().withMessage('Invalid deadline ID'),

    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

    body('type')
        .optional()
        .isIn([
            'statute-of-limitations',
            'court-date',
            'discovery',
            'filing',
            'response',
            'expert-disclosure',
            'motions',
            'settlement',
            'trial',
            'appeal',
            'general'
        ]).withMessage('Invalid deadline type'),

    body('deadlineDate')
        .optional()
        .isISO8601().withMessage('Invalid deadline date format'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority value'),

    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status value'),

    body('assignedTo')
        .optional()
        .isMongoId().withMessage('Invalid user ID'),

    body('reminderDates')
        .optional()
        .isArray().withMessage('Reminder dates must be an array'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),

    body('relatedTask')
        .optional()
        .isMongoId().withMessage('Invalid task ID')
];

exports.getDeadlinesValidator = [
    query('type')
        .optional()
        .isIn([
            'statute-of-limitations',
            'court-date',
            'discovery',
            'filing',
            'response',
            'expert-disclosure',
            'motions',
            'settlement',
            'trial',
            'appeal',
            'general'
        ]).withMessage('Invalid deadline type'),

    query('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status value'),

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

exports.getUpcomingDeadlinesValidator = [
    query('days')
        .optional()
        .isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365')
];

exports.getDeadlineByIdValidator = [
    param('id')
        .isMongoId().withMessage('Invalid deadline ID')
];

exports.getDeadlinesByCaseValidator = [
    param('caseId')
        .isMongoId().withMessage('Invalid case ID')
];

module.exports = exports;
