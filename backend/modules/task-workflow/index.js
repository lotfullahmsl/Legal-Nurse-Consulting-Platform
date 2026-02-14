/**
 * Task & Workflow Management Module
 * 
 * This module handles:
 * - Task creation, assignment, and tracking
 * - Workflow automation and templates
 * - Deadline monitoring and statute of limitations tracking
 * - Automated reminders and notifications
 * - Recurring task management
 */

const taskRoutes = require('./routes/task.routes');
const workflowRoutes = require('./routes/workflow.routes');
const deadlineRoutes = require('./routes/deadline.routes');
const schedulerService = require('./services/scheduler.service');
const workflowService = require('./services/workflow.service');

module.exports = {
    taskRoutes,
    workflowRoutes,
    deadlineRoutes,
    schedulerService,
    workflowService
};

