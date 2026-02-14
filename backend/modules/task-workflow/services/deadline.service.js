const Deadline = require('../../../models/Deadline.model');
const Case = require('../../../models/Case.model');
const notificationService = require('./notification.service');
const logger = require('../../../shared/utils/logger.util');

/**
 * Deadline Service - Statute of limitations and deadline monitoring
 */

/**
 * Check for upcoming deadlines and send reminders
 */
exports.checkUpcomingDeadlines = async () => {
    try {
        const now = new Date();
        const reminderWindows = [
            { days: 30, label: '30-day' },
            { days: 14, label: '14-day' },
            { days: 7, label: '7-day' },
            { days: 3, label: '3-day' },
            { days: 1, label: '1-day' }
        ];

        let totalReminders = 0;

        for (const window of reminderWindows) {
            const windowDate = new Date(now);
            windowDate.setDate(windowDate.getDate() + window.days);

            const deadlines = await Deadline.find({
                status: { $nin: ['completed', 'cancelled'] },
                deadlineDate: {
                    $gte: windowDate,
                    $lt: new Date(windowDate.getTime() + 24 * 60 * 60 * 1000)
                },
                reminderDates: { $in: [windowDate] }
            })
                .populate('case', 'title caseNumber')
                .populate('assignedTo', 'name email');

            for (const deadline of deadlines) {
                await notificationService.sendDeadlineReminder(deadline, window.label);
                totalReminders++;
            }
        }

        logger.info(`Sent ${totalReminders} deadline reminders`);
        return totalReminders;
    } catch (error) {
        logger.error('Error checking upcoming deadlines:', error);
        throw error;
    }
};

/**
 * Check for overdue deadlines
 */
exports.checkOverdueDeadlines = async () => {
    try {
        const now = new Date();

        const overdueDeadlines = await Deadline.find({
            status: { $nin: ['completed', 'cancelled'] },
            deadlineDate: { $lt: now }
        })
            .populate('case', 'title caseNumber')
            .populate('assignedTo', 'name email');

        for (const deadline of overdueDeadlines) {
            await notificationService.sendDeadlineAlert(deadline, 'overdue');
        }

        logger.info(`Found ${overdueDeadlines.length} overdue deadlines`);
        return overdueDeadlines;
    } catch (error) {
        logger.error('Error checking overdue deadlines:', error);
        throw error;
    }
};

/**
 * Calculate statute of limitations deadline
 */
exports.calculateStatuteDeadline = async (caseId, incidentDate, jurisdiction, caseType) => {
    try {
        // Statute of limitations periods by jurisdiction and case type
        // This is a simplified example - real implementation would need comprehensive legal database
        const statutePeriods = {
            'medical-malpractice': {
                'default': 2, // years
                'CA': 3,
                'NY': 2.5,
                'TX': 2,
                'FL': 2
            },
            'personal-injury': {
                'default': 2,
                'CA': 2,
                'NY': 3,
                'TX': 2,
                'FL': 4
            },
            'wrongful-death': {
                'default': 2,
                'CA': 2,
                'NY': 2,
                'TX': 2,
                'FL': 2
            }
        };

        const period = statutePeriods[caseType]?.[jurisdiction] ||
            statutePeriods[caseType]?.['default'] ||
            2;

        const deadlineDate = new Date(incidentDate);
        deadlineDate.setFullYear(deadlineDate.getFullYear() + period);

        // Create deadline record
        const deadline = new Deadline({
            case: caseId,
            title: 'Statute of Limitations',
            description: `Statute of limitations deadline for ${caseType} in ${jurisdiction}`,
            type: 'statute-of-limitations',
            deadlineDate,
            priority: 'critical',
            reminderDates: [
                new Date(deadlineDate.getTime() - 180 * 24 * 60 * 60 * 1000), // 6 months
                new Date(deadlineDate.getTime() - 90 * 24 * 60 * 60 * 1000),  // 3 months
                new Date(deadlineDate.getTime() - 60 * 24 * 60 * 60 * 1000),  // 2 months
                new Date(deadlineDate.getTime() - 30 * 24 * 60 * 60 * 1000),  // 1 month
                new Date(deadlineDate.getTime() - 14 * 24 * 60 * 60 * 1000),  // 2 weeks
                new Date(deadlineDate.getTime() - 7 * 24 * 60 * 60 * 1000)    // 1 week
            ],
            notes: `Calculated based on incident date: ${incidentDate.toDateString()}`
        });

        await deadline.save();
        logger.info(`Created statute of limitations deadline for case ${caseId}`);

        return deadline;
    } catch (error) {
        logger.error('Error calculating statute deadline:', error);
        throw error;
    }
};

/**
 * Get critical deadlines (within 7 days)
 */
exports.getCriticalDeadlines = async () => {
    try {
        const now = new Date();
        const criticalDate = new Date(now);
        criticalDate.setDate(criticalDate.getDate() + 7);

        const criticalDeadlines = await Deadline.find({
            status: { $nin: ['completed', 'cancelled'] },
            deadlineDate: { $gte: now, $lte: criticalDate },
            priority: { $in: ['high', 'critical'] }
        })
            .populate('case', 'title caseNumber')
            .populate('assignedTo', 'name email')
            .sort({ deadlineDate: 1 });

        return criticalDeadlines;
    } catch (error) {
        logger.error('Error getting critical deadlines:', error);
        throw error;
    }
};

/**
 * Auto-create court date deadlines
 */
exports.createCourtDateDeadlines = async (caseId, courtDate, courtType) => {
    try {
        const deadlines = [];

        // Discovery deadline (typically 30 days before trial)
        const discoveryDeadline = new Date(courtDate);
        discoveryDeadline.setDate(discoveryDeadline.getDate() - 30);

        deadlines.push({
            case: caseId,
            title: 'Discovery Deadline',
            description: `Discovery must be completed for ${courtType}`,
            type: 'discovery',
            deadlineDate: discoveryDeadline,
            priority: 'high',
            reminderDates: [
                new Date(discoveryDeadline.getTime() - 14 * 24 * 60 * 60 * 1000),
                new Date(discoveryDeadline.getTime() - 7 * 24 * 60 * 60 * 1000),
                new Date(discoveryDeadline.getTime() - 3 * 24 * 60 * 60 * 1000)
            ]
        });

        // Expert witness disclosure (typically 60 days before trial)
        const expertDeadline = new Date(courtDate);
        expertDeadline.setDate(expertDeadline.getDate() - 60);

        deadlines.push({
            case: caseId,
            title: 'Expert Witness Disclosure',
            description: `Expert witness list must be disclosed for ${courtType}`,
            type: 'expert-disclosure',
            deadlineDate: expertDeadline,
            priority: 'high',
            reminderDates: [
                new Date(expertDeadline.getTime() - 21 * 24 * 60 * 60 * 1000),
                new Date(expertDeadline.getTime() - 14 * 24 * 60 * 60 * 1000),
                new Date(expertDeadline.getTime() - 7 * 24 * 60 * 60 * 1000)
            ]
        });

        // Pretrial motions (typically 14 days before trial)
        const motionsDeadline = new Date(courtDate);
        motionsDeadline.setDate(motionsDeadline.getDate() - 14);

        deadlines.push({
            case: caseId,
            title: 'Pretrial Motions Deadline',
            description: `All pretrial motions must be filed for ${courtType}`,
            type: 'motions',
            deadlineDate: motionsDeadline,
            priority: 'high',
            reminderDates: [
                new Date(motionsDeadline.getTime() - 7 * 24 * 60 * 60 * 1000),
                new Date(motionsDeadline.getTime() - 3 * 24 * 60 * 60 * 1000),
                new Date(motionsDeadline.getTime() - 1 * 24 * 60 * 60 * 1000)
            ]
        });

        // Court date itself
        deadlines.push({
            case: caseId,
            title: courtType,
            description: `Court appearance required`,
            type: 'court-date',
            deadlineDate: courtDate,
            priority: 'critical',
            reminderDates: [
                new Date(courtDate.getTime() - 7 * 24 * 60 * 60 * 1000),
                new Date(courtDate.getTime() - 3 * 24 * 60 * 60 * 1000),
                new Date(courtDate.getTime() - 1 * 24 * 60 * 60 * 1000)
            ]
        });

        const createdDeadlines = await Deadline.insertMany(deadlines);
        logger.info(`Created ${createdDeadlines.length} court-related deadlines`);

        return createdDeadlines;
    } catch (error) {
        logger.error('Error creating court date deadlines:', error);
        throw error;
    }
};

module.exports = exports;
