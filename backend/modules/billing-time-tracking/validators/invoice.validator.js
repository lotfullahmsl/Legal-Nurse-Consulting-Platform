const { body, param, query } = require('express-validator');

const invoiceValidators = {
    generate: [
        body('caseId')
            .notEmpty().withMessage('Case ID is required')
            .isMongoId().withMessage('Invalid case ID'),
        body('timeEntryIds')
            .optional()
            .isArray().withMessage('Time entries must be an array'),
        body('timeEntryIds.*')
            .optional()
            .isMongoId().withMessage('Invalid time entry ID'),
        body('lineItems')
            .optional()
            .isArray().withMessage('Line items must be an array'),
        body('lineItems.*.description')
            .optional()
            .notEmpty().withMessage('Line item description is required'),
        body('lineItems.*.amount')
            .optional()
            .isFloat({ min: 0 }).withMessage('Line item amount must be positive'),
        body('dueDate')
            .optional()
            .isISO8601().withMessage('Invalid due date format'),
        body('notes')
            .optional()
            .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
        body('discount')
            .optional()
            .isFloat({ min: 0 }).withMessage('Discount amount must be a positive number'),
        body('taxRate')
            .optional()
            .isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0 and 100')
    ],

    update: [
        param('id')
            .isMongoId().withMessage('Invalid invoice ID'),
        body('dueDate')
            .optional()
            .isISO8601().withMessage('Invalid due date format'),
        body('notes')
            .optional()
            .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
        body('discountAmount')
            .optional()
            .isFloat({ min: 0 }).withMessage('Discount amount must be a positive number'),
        body('discountPercentage')
            .optional()
            .isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100'),
        body('status')
            .optional()
            .isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled', 'void'])
            .withMessage('Invalid invoice status')
    ],

    recordPayment: [
        param('id')
            .isMongoId().withMessage('Invalid invoice ID'),
        body('amount')
            .notEmpty().withMessage('Payment amount is required')
            .isFloat({ min: 0 }).withMessage('Payment amount must be a positive number'),
        body('paymentDate')
            .optional()
            .isISO8601().withMessage('Invalid payment date format'),
        body('paymentMethod')
            .optional()
            .isIn(['check', 'wire', 'credit_card', 'ach', 'cash', 'other'])
            .withMessage('Invalid payment method'),
        body('transactionId')
            .optional()
            .isLength({ max: 100 }).withMessage('Transaction ID cannot exceed 100 characters'),
        body('notes')
            .optional()
            .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
    ],

    send: [
        param('id')
            .isMongoId().withMessage('Invalid invoice ID'),
        body('recipientEmail')
            .notEmpty().withMessage('Recipient email is required')
            .isEmail().withMessage('Invalid email format'),
        body('ccEmails')
            .optional()
            .isArray().withMessage('CC emails must be an array'),
        body('ccEmails.*')
            .isEmail().withMessage('Invalid email format in CC list'),
        body('message')
            .optional()
            .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
    ],

    void: [
        param('id')
            .isMongoId().withMessage('Invalid invoice ID'),
        body('reason')
            .notEmpty().withMessage('Void reason is required')
            .isLength({ min: 10, max: 500 }).withMessage('Reason must be 10-500 characters')
    ],

    getById: [
        param('id')
            .isMongoId().withMessage('Invalid invoice ID')
    ],

    delete: [
        param('id')
            .isMongoId().withMessage('Invalid invoice ID')
    ],

    getByCase: [
        param('caseId')
            .isMongoId().withMessage('Invalid case ID')
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
        query('lawFirm')
            .optional()
            .isMongoId().withMessage('Invalid law firm ID'),
        query('status')
            .optional()
            .isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled', 'void'])
            .withMessage('Invalid invoice status'),
        query('startDate')
            .optional()
            .isISO8601().withMessage('Invalid start date format'),
        query('endDate')
            .optional()
            .isISO8601().withMessage('Invalid end date format')
    ]
};

module.exports = invoiceValidators;
