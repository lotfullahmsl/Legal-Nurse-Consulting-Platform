const TimeEntry = require('../../../models/TimeEntry.model');
const Case = require('../../../models/Case.model');

exports.getAllTimeEntries = async (req, res, next) => {
    try {
        const { case: caseId, user: userId, startDate, endDate, isInvoiced, page = 1, limit = 50 } = req.query;

        const filter = {};
        if (caseId) filter.case = caseId;
        if (userId) filter.user = userId;
        if (isInvoiced !== undefined) filter.isInvoiced = isInvoiced === 'true';
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const entries = await TimeEntry.find(filter)
            .populate('case', 'title caseNumber')
            .populate('user', 'name email')
            .populate('task', 'title')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await TimeEntry.countDocuments(filter);

        res.json({
            entries,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        next(error);
    }
};

exports.getTimeEntryById = async (req, res, next) => {
    try {
        const entry = await TimeEntry.findById(req.params.id)
            .populate('case', 'title caseNumber')
            .populate('user', 'name email')
            .populate('task', 'title');

        if (!entry) {
            return res.status(404).json({ message: 'Time entry not found' });
        }

        res.json(entry);
    } catch (error) {
        next(error);
    }
};

exports.createTimeEntry = async (req, res, next) => {
    try {
        const { case: caseId, task, description, date, hours, minutes, billableRate, isBillable, activityType, notes } = req.body;

        const caseExists = await Case.findById(caseId);
        if (!caseExists) {
            return res.status(404).json({ message: 'Case not found' });
        }

        const entry = new TimeEntry({
            case: caseId,
            user: req.user.id,
            task,
            description,
            date: date || new Date(),
            hours,
            minutes: minutes || 0,
            billableRate,
            isBillable: isBillable !== undefined ? isBillable : true,
            activityType,
            notes
        });

        await entry.save();
        await entry.populate('case', 'title caseNumber');
        await entry.populate('user', 'name email');

        res.status(201).json(entry);
    } catch (error) {
        next(error);
    }
};

exports.updateTimeEntry = async (req, res, next) => {
    try {
        const { description, date, hours, minutes, billableRate, isBillable, activityType, notes } = req.body;

        const entry = await TimeEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Time entry not found' });
        }

        if (entry.isInvoiced) {
            return res.status(400).json({ message: 'Cannot update invoiced time entry' });
        }

        if (description) entry.description = description;
        if (date) entry.date = date;
        if (hours !== undefined) entry.hours = hours;
        if (minutes !== undefined) entry.minutes = minutes;
        if (billableRate !== undefined) entry.billableRate = billableRate;
        if (isBillable !== undefined) entry.isBillable = isBillable;
        if (activityType) entry.activityType = activityType;
        if (notes !== undefined) entry.notes = notes;

        await entry.save();
        await entry.populate('case', 'title caseNumber');
        await entry.populate('user', 'name email');

        res.json(entry);
    } catch (error) {
        next(error);
    }
};

exports.deleteTimeEntry = async (req, res, next) => {
    try {
        const entry = await TimeEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Time entry not found' });
        }

        if (entry.isInvoiced) {
            return res.status(400).json({ message: 'Cannot delete invoiced time entry' });
        }

        await entry.deleteOne();
        res.json({ message: 'Time entry deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getTimeEntriesByCase = async (req, res, next) => {
    try {
        const entries = await TimeEntry.find({ case: req.params.caseId })
            .populate('user', 'name email')
            .populate('task', 'title')
            .sort({ date: -1 });

        const totalHours = entries.reduce((sum, entry) => sum + entry.hours + (entry.minutes / 60), 0);
        const totalAmount = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);

        res.json({
            entries,
            summary: {
                totalHours: totalHours.toFixed(2),
                totalAmount: totalAmount.toFixed(2),
                billableHours: entries.filter(e => e.isBillable).reduce((sum, e) => sum + e.hours + (e.minutes / 60), 0).toFixed(2),
                unbilledAmount: entries.filter(e => !e.isInvoiced && e.isBillable).reduce((sum, e) => sum + e.totalAmount, 0).toFixed(2)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getTimeEntriesByUser = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const filter = { user: req.params.userId };

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const entries = await TimeEntry.find(filter)
            .populate('case', 'title caseNumber')
            .populate('task', 'title')
            .sort({ date: -1 });

        const totalHours = entries.reduce((sum, entry) => sum + entry.hours + (entry.minutes / 60), 0);
        const totalAmount = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);

        res.json({
            entries,
            summary: {
                totalHours: totalHours.toFixed(2),
                totalAmount: totalAmount.toFixed(2)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.startTimer = async (req, res, next) => {
    try {
        const { case: caseId, task, description, billableRate } = req.body;

        const activeTimer = await TimeEntry.findOne({ user: req.user.id, isTimerActive: true });
        if (activeTimer) {
            return res.status(400).json({ message: 'Timer already running. Stop current timer first.' });
        }

        const entry = new TimeEntry({
            case: caseId,
            user: req.user.id,
            task,
            description,
            billableRate,
            hours: 0,
            minutes: 0,
            timerStart: new Date(),
            isTimerActive: true
        });

        await entry.save();
        await entry.populate('case', 'title caseNumber');

        res.status(201).json(entry);
    } catch (error) {
        next(error);
    }
};

exports.stopTimer = async (req, res, next) => {
    try {
        const entry = await TimeEntry.findOne({ user: req.user.id, isTimerActive: true });
        if (!entry) {
            return res.status(404).json({ message: 'No active timer found' });
        }

        entry.timerEnd = new Date();
        entry.isTimerActive = false;

        const duration = (entry.timerEnd - entry.timerStart) / 1000 / 60;
        entry.hours = Math.floor(duration / 60);
        entry.minutes = Math.round(duration % 60);

        await entry.save();
        await entry.populate('case', 'title caseNumber');

        res.json(entry);
    } catch (error) {
        next(error);
    }
};

exports.bulkCreateTimeEntries = async (req, res, next) => {
    try {
        const { entries } = req.body;

        const createdEntries = [];
        for (const entryData of entries) {
            const entry = new TimeEntry({
                ...entryData,
                user: req.user.id
            });
            await entry.save();
            createdEntries.push(entry);
        }

        res.status(201).json({
            message: `${createdEntries.length} time entries created`,
            entries: createdEntries
        });
    } catch (error) {
        next(error);
    }
};
