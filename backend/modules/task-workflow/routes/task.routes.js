const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

// All routes require authentication
router.use(protect);

// Task routes
router.get('/', auditLog('view_tasks'), taskController.getAllTasks);
router.get('/my-tasks', auditLog('view_my_tasks'), taskController.getMyTasks);
router.get('/stats', auditLog('view_task_stats'), taskController.getTaskStats);
router.get('/case/:caseId', auditLog('view_case_tasks'), taskController.getTasksByCase);
router.get('/:id', auditLog('view_task'), taskController.getTaskById);

router.post('/', authorize('admin', 'attorney', 'consultant'), auditLog('create_task'), taskController.createTask);
router.put('/:id', authorize('admin', 'attorney', 'consultant'), auditLog('update_task'), taskController.updateTask);
router.patch('/:id/status', auditLog('update_task_status'), taskController.updateTaskStatus);
router.delete('/:id', authorize('admin', 'attorney'), auditLog('delete_task'), taskController.deleteTask);

router.post('/:id/assign', authorize('admin', 'attorney', 'consultant'), auditLog('assign_task'), taskController.assignTask);
router.post('/:id/comments', auditLog('add_task_comment'), taskController.addComment);

module.exports = router;
