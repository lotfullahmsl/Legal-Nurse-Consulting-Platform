const { body, query, param } = require('express-validator');

exports.validateBillingStatsQuery = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date'),
    query('caseId')
        .optional()
        .isMongoId()
        .withMessage('Case ID must be a valid MongoDB ObjectId'),
    query('clientId')
        .optional()
        .isMongoId()
        .withMessage('Client ID must be a valid MongoDB ObjectId')
];

exports.validateRevenueReportQuery = [
    query('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date'),
    query('groupBy')
        .optional()
        .isIn(['day', 'week', 'month', 'year'])
        .withMessage('Group by must be one of: day, week, month, year')
];

exports.validateTopCasesQuery = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date')
];

exports.validateCaseId = [
    param('caseId')
        .isMongoId()
        .withMessage('Case ID must be a valid MongoDB ObjectId')
];

exports.validateUserId = [
    param('userId')
        .isMongoId()
        .withMessage('User ID must be a valid MongoDB ObjectId')
];

exports.validateBillingReportQuery = [
    query('caseId')
        .optional()
        .isMongoId()
        .withMessage('Case ID must be a valid MongoDB ObjectId'),
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date')
];
