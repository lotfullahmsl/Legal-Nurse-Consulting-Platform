const { body, param, query } = require('express-validator');

/**
 * Workflow Validators
 */

exports.createWorkflowValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Workflow name is required')
        .isLength({ min: 3, max: 200 }).withMessage('Name must be between 3 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

    body('type')
        .notEmpty().withMessage('Workflow type is required')
        .isIn(['case-intake', 'medical-review', 'case-analysis', 'case-closure', 'general']).withMessage('Invalid workflow type'),

    body('isTemplate')
        .optional()
        .isBoolean().withMessage('isTemplate must be a boolean'),

    body('triggerEvent')
        .optional()
        .isIn(['case_created', 'records_received', 'case_closing', 'manual', 'milestone_reached']).withMessage('Invalid trigger event'),

    body('steps')
        .isArray({ min: 1 }).withMessage('Workflow must have at least one step'),

    body('steps.*.title')
        .trim()
        .notEmpty().withMessage('Step title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Step title must be between 3 and 200 characters'),

    body('steps.*.description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Step description cannot exceed 1000 characters'),

    body('steps.*.taskType')
        .optional()
        .isIn(['general', 'review', 'analysis', 'communication', 'administrative', 'billing', 'legal', 'medical', 'document-request', 'indexing', 'processing', 'timeline']).withMessage('Invalid task type'),

    body('steps.*.priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),

    body('steps.*.daysToComplete')
        .optional()
        .isInt({ min: 1, max: 365 }).withMessage('Days to complete must be between 1 and 365'),

    body('steps.*.autoAssign')
        .optional()
        .isBoolean().withMessage('autoAssign must be a boolean'),

    body('steps.*.assignToRole')
        .optional()
        .isIn(['admin', 'attorney', 'consultant', 'client']).withMessage('Invalid role')
];

exports.updateWorkflowValidator = [
    param('id')
        .isMongoId().withMessage('Invalid workflow ID'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('Name must be between 3 and 200 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

    body('type')
        .optional()
        .isIn(['case-intake', 'medical-review', 'case-analysis', 'case-closure', 'general']).withMessage('Invalid workflow type'),

    body('isTemplate')
        .optional()
        .isBoolean().withMessage('isTemplate must be a boolean'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),

    body('triggerEvent')
        .optional()
        .isIn(['case_created', 'records_received', 'case_closing', 'manual', 'milestone_reached']).withMessage('Invalid trigger event'),

    body('steps')
        .optional()
        .isArray({ min: 1 }).withMessage('Workflow must have at least one step')
];

exports.executeWorkflowValidator = [
    param('id')
        .isMongoId().withMessage('Invalid workflow ID'),

    body('caseId')
        .notEmpty().withMessage('Case ID is required')
        .isMongoId().withMessage('Invalid case ID')
];

exports.getWorkflowsValidator = [
    query('type')
        .optional()
        .isIn(['case-intake', 'medical-review', 'case-analysis', 'case-closure', 'general']).withMessage('Invalid workflow type'),

    query('isTemplate')
        .optional()
        .isIn(['true', 'false']).withMessage('isTemplate must be true or false'),

    query('isActive')
        .optional()
        .isIn(['true', 'false']).withMessage('isActive must be true or false')
];

exports.getWorkflowByIdValidator = [
    param('id')
        .isMongoId().withMessage('Invalid workflow ID')
];

exports.cloneWorkflowValidator = [
    param('id')
        .isMongoId().withMessage('Invalid workflow ID')
];

module.exports = exports;
