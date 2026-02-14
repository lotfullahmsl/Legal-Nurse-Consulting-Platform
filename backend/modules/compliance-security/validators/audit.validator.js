const { query, param, body } = require('express-validator');

exports.getAuditLogsValidation = [
    query('userId').optional().isMongoId().withMessage('Invalid user ID'),
    query('caseId').optional().isMongoId().withMessage('Invalid case ID'),
    query('action').optional().isString().withMessage('Action must be a string'),
    query('resource').optional().isString().withMessage('Resource must be a string'),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.getUserAuditLogsValidation = [
    param('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid user ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.getCaseAuditLogsValidation = [
    param('caseId').notEmpty().withMessage('Case ID is required').isMongoId().withMessage('Invalid case ID'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

exports.exportAuditLogsValidation = [
    query('userId').optional().isMongoId().withMessage('Invalid user ID'),
    query('caseId').optional().isMongoId().withMessage('Invalid case ID'),
    query('action').optional().isString().withMessage('Action must be a string'),
    query('resource').optional().isString().withMessage('Resource must be a string'),
    query('startDate').optional().isISO8601().withMessage('Invalid start date'),
    query('endDate').optional().isISO8601().withMessage('Invalid end date')
];

exports.generateComplianceReportValidation = [
    body('startDate').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Invalid start date'),
    body('endDate').notEmpty().withMessage('End date is required').isISO8601().withMessage('Invalid end date')
];

exports.getAuditStatisticsValidation = [
    query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365')
];
