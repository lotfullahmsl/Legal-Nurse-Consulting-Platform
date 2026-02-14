const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflow.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

// All routes require authentication
router.use(protect);

// Workflow routes
router.get('/', auditLog('view_workflows'), workflowController.getAllWorkflows);
router.get('/templates', auditLog('view_workflow_templates'), workflowController.getWorkflowTemplates);
router.get('/:id', auditLog('view_workflow'), workflowController.getWorkflowById);

router.post('/', authorize('admin', 'attorney'), auditLog('create_workflow'), workflowController.createWorkflow);
router.put('/:id', authorize('admin', 'attorney'), auditLog('update_workflow'), workflowController.updateWorkflow);
router.delete('/:id', authorize('admin', 'attorney'), auditLog('delete_workflow'), workflowController.deleteWorkflow);

router.post('/:id/execute', authorize('admin', 'attorney', 'consultant'), auditLog('execute_workflow'), workflowController.executeWorkflow);
router.post('/:id/clone', authorize('admin', 'attorney'), auditLog('clone_workflow'), workflowController.cloneWorkflow);

module.exports = router;
