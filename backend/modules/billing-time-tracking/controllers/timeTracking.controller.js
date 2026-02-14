const timeTrackingService = require('../services/timeTracking.service');

exports.startTimer = async (req, res, next) => {
    try {
        const { caseId, taskId, description, billableRate, activityType } = req.body;

        const entry = await timeTrackingService.startTimer(req.user.id, {
            caseId,
            taskId,
            description,
            billableRate,
            activityType
        });

        await entry.populate('case', 'title caseNumber');

        res.status(201).json({
            message: 'Timer started',
            entry
        });
    } catch (error) {
        next(error);
    }
};

exports.stopTimer = async (req, res, next) => {
    try {
        const entry = await timeTrackingService.stopTimer(req.user.id);

        await entry.populate('case', 'title caseNumber');

        res.json({
            message: 'Timer stopped',
            entry,
            duration: {
                hours: entry.hours,
                minutes: entry.minutes,
                amount: entry.totalAmount
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getActiveTimer = async (req, res, next) => {
    try {
        const timerData = await timeTrackingService.getTimerDuration(req.user.id);

        if (!timerData) {
            return res.json({ active: false, timer: null });
        }

        res.json({
            active: true,
            timer: timerData
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyTimeEntries = async (req, res, next) => {
    try {
        const { startDate, endDate, caseId } = req.query;

        const entries = await timeTrackingService.getTimeEntriesByDateRange({
            userId: req.user.id,
            startDate,
            endDate,
            caseId
        });

        const summary = await timeTrackingService.calculateTimeSummary(entries);

        res.json({
            entries,
            summary
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyProductivity = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const productivity = await timeTrackingService.getUserProductivity(
            req.user.id,
            startDate,
            endDate
        );

        res.json(productivity);
    } catch (error) {
        next(error);
    }
};

exports.bulkCreateEntries = async (req, res, next) => {
    try {
        const { entries } = req.body;

        if (!Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ message: 'Entries array is required' });
        }

        const createdEntries = await timeTrackingService.bulkCreateTimeEntries(
            req.user.id,
            entries
        );

        res.status(201).json({
            message: `${createdEntries.length} time entries created`,
            entries: createdEntries
        });
    } catch (error) {
        next(error);
    }
};

exports.getUnbilledTime = async (req, res, next) => {
    try {
        const { caseId } = req.params;

        const unbilledEntries = await timeTrackingService.getUnbilledTimeEntries(caseId);
        const summary = await timeTrackingService.calculateTimeSummary(unbilledEntries);

        res.json({
            entries: unbilledEntries,
            summary
        });
    } catch (error) {
        next(error);
    }
};
