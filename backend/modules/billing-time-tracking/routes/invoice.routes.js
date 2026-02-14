const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const invoiceValidators = require('../validators/invoice.validator');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

router.use(protect);

router.get('/', validate(invoiceValidators.getAll), auditLog('view_invoices'), invoiceController.getAllInvoices);
router.get('/stats', auditLog('view_billing_stats'), invoiceController.getBillingStats);
router.get('/case/:caseId', validate(invoiceValidators.getByCase), auditLog('view_case_invoices'), invoiceController.getInvoicesByCase);
router.get('/:id', validate(invoiceValidators.getById), auditLog('view_invoice'), invoiceController.getInvoiceById);

router.post('/generate', authorize('admin', 'attorney'), validate(invoiceValidators.generate), auditLog('generate_invoice'), invoiceController.generateInvoice);
router.put('/:id', authorize('admin', 'attorney'), validate(invoiceValidators.update), auditLog('update_invoice'), invoiceController.updateInvoice);
router.post('/:id/send', authorize('admin', 'attorney'), validate(invoiceValidators.send), auditLog('send_invoice'), invoiceController.sendInvoice);
router.post('/:id/payment', authorize('admin', 'attorney'), validate(invoiceValidators.recordPayment), auditLog('record_payment'), invoiceController.recordPayment);
router.post('/:id/void', authorize('admin', 'attorney'), validate(invoiceValidators.void), auditLog('void_invoice'), invoiceController.voidInvoice);

module.exports = router;
