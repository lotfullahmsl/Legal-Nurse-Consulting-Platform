const { body, param, query } = require('express-validator');

const timeEntryValidators = {
    create: [
        body('case')
            .notEmpty().withMessage('Case ID is required')
            .isMongoId().withMessage('Invalid case ID'),
        body('user')
            .optional()
            .isMongoId().withMessage('Invalid user ID'),
        body('description')
            .notEmpty().withMessage('Description is required')
            .isLength({ min: 3, max: 500 }).withMessage('Description must be 3-500 characters'),
        body('activityType')
            .notEmpty().withMessage('Activity type is required')
            .isIn(['Medical Record Review', 'Timeline Creation', 'Report Writing', 'Client Communication', 'Research', 'Expert Consultation', 'Court Preparation', 'Administrative', 'Other'])
            .withMessage('Invalid activity type'),
        body('duration')
            .optional()
            .isFloat({ min: 0 }).withMessage('Duration must be a positive number'),
        body('startTime')
            .optional()
            .isISO8601().withMessage('Invalid start time format'),
        body('endTime')
            .optional()
            .isISO8601().withMessage('Invalid end time format'),
        body('billableRate')
            .notEmpty().withMessage('Billable rate is required')
            .isFloat({ min: 0 }).withMessage('Billable rate must be a positive number'),
        body('isBillable')
            .optional()
            .isBoolean().withMessage('isBillable must be a boolean'),
        body('notes')
            .optional()
            .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
    ],

    update: [
        param('id')
            .isMongoId().withMessage('Invalid time entry ID'),
        body('description')
            .optional()
            .isLength({ min: 3, max: 500 }).withMessage('Description must be 3-500 characters'),
        body('activityType')
            .optional()
            .isIn(['Medical Record Review', 'Timeline Creation', 'Report Writing', 'Client Communication', 'Research', 'Expert Consultation', 'Court Preparation', 'Administrative', 'Other'])
            .withMessage('Invalid activity type'),
        body('duration')
            .optional()
            .isFloat({ min: 0 }).withMessage('Duration must be a positive number'),
        body('billableRate')
            .optional()
            .isFloat({ min: 0 }).withMessage('Billable rate must be a positive number'),
        body('isBillable')
            .optional()
            .isBoolean().withMessage('isBillable must be a boolean'),
        body('notes')
            .optional()
            .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
    ],

    startTimer: [
        body('case')
            .notEmpty().withMessage('Case ID is required')
            .isMongoId().withMessage('Invalid case ID'),
        body('description')
            .notEmpty().withMessage('Description is required')
            .isLength({ min: 3, max: 500 }).withMessage('Description must be 3-500 characters'),
        body('activityType')
            .optional()
            .isIn(['Medical Record Review', 'Timeline Creation', 'Report Writing', 'Client Communication', 'Research', 'Expert Consultation', 'Court Preparation', 'Administrative', 'Other'])
            .withMessage('Invalid activity type'),
        body('billableRate')
            .notEmpty().withMessage('Billable rate is required')
            .isFloat({ min: 0 }).withMessage('Billable rate must be a positive number')
    ],

    bulkCreate: [
        body('entries')
            .isArray({ min: 1 }).withMessage('Entries must be a non-empty array'),
        body('entries.*.case')
            .notEmpty().withMessage('Case ID is required for each entry')
            .isMongoId().withMessage('Invalid case ID'),
        body('entries.*.description')
            .notEmpty().withMessage('Description is required for each entry'),
        body('entries.*.duration')
            .notEmpty().withMessage('Duration is required for each entry')
            .isFloat({ min: 0 }).withMessage('Duration must be a positive number'),
        body('entries.*.billableRate')
            .notEmpty().withMessage('Billable rate is required for each entry')
            .isFloat({ min: 0 }).withMessage('Billable rate must be a positive number')
    ],

    getById: [
        param('id')
            .isMongoId().withMessage('Invalid time entry ID')
    ],

    delete: [
        param('id')
            .isMongoId().withMessage('Invalid time entry ID')
    ],

    getByCase: [
        param('caseId')
            .isMongoId().withMessage('Invalid case ID'),
        query('startDate')
            .optional()
            .isISO8601().withMessage('Invalid start date format'),
        query('endDate')
            .optional()
            .isISO8601().withMessage('Invalid end date format')
    ],

    getByUser: [
        param('userId')
            .isMongoId().withMessage('Invalid user ID'),
        query('startDate')
            .optional()
            .isISO8601().withMessage('Invalid start date format'),
        query('endDate')
            .optional()
            .isISO8601().withMessage('Invalid end date format')
    ],

    getAll: [
        query('page')
            .optional()
            .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
        query('case')
            .optional()
            .isMongoId().withMessage('Invalid case ID'),
        query('user')
            .optional()
            .isMongoId().withMessage('Invalid user ID'),
        query('isBillable')
            .optional()
            .isBoolean().withMessage('isBillable must be a boolean'),
        query('startDate')
            .optional()
            .isISO8601().withMessage('Invalid start date format'),
        query('endDate')
            .optional()
            .isISO8601().withMessage('Invalid end date format')
    ]
};

module.exports = timeEntryValidators;
