const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflow.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const workflowValidator = require('../validators/workflow.validator');

// All routes require authentication
router.use(protect);

// Workflow routes
router.get('/', auditLog('view_workflows'), workflowValidator.getWorkflowsValidator, validate, workflowController.getAllWorkflows);
router.get('/templates', auditLog('view_workflow_templates'), workflowController.getWorkflowTemplates);
router.get('/:id', auditLog('view_workflow'), workflowValidator.getWorkflowByIdValidator, validate, workflowController.getWorkflowById);

router.post('/', authorize('admin', 'attorney'), auditLog('create_workflow'), workflowValidator.createWorkflowValidator, validate, workflowController.createWorkflow);
router.put('/:id', authorize('admin', 'attorney'), auditLog('update_workflow'), workflowValidator.updateWorkflowValidator, validate, workflowController.updateWorkflow);
router.delete('/:id', authorize('admin', 'attorney'), auditLog('delete_workflow'), workflowValidator.getWorkflowByIdValidator, validate, workflowController.deleteWorkflow);

router.post('/:id/execute', authorize('admin', 'attorney', 'consultant'), auditLog('execute_workflow'), workflowValidator.executeWorkflowValidator, validate, workflowController.executeWorkflow);
router.post('/:id/clone', authorize('admin', 'attorney'), auditLog('clone_workflow'), workflowValidator.cloneWorkflowValidator, validate, workflowController.cloneWorkflow);

module.exports = router;
