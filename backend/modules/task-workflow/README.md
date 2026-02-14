# Task & Workflow Management Module

## Overview
This module provides comprehensive task management, workflow automation, and deadline tracking capabilities for the Legal Nurse Consulting Platform.

## Features

### 1. Task Management
- ✅ Create, assign, and track tasks
- ✅ Task priorities (low, medium, high, critical)
- ✅ Task statuses (pending, in-progress, completed, cancelled)
- ✅ Task types (general, review, analysis, communication, etc.)
- ✅ Due date tracking with reminders
- ✅ Task comments and collaboration
- ✅ Recurring tasks support
- ✅ Auto-assignment based on workload
- ✅ Task statistics and analytics

### 2. Workflow Automation
- ✅ Workflow templates for common processes
- ✅ Automated task creation based on triggers
- ✅ Event-driven workflow execution
- ✅ Role-based task assignment
- ✅ Workflow cloning and customization
- ✅ Pre-built templates:
  - New Case Intake Workflow
  - Medical Records Review Workflow
  - Case Closure Workflow

### 3. Deadline Management
- ✅ Court date tracking
- ✅ Statute of limitations monitoring
- ✅ Discovery deadlines
- ✅ Expert witness disclosure deadlines
- ✅ Filing and response deadlines
- ✅ Multi-level reminder system
- ✅ Critical deadline alerts
- ✅ Auto-creation of court-related deadlines

### 4. Notifications & Reminders
- ✅ Task assignment notifications
- ✅ Overdue task reminders
- ✅ Upcoming deadline alerts
- ✅ Daily summary reports
- ✅ Email notifications (ready for integration)

### 5. Automated Scheduling
- ✅ Hourly overdue task checks
- ✅ 6-hour upcoming task checks
- ✅ Daily recurring task processing
- ✅ 4-hour deadline monitoring
- ✅ Daily summary generation at 8 AM

## API Endpoints

### Tasks
```
GET    /api/tasks                    - Get all tasks (with filters)
GET    /api/tasks/my-tasks           - Get current user's tasks
GET    /api/tasks/stats              - Get task statistics
GET    /api/tasks/case/:caseId       - Get tasks for a case
GET    /api/tasks/:id                - Get task by ID
POST   /api/tasks                    - Create new task
PUT    /api/tasks/:id                - Update task
PATCH  /api/tasks/:id/status         - Update task status
DELETE /api/tasks/:id                - Delete task
POST   /api/tasks/:id/assign         - Assign task to user
POST   /api/tasks/:id/comments       - Add comment to task
```

### Workflows
```
GET    /api/workflows                - Get all workflows
GET    /api/workflows/templates      - Get workflow templates
GET    /api/workflows/:id            - Get workflow by ID
POST   /api/workflows                - Create workflow
PUT    /api/workflows/:id            - Update workflow
DELETE /api/workflows/:id            - Delete workflow
POST   /api/workflows/:id/execute    - Execute workflow for a case
POST   /api/workflows/:id/clone      - Clone workflow
```

### Deadlines
```
GET    /api/deadlines                - Get all deadlines
GET    /api/deadlines/upcoming       - Get upcoming deadlines
GET    /api/deadlines/stats          - Get deadline statistics
GET    /api/deadlines/case/:caseId   - Get deadlines for a case
GET    /api/deadlines/:id            - Get deadline by ID
POST   /api/deadlines                - Create deadline
PUT    /api/deadlines/:id            - Update deadline
DELETE /api/deadlines/:id            - Delete deadline
```

## Usage Examples

### Create a Task
```javascript
POST /api/tasks
{
  "title": "Review Medical Records",
  "description": "Initial review of patient medical records",
  "case": "case_id_here",
  "assignedTo": "user_id_here",
  "priority": "high",
  "type": "review",
  "dueDate": "2024-12-31T23:59:59Z",
  "tags": ["medical-review", "urgent"]
}
```

### Execute a Workflow
```javascript
POST /api/workflows/:workflowId/execute
{
  "caseId": "case_id_here"
}
```

### Create a Statute of Limitations Deadline
```javascript
// Use the deadline service
const deadlineService = require('./services/deadline.service');

await deadlineService.calculateStatuteDeadline(
  caseId,
  incidentDate,
  'CA',  // jurisdiction
  'medical-malpractice'
);
```

### Create Court Date Deadlines
```javascript
const deadlineService = require('./services/deadline.service');

await deadlineService.createCourtDateDeadlines(
  caseId,
  courtDate,
  'Trial'
);
```

## Services

### Task Service
- `checkOverdueTasks()` - Check and send reminders for overdue tasks
- `checkUpcomingDeadlines()` - Check and send reminders for upcoming tasks
- `processRecurringTasks()` - Create new instances of recurring tasks
- `getUserTaskStats(userId)` - Get task statistics for a user
- `bulkAssignTasks(taskIds, assignedTo, assignedBy)` - Bulk assign tasks
- `autoAssignTask(task, role)` - Auto-assign based on workload

### Workflow Service
- `triggerWorkflowByEvent(eventType, caseId, userId)` - Trigger workflows by event
- `createDefaultTemplates()` - Create default workflow templates
- `getWorkflowRecommendations(caseId)` - Get recommended workflows

### Deadline Service
- `checkUpcomingDeadlines()` - Check and send deadline reminders
- `checkOverdueDeadlines()` - Check for overdue deadlines
- `calculateStatuteDeadline(caseId, incidentDate, jurisdiction, caseType)` - Calculate statute of limitations
- `getCriticalDeadlines()` - Get deadlines within 7 days
- `createCourtDateDeadlines(caseId, courtDate, courtType)` - Auto-create court-related deadlines

### Notification Service
- `sendTaskAssignment(task)` - Send task assignment notification
- `sendTaskReminder(task, reminderType)` - Send task reminder
- `sendDeadlineReminder(deadline, reminderLabel)` - Send deadline reminder
- `sendDeadlineAlert(deadline, alertType)` - Send deadline alert
- `sendWorkflowNotification(workflow, caseData, tasksCreated)` - Send workflow notification

### Scheduler Service
- `initializeScheduler()` - Start all scheduled jobs
- `stopScheduler()` - Stop all scheduled jobs
- `getSchedulerStatus()` - Get status of scheduled jobs
- `triggerJob(jobName)` - Manually trigger a job

## Initialization

Add to `server.js`:

```javascript
const { schedulerService } = require('./modules/task-workflow');

// After MongoDB connection
schedulerService.initializeScheduler();

// Graceful shutdown
process.on('SIGTERM', () => {
  schedulerService.stopScheduler();
  // ... other cleanup
});
```

## Workflow Triggers

Workflows can be triggered by these events:
- `case_created` - When a new case is created
- `records_received` - When medical records are uploaded
- `case_closing` - When a case is being closed
- `milestone_reached` - When a case milestone is reached
- `manual` - Manual execution only

## Task Types

- `general` - General task
- `review` - Review task
- `analysis` - Analysis task
- `communication` - Communication task
- `administrative` - Administrative task
- `billing` - Billing task
- `legal` - Legal task
- `medical` - Medical task
- `document-request` - Document request
- `indexing` - Indexing task
- `processing` - Processing task
- `timeline` - Timeline task

## Deadline Types

- `statute-of-limitations` - Statute of limitations deadline
- `court-date` - Court appearance
- `discovery` - Discovery deadline
- `filing` - Filing deadline
- `response` - Response deadline
- `expert-disclosure` - Expert witness disclosure
- `motions` - Pretrial motions
- `settlement` - Settlement deadline
- `trial` - Trial date
- `appeal` - Appeal deadline
- `general` - General deadline

## Integration with Other Modules

### Case Management
- Tasks and deadlines are linked to cases
- Workflows are triggered by case events

### User Management
- Tasks are assigned to users
- Role-based workflow assignment

### Audit & Compliance
- All actions are logged via audit middleware
- Complete audit trail for compliance

## Future Enhancements

- [ ] WebSocket for real-time notifications
- [ ] Email service integration (SendGrid/AWS SES)
- [ ] SMS notifications for critical deadlines
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Advanced workflow conditions and branching
- [ ] Task dependencies
- [ ] Gantt chart visualization
- [ ] Mobile push notifications

## Dependencies

```json
{
  "node-cron": "^3.0.0",
  "express-validator": "^7.0.0"
}
```

## Testing

```bash
# Test task creation
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","case":"CASE_ID","assignedTo":"USER_ID"}'

# Test workflow execution
curl -X POST http://localhost:5000/api/workflows/WORKFLOW_ID/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"caseId":"CASE_ID"}'
```

## Module Structure

```
task-workflow/
├── controllers/
│   ├── task.controller.js
│   ├── workflow.controller.js
│   └── deadline.controller.js
├── routes/
│   ├── task.routes.js
│   ├── workflow.routes.js
│   └── deadline.routes.js
├── services/
│   ├── task.service.js
│   ├── workflow.service.js
│   ├── deadline.service.js
│   ├── notification.service.js
│   └── scheduler.service.js
├── validators/
│   ├── task.validator.js
│   ├── workflow.validator.js
│   └── deadline.validator.js
├── index.js
└── README.md
```

## SRS Compliance

This module fully implements Section 3.6 of the SRS:
- ✅ 3.6.1 Task Management
- ✅ 3.6.2 Workflow Automation
- ✅ 3.6.3 Progress Tracking

## Phase 5 Status: ✅ COMPLETE

All Phase 5 requirements from BACKEND_IMPLEMENTATION_PHASES.md have been implemented.
