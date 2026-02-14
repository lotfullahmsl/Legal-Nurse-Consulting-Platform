const Task = require('../../../models/Task.model');
const User = require('../../../models/User.model');
const notificationService = require('./notification.service');
const logger = require('../../../shared/utils/logger.util');

/**
 * Task Service - Business logic for task management
 */

/**
 * Check for overdue tasks and send reminders
 */
exports.checkOverdueTasks = async () => {
    try {
        const now = new Date();

        const overdueTasks = await Task.find({
            status: { $nin: ['completed', 'cancelled'] },
            dueDate: { $lt: now },
            lastReminderSent: { $lt: new Date(now - 24 * 60 * 60 * 1000) } // Last reminder > 24h ago
        })
            .populate('assignedTo', 'name email')
            .populate('case', 'title caseNumber');

        for (const task of overdueTasks) {
            await notificationService.sendTaskReminder(task, 'overdue');
            task.lastReminderSent = now;
            await task.save();
        }

        logger.info(`Checked ${overdueTasks.length} overdue tasks`);
        return overdueTasks.length;
    } catch (error) {
        logger.error('Error checking overdue tasks:', error);
        throw error;
    }
};

/**
 * Check for upcoming task deadlines and send reminders
 */
exports.checkUpcomingDeadlines = async () => {
    try {
        const now = new Date();
        const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        const upcomingTasks = await Task.find({
            status: { $nin: ['completed', 'cancelled'] },
            dueDate: { $gte: now, $lte: reminderWindow },
            lastReminderSent: { $lt: new Date(now - 12 * 60 * 60 * 1000) } // Last reminder > 12h ago
        })
            .populate('assignedTo', 'name email')
            .populate('case', 'title caseNumber');

        for (const task of upcomingTasks) {
            await notificationService.sendTaskReminder(task, 'upcoming');
            task.lastReminderSent = now;
            await task.save();
        }

        logger.info(`Sent reminders for ${upcomingTasks.length} upcoming tasks`);
        return upcomingTasks.length;
    } catch (error) {
        logger.error('Error checking upcoming deadlines:', error);
        throw error;
    }
};

/**
 * Process recurring tasks - create new instances
 */
exports.processRecurringTasks = async () => {
    try {
        const now = new Date();

        const recurringTasks = await Task.find({
            isRecurring: true,
            status: 'completed',
            'recurringPattern.nextOccurrence': { $lte: now }
        })
            .populate('assignedTo')
            .populate('case');

        const createdTasks = [];

        for (const task of recurringTasks) {
            const newTask = new Task({
                title: task.title,
                description: task.description,
                case: task.case._id,
                assignedTo: task.assignedTo._id,
                assignedBy: task.assignedBy,
                priority: task.priority,
                type: task.type,
                dueDate: calculateNextDueDate(task.recurringPattern),
                isRecurring: true,
                recurringPattern: task.recurringPattern,
                tags: task.tags
            });

            await newTask.save();
            createdTasks.push(newTask);

            // Update next occurrence
            task.recurringPattern.nextOccurrence = calculateNextOccurrence(task.recurringPattern);
            await task.save();

            // Send notification
            await notificationService.sendTaskAssignment(newTask);
        }

        logger.info(`Created ${createdTasks.length} recurring task instances`);
        return createdTasks;
    } catch (error) {
        logger.error('Error processing recurring tasks:', error);
        throw error;
    }
};

/**
 * Calculate next due date based on recurring pattern
 */
function calculateNextDueDate(pattern) {
    const now = new Date();
    const dueDate = new Date(now);

    switch (pattern.frequency) {
        case 'daily':
            dueDate.setDate(dueDate.getDate() + (pattern.interval || 1));
            break;
        case 'weekly':
            dueDate.setDate(dueDate.getDate() + (7 * (pattern.interval || 1)));
            break;
        case 'monthly':
            dueDate.setMonth(dueDate.getMonth() + (pattern.interval || 1));
            break;
        case 'yearly':
            dueDate.setFullYear(dueDate.getFullYear() + (pattern.interval || 1));
            break;
        default:
            dueDate.setDate(dueDate.getDate() + 7); // Default to weekly
    }

    return dueDate;
}

/**
 * Calculate next occurrence for recurring pattern
 */
function calculateNextOccurrence(pattern) {
    return calculateNextDueDate(pattern);
}

/**
 * Get task statistics for a user
 */
exports.getUserTaskStats = async (userId) => {
    try {
        const stats = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const overdue = await Task.countDocuments({
            assignedTo: userId,
            status: { $nin: ['completed', 'cancelled'] },
            dueDate: { $lt: new Date() }
        });

        return {
            byStatus: stats,
            overdue
        };
    } catch (error) {
        logger.error('Error getting user task stats:', error);
        throw error;
    }
};

/**
 * Bulk assign tasks
 */
exports.bulkAssignTasks = async (taskIds, assignedTo, assignedBy) => {
    try {
        const result = await Task.updateMany(
            { _id: { $in: taskIds } },
            {
                $set: {
                    assignedTo,
                    assignedBy,
                    updatedAt: new Date()
                }
            }
        );

        // Send notifications
        const tasks = await Task.find({ _id: { $in: taskIds } })
            .populate('assignedTo', 'name email')
            .populate('case', 'title caseNumber');

        for (const task of tasks) {
            await notificationService.sendTaskAssignment(task);
        }

        logger.info(`Bulk assigned ${result.modifiedCount} tasks`);
        return result;
    } catch (error) {
        logger.error('Error bulk assigning tasks:', error);
        throw error;
    }
};

/**
 * Auto-assign tasks based on workload
 */
exports.autoAssignTask = async (task, role) => {
    try {
        // Find users with the specified role
        const users = await User.find({ role, isActive: true });

        if (users.length === 0) {
            throw new Error(`No active users found with role: ${role}`);
        }

        // Get task counts for each user
        const userWorkloads = await Promise.all(
            users.map(async (user) => {
                const taskCount = await Task.countDocuments({
                    assignedTo: user._id,
                    status: { $nin: ['completed', 'cancelled'] }
                });
                return { user, taskCount };
            })
        );

        // Sort by workload (ascending) and assign to user with least tasks
        userWorkloads.sort((a, b) => a.taskCount - b.taskCount);
        const assignedUser = userWorkloads[0].user;

        task.assignedTo = assignedUser._id;
        await task.save();

        logger.info(`Auto-assigned task ${task._id} to ${assignedUser.name}`);
        return assignedUser;
    } catch (error) {
        logger.error('Error auto-assigning task:', error);
        throw error;
    }
};

module.exports = exports;
