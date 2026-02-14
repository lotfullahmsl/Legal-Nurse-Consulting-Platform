const logger = require('../../../shared/utils/logger.util');

/**
 * Notification Service - Email and system notifications
 * Note: This is a basic implementation. In production, integrate with:
 * - SendGrid, AWS SES, or similar email service
 * - WebSocket for real-time notifications
 * - Push notification service
 */

/**
 * Send task assignment notification
 */
exports.sendTaskAssignment = async (task) => {
    try {
        const notification = {
            type: 'task_assigned',
            recipient: task.assignedTo.email,
            subject: `New Task Assigned: ${task.title}`,
            body: `
                You have been assigned a new task:
                
                Task: ${task.title}
                Case: ${task.case?.title || 'N/A'} (${task.case?.caseNumber || 'N/A'})
                Priority: ${task.priority}
                Due Date: ${task.dueDate ? task.dueDate.toDateString() : 'Not set'}
                
                Description:
                ${task.description || 'No description provided'}
                
                Please log in to the system to view details and update the task status.
            `,
            metadata: {
                taskId: task._id,
                caseId: task.case?._id
            }
        };

        // In production, send actual email here
        logger.info(`[NOTIFICATION] Task assignment sent to ${task.assignedTo.email}`);

        // TODO: Implement actual email sending
        // await emailService.send(notification);

        return notification;
    } catch (error) {
        logger.error('Error sending task assignment notification:', error);
        throw error;
    }
};

/**
 * Send task reminder notification
 */
exports.sendTaskReminder = async (task, reminderType) => {
    try {
        let subject, body;

        if (reminderType === 'overdue') {
            subject = `OVERDUE: ${task.title}`;
            body = `
                This task is now overdue:
                
                Task: ${task.title}
                Case: ${task.case?.title || 'N/A'} (${task.case?.caseNumber || 'N/A'})
                Due Date: ${task.dueDate ? task.dueDate.toDateString() : 'Not set'}
                Days Overdue: ${Math.floor((new Date() - task.dueDate) / (1000 * 60 * 60 * 24))}
                
                Please complete this task as soon as possible.
            `;
        } else if (reminderType === 'upcoming') {
            subject = `Reminder: ${task.title} due soon`;
            body = `
                This task is due within 24 hours:
                
                Task: ${task.title}
                Case: ${task.case?.title || 'N/A'} (${task.case?.caseNumber || 'N/A'})
                Due Date: ${task.dueDate ? task.dueDate.toDateString() : 'Not set'}
                Priority: ${task.priority}
                
                Please ensure this task is completed on time.
            `;
        }

        const notification = {
            type: 'task_reminder',
            recipient: task.assignedTo.email,
            subject,
            body,
            metadata: {
                taskId: task._id,
                reminderType
            }
        };

        logger.info(`[NOTIFICATION] Task reminder (${reminderType}) sent to ${task.assignedTo.email}`);

        // TODO: Implement actual email sending
        // await emailService.send(notification);

        return notification;
    } catch (error) {
        logger.error('Error sending task reminder:', error);
        throw error;
    }
};

/**
 * Send deadline reminder notification
 */
exports.sendDeadlineReminder = async (deadline, reminderLabel) => {
    try {
        const notification = {
            type: 'deadline_reminder',
            recipient: deadline.assignedTo?.email || 'admin@example.com',
            subject: `Deadline Reminder (${reminderLabel}): ${deadline.title}`,
            body: `
                Upcoming deadline reminder:
                
                Deadline: ${deadline.title}
                Case: ${deadline.case?.title || 'N/A'} (${deadline.case?.caseNumber || 'N/A'})
                Type: ${deadline.type}
                Deadline Date: ${deadline.deadlineDate.toDateString()}
                Priority: ${deadline.priority}
                
                ${deadline.description || ''}
                
                ${deadline.notes || ''}
                
                Please ensure all necessary actions are completed before this deadline.
            `,
            metadata: {
                deadlineId: deadline._id,
                reminderLabel
            }
        };

        logger.info(`[NOTIFICATION] Deadline reminder (${reminderLabel}) sent`);

        // TODO: Implement actual email sending
        // await emailService.send(notification);

        return notification;
    } catch (error) {
        logger.error('Error sending deadline reminder:', error);
        throw error;
    }
};

/**
 * Send deadline alert (overdue or critical)
 */
exports.sendDeadlineAlert = async (deadline, alertType) => {
    try {
        const notification = {
            type: 'deadline_alert',
            recipient: deadline.assignedTo?.email || 'admin@example.com',
            subject: `URGENT: ${alertType.toUpperCase()} Deadline - ${deadline.title}`,
            body: `
                URGENT DEADLINE ALERT:
                
                Deadline: ${deadline.title}
                Case: ${deadline.case?.title || 'N/A'} (${deadline.case?.caseNumber || 'N/A'})
                Type: ${deadline.type}
                Deadline Date: ${deadline.deadlineDate.toDateString()}
                Status: ${alertType}
                Priority: ${deadline.priority}
                
                ${deadline.description || ''}
                
                IMMEDIATE ACTION REQUIRED!
            `,
            metadata: {
                deadlineId: deadline._id,
                alertType
            }
        };

        logger.info(`[NOTIFICATION] Deadline alert (${alertType}) sent`);

        // TODO: Implement actual email sending
        // await emailService.send(notification);

        return notification;
    } catch (error) {
        logger.error('Error sending deadline alert:', error);
        throw error;
    }
};

/**
 * Send workflow execution notification
 */
exports.sendWorkflowNotification = async (workflow, caseData, tasksCreated) => {
    try {
        const notification = {
            type: 'workflow_executed',
            recipient: 'admin@example.com', // Send to case manager or admin
            subject: `Workflow Executed: ${workflow.name}`,
            body: `
                A workflow has been executed:
                
                Workflow: ${workflow.name}
                Case: ${caseData.title} (${caseData.caseNumber})
                Tasks Created: ${tasksCreated}
                
                ${workflow.description || ''}
                
                All assigned team members have been notified of their tasks.
            `,
            metadata: {
                workflowId: workflow._id,
                caseId: caseData._id,
                tasksCreated
            }
        };

        logger.info(`[NOTIFICATION] Workflow execution notification sent`);

        // TODO: Implement actual email sending
        // await emailService.send(notification);

        return notification;
    } catch (error) {
        logger.error('Error sending workflow notification:', error);
        throw error;
    }
};

/**
 * Send task comment notification
 */
exports.sendTaskCommentNotification = async (task, comment, commenter) => {
    try {
        const notification = {
            type: 'task_comment',
            recipient: task.assignedTo.email,
            subject: `New Comment on Task: ${task.title}`,
            body: `
                ${commenter.name} added a comment to your task:
                
                Task: ${task.title}
                Case: ${task.case?.title || 'N/A'}
                
                Comment:
                "${comment}"
                
                Log in to view and respond.
            `,
            metadata: {
                taskId: task._id,
                commenterId: commenter._id
            }
        };

        logger.info(`[NOTIFICATION] Task comment notification sent to ${task.assignedTo.email}`);

        // TODO: Implement actual email sending
        // await emailService.send(notification);

        return notification;
    } catch (error) {
        logger.error('Error sending task comment notification:', error);
        throw error;
    }
};

/**
 * Batch send notifications
 */
exports.batchSendNotifications = async (notifications) => {
    try {
        const results = [];

        for (const notification of notifications) {
            try {
                // TODO: Implement actual batch email sending
                logger.info(`[NOTIFICATION] Batch notification sent to ${notification.recipient}`);
                results.push({ success: true, notification });
            } catch (error) {
                logger.error(`Error sending notification to ${notification.recipient}:`, error);
                results.push({ success: false, notification, error: error.message });
            }
        }

        return results;
    } catch (error) {
        logger.error('Error batch sending notifications:', error);
        throw error;
    }
};

module.exports = exports;
