const cron = require('node-cron');
const taskService = require('./task.service');
const deadlineService = require('./deadline.service');
const workflowService = require('./workflow.service');
const logger = require('../../../shared/utils/logger.util');

/**
 * Scheduler Service - Automated background jobs
 */

let scheduledJobs = [];

/**
 * Initialize all scheduled jobs
 */
exports.initializeScheduler = () => {
    try {
        // Check overdue tasks - Every hour
        const overdueTasksJob = cron.schedule('0 * * * *', async () => {
            logger.info('[SCHEDULER] Running overdue tasks check...');
            try {
                await taskService.checkOverdueTasks();
            } catch (error) {
                logger.error('[SCHEDULER] Error checking overdue tasks:', error);
            }
        });
        scheduledJobs.push({ name: 'overdueTasksCheck', job: overdueTasksJob });

        // Check upcoming task deadlines - Every 6 hours
        const upcomingTasksJob = cron.schedule('0 */6 * * *', async () => {
            logger.info('[SCHEDULER] Running upcoming tasks check...');
            try {
                await taskService.checkUpcomingDeadlines();
            } catch (error) {
                logger.error('[SCHEDULER] Error checking upcoming tasks:', error);
            }
        });
        scheduledJobs.push({ name: 'upcomingTasksCheck', job: upcomingTasksJob });

        // Process recurring tasks - Daily at 2 AM
        const recurringTasksJob = cron.schedule('0 2 * * *', async () => {
            logger.info('[SCHEDULER] Processing recurring tasks...');
            try {
                await taskService.processRecurringTasks();
            } catch (error) {
                logger.error('[SCHEDULER] Error processing recurring tasks:', error);
            }
        });
        scheduledJobs.push({ name: 'recurringTasksProcess', job: recurringTasksJob });

        // Check upcoming deadlines - Every 4 hours
        const upcomingDeadlinesJob = cron.schedule('0 */4 * * *', async () => {
            logger.info('[SCHEDULER] Running upcoming deadlines check...');
            try {
                await deadlineService.checkUpcomingDeadlines();
            } catch (error) {
                logger.error('[SCHEDULER] Error checking upcoming deadlines:', error);
            }
        });
        scheduledJobs.push({ name: 'upcomingDeadlinesCheck', job: upcomingDeadlinesJob });

        // Check overdue deadlines - Every 2 hours
        const overdueDeadlinesJob = cron.schedule('0 */2 * * *', async () => {
            logger.info('[SCHEDULER] Running overdue deadlines check...');
            try {
                await deadlineService.checkOverdueDeadlines();
            } catch (error) {
                logger.error('[SCHEDULER] Error checking overdue deadlines:', error);
            }
        });
        scheduledJobs.push({ name: 'overdueDeadlinesCheck', job: overdueDeadlinesJob });

        // Daily summary report - Every day at 8 AM
        const dailySummaryJob = cron.schedule('0 8 * * *', async () => {
            logger.info('[SCHEDULER] Generating daily summary...');
            try {
                await generateDailySummary();
            } catch (error) {
                logger.error('[SCHEDULER] Error generating daily summary:', error);
            }
        });
        scheduledJobs.push({ name: 'dailySummary', job: dailySummaryJob });

        logger.info(`✅ Scheduler initialized with ${scheduledJobs.length} jobs`);
        logger.info('Scheduled jobs:', scheduledJobs.map(j => j.name).join(', '));
    } catch (error) {
        logger.error('❌ Error initializing scheduler:', error);
        throw error;
    }
};

/**
 * Stop all scheduled jobs
 */
exports.stopScheduler = () => {
    try {
        scheduledJobs.forEach(({ name, job }) => {
            job.stop();
            logger.info(`Stopped scheduled job: ${name}`);
        });
        scheduledJobs = [];
        logger.info('✅ All scheduled jobs stopped');
    } catch (error) {
        logger.error('❌ Error stopping scheduler:', error);
        throw error;
    }
};

/**
 * Get status of all scheduled jobs
 */
exports.getSchedulerStatus = () => {
    return scheduledJobs.map(({ name, job }) => ({
        name,
        running: job.running || false
    }));
};

/**
 * Generate daily summary report
 */
async function generateDailySummary() {
    try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get critical deadlines
        const criticalDeadlines = await deadlineService.getCriticalDeadlines();

        // Get overdue tasks count
        const Task = require('../../../models/Task.model');
        const overdueTasksCount = await Task.countDocuments({
            status: { $nin: ['completed', 'cancelled'] },
            dueDate: { $lt: today }
        });

        // Get today's tasks
        const todaysTasks = await Task.countDocuments({
            status: { $nin: ['completed', 'cancelled'] },
            dueDate: { $gte: today, $lt: tomorrow }
        });

        logger.info('=== DAILY SUMMARY ===');
        logger.info(`Critical Deadlines (next 7 days): ${criticalDeadlines.length}`);
        logger.info(`Overdue Tasks: ${overdueTasksCount}`);
        logger.info(`Tasks Due Today: ${todaysTasks}`);
        logger.info('====================');

        // TODO: Send email summary to admins
        // await notificationService.sendDailySummary({
        //     criticalDeadlines,
        //     overdueTasksCount,
        //     todaysTasks
        // });
    } catch (error) {
        logger.error('Error generating daily summary:', error);
        throw error;
    }
}

/**
 * Manual trigger for testing
 */
exports.triggerJob = async (jobName) => {
    try {
        switch (jobName) {
            case 'overdueTasksCheck':
                return await taskService.checkOverdueTasks();
            case 'upcomingTasksCheck':
                return await taskService.checkUpcomingDeadlines();
            case 'recurringTasksProcess':
                return await taskService.processRecurringTasks();
            case 'upcomingDeadlinesCheck':
                return await deadlineService.checkUpcomingDeadlines();
            case 'overdueDeadlinesCheck':
                return await deadlineService.checkOverdueDeadlines();
            case 'dailySummary':
                return await generateDailySummary();
            default:
                throw new Error(`Unknown job: ${jobName}`);
        }
    } catch (error) {
        logger.error(`Error triggering job ${jobName}:`, error);
        throw error;
    }
};

module.exports = exports;
