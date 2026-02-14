const TimeEntry = require('../../../models/TimeEntry.model');
const User = require('../../../models/User.model');

class TimeTrackingService {
    async calculateDuration(hours, minutes) {
        return hours + (minutes / 60);
    }

    async calculateAmount(hours, minutes, rate) {
        const duration = await this.calculateDuration(hours, minutes);
        return duration * rate;
    }

    async getActiveTimer(userId) {
        return await TimeEntry.findOne({
            user: userId,
            isTimerActive: true
        }).populate('case', 'title caseNumber');
    }

    async startTimer(userId, timerData) {
        const activeTimer = await this.getActiveTimer(userId);
        if (activeTimer) {
            throw new Error('Timer already running. Stop current timer first.');
        }

        const entry = new TimeEntry({
            case: timerData.caseId,
            user: userId,
            task: timerData.taskId,
            description: timerData.description,
            billableRate: timerData.billableRate,
            activityType: timerData.activityType,
            hours: 0,
            minutes: 0,
            timerStart: new Date(),
            isTimerActive: true
        });

        await entry.save();
        return entry;
    }

    async stopTimer(userId) {
        const entry = await TimeEntry.findOne({
            user: userId,
            isTimerActive: true
        });

        if (!entry) {
            throw new Error('No active timer found');
        }

        entry.timerEnd = new Date();
        entry.isTimerActive = false;

        const durationMinutes = (entry.timerEnd - entry.timerStart) / 1000 / 60;
        entry.hours = Math.floor(durationMinutes / 60);
        entry.minutes = Math.round(durationMinutes % 60);

        await entry.save();
        return entry;
    }

    async getTimerDuration(userId) {
        const activeTimer = await this.getActiveTimer(userId);
        if (!activeTimer) {
            return null;
        }

        const now = new Date();
        const durationMinutes = (now - activeTimer.timerStart) / 1000 / 60;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = Math.round(durationMinutes % 60);

        return {
            entry: activeTimer,
            currentDuration: {
                hours,
                minutes,
                totalMinutes: Math.round(durationMinutes)
            }
        };
    }

    async getUnbilledTimeEntries(caseId) {
        return await TimeEntry.find({
            case: caseId,
            isBillable: true,
            isInvoiced: false
        })
            .populate('user', 'name email')
            .populate('task', 'title')
            .sort({ date: -1 });
    }

    async getTimeEntriesByDateRange(filters) {
        const query = {};

        if (filters.caseId) query.case = filters.caseId;
        if (filters.userId) query.user = filters.userId;
        if (filters.isBillable !== undefined) query.isBillable = filters.isBillable;
        if (filters.isInvoiced !== undefined) query.isInvoiced = filters.isInvoiced;

        if (filters.startDate || filters.endDate) {
            query.date = {};
            if (filters.startDate) query.date.$gte = new Date(filters.startDate);
            if (filters.endDate) query.date.$lte = new Date(filters.endDate);
        }

        return await TimeEntry.find(query)
            .populate('case', 'title caseNumber')
            .populate('user', 'name email')
            .populate('task', 'title')
            .sort({ date: -1 });
    }

    async calculateTimeSummary(timeEntries) {
        const totalHours = timeEntries.reduce((sum, entry) =>
            sum + entry.hours + (entry.minutes / 60), 0
        );

        const totalAmount = timeEntries.reduce((sum, entry) =>
            sum + entry.totalAmount, 0
        );

        const billableEntries = timeEntries.filter(e => e.isBillable);
        const billableHours = billableEntries.reduce((sum, entry) =>
            sum + entry.hours + (entry.minutes / 60), 0
        );

        const billableAmount = billableEntries.reduce((sum, entry) =>
            sum + entry.totalAmount, 0
        );

        const unbilledEntries = timeEntries.filter(e => !e.isInvoiced && e.isBillable);
        const unbilledAmount = unbilledEntries.reduce((sum, entry) =>
            sum + entry.totalAmount, 0
        );

        return {
            totalHours: totalHours.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            billableHours: billableHours.toFixed(2),
            billableAmount: billableAmount.toFixed(2),
            unbilledAmount: unbilledAmount.toFixed(2),
            totalEntries: timeEntries.length,
            unbilledEntries: unbilledEntries.length
        };
    }

    async getUserProductivity(userId, startDate, endDate) {
        const filter = { user: userId };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const timeEntries = await TimeEntry.find(filter);

        const byActivityType = {};
        timeEntries.forEach(entry => {
            if (!byActivityType[entry.activityType]) {
                byActivityType[entry.activityType] = {
                    hours: 0,
                    amount: 0,
                    count: 0
                };
            }
            byActivityType[entry.activityType].hours += entry.hours + (entry.minutes / 60);
            byActivityType[entry.activityType].amount += entry.totalAmount;
            byActivityType[entry.activityType].count += 1;
        });

        const summary = await this.calculateTimeSummary(timeEntries);

        return {
            ...summary,
            byActivityType
        };
    }

    async bulkCreateTimeEntries(userId, entries) {
        const createdEntries = [];

        for (const entryData of entries) {
            const entry = new TimeEntry({
                ...entryData,
                user: userId
            });
            await entry.save();
            createdEntries.push(entry);
        }

        return createdEntries;
    }

    async validateTimeEntry(entryData) {
        if (entryData.hours < 0 || entryData.hours > 24) {
            throw new Error('Hours must be between 0 and 24');
        }

        if (entryData.minutes < 0 || entryData.minutes > 59) {
            throw new Error('Minutes must be between 0 and 59');
        }

        if (entryData.billableRate < 0) {
            throw new Error('Billable rate cannot be negative');
        }

        return true;
    }
}

module.exports = new TimeTrackingService();
