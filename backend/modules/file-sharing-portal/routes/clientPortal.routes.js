const express = require('express');
const router = express.Router();
const clientPortalController = require('../controllers/clientPortal.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const clientPortalValidator = require('../validators/clientPortal.validator');

// All routes require authentication and client role
router.use(protect);
router.use(authorize('client'));

// Dashboard
router.get('/dashboard', clientPortalController.getClientDashboard);

// Cases
router.get(
    '/cases',
    validate(clientPortalValidator.getCasesValidation),
    clientPortalController.getClientCases
);

router.get(
    '/cases/:id',
    validate(clientPortalValidator.getCaseByIdValidation),
    clientPortalController.getClientCaseById
);

// Documents
router.get(
    '/documents',
    validate(clientPortalValidator.getDocumentsValidation),
    clientPortalController.getClientDocuments
);

// Messages
router.get(
    '/messages',
    validate(clientPortalValidator.getMessagesValidation),
    clientPortalController.getClientMessages
);

router.post(
    '/messages',
    validate(clientPortalValidator.sendMessageValidation),
    clientPortalController.sendClientMessage
);

// Updates/Activity
router.get(
    '/updates',
    validate(clientPortalValidator.getUpdatesValidation),
    clientPortalController.getClientUpdates
);

// Invoices
router.get('/invoices', clientPortalController.getClientInvoices);

// Reports
router.get('/reports', clientPortalController.getClientReports);

// Timeline
router.get(
    '/timeline/:caseId',
    validate(clientPortalValidator.getTimelineValidation),
    clientPortalController.getClientTimeline
);

module.exports = router;
