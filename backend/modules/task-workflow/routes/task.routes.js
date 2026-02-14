const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const taskValidator = require('../validators/task.validator');

// All routes require authentication
router.use(protect);

// Task routes
router.get('/', auditLog('view_tasks'), taskValidator.getTasksValidator, validate, taskController.getAllTasks);
router.get('/my-tasks', auditLog('view_my_tasks'), taskController.getMyTasks);
router.get('/stats', auditLog('view_task_stats'), taskController.getTaskStats);
router.get('/case/:caseId', auditLog('view_case_tasks'), taskValidator.getTasksByCaseValidator, validate, taskController.getTasksByCase);
router.get('/:id', auditLog('view_task'), taskValidator.getTaskByIdValidator, validate, taskController.getTaskById);

router.post('/', authorize('admin', 'attorney', 'consultant'), auditLog('create_task'), taskValidator.createTaskValidator, validate, taskController.createTask);
router.put('/:id', authorize('admin', 'attorney', 'consultant'), auditLog('update_task'), taskValidator.updateTaskValidator, validate, taskController.updateTask);
router.patch('/:id/status', auditLog('update_task_status'), taskValidator.updateTaskStatusValidator, validate, taskController.updateTaskStatus);
router.delete('/:id', authorize('admin', 'attorney'), auditLog('delete_task'), taskValidator.getTaskByIdValidator, validate, taskController.deleteTask);

router.post('/:id/assign', authorize('admin', 'attorney', 'consultant'), auditLog('assign_task'), taskValidator.assignTaskValidator, validate, taskController.assignTask);
router.post('/:id/comments', auditLog('add_task_comment'), taskValidator.addCommentValidator, validate, taskController.addComment);

module.exports = router;
