const Deadline = require('../../../models/Deadline.model');
const Case = require('../../../models/Case.model');

// Get all deadlines
exports.getAllDeadlines = async (req, res, next) => {
    try {
        const { type, status, case: caseId, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (caseId) filter.case = caseId;

        const deadlines = await Deadline.find(filter)
            .populate('case', 'title caseNumber')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('relatedTask', 'title status')
            .sort({ deadlineDate: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Deadline.countDocuments(filter);

        res.json({
            deadlines,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        next(error);
    }
};

// Get upcoming deadlines
exports.getUpcomingDeadlines = async (req, res, next) => {
    try {
        const { days = 30 } = req.query;

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(days));

        const deadlines = await Deadline.find({
            deadlineDate: { $gte: new Date(), $lte: endDate },
            status: { $nin: ['completed', 'cancelled'] }
        })
            .populate('case', 'title caseNumber')
            .populate('assignedTo', 'name email')
            .sort({ deadlineDate: 1 });

        res.json(deadlines);
    } catch (error) {
        next(error);
    }
};

// Get deadlines by case
exports.getDeadlinesByCase = async (req, res, next) => {
    try {
        const deadlines = await Deadline.find({ case: req.params.caseId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('relatedTask', 'title status')
            .sort({ deadlineDate: 1 });

        res.json(deadlines);
    } catch (error) {
        next(error);
    }
};

// Get deadline by ID
exports.getDeadlineById = async (req, res, next) => {
    try {
        const deadline = await Deadline.findById(req.params.id)
            .populate('case', 'title caseNumber')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('relatedTask', 'title status');

        if (!deadline) {
            return res.status(404).json({ message: 'Deadline not found' });
        }

        res.json(deadline);
    } catch (error) {
        next(error);
    }
};

// Create deadline
exports.createDeadline = async (req, res, next) => {
    try {
        const { case: caseId, title, description, type, deadlineDate, priority, assignedTo, reminderDates, notes, relatedTask } = req.body;

        // Verify case exists
        const caseExists = await Case.findById(caseId);
        if (!caseExists) {
            return res.status(404).json({ message: 'Case not found' });
        }

        const deadline = new Deadline({
            case: caseId,
            title,
            description,
            type,
            deadlineDate,
            priority,
            assignedTo,
            reminderDates: reminderDates || [],
            notes,
            relatedTask,
            createdBy: req.user.id
        });

        await deadline.save();
        await deadline.populate('case', 'title caseNumber');
        await deadline.populate('assignedTo', 'name email');
        await deadline.populate('createdBy', 'name email');

        res.status(201).json(deadline);
    } catch (error) {
        next(error);
    }
};

// Update deadline
exports.updateDeadline = async (req, res, next) => {
    try {
        const { title, description, type, deadlineDate, priority, status, assignedTo, reminderDates, notes, relatedTask } = req.body;

        const deadline = await Deadline.findById(req.params.id);
        if (!deadline) {
            return res.status(404).json({ message: 'Deadline not found' });
        }

        if (title) deadline.title = title;
        if (description !== undefined) deadline.description = description;
        if (type) deadline.type = type;
        if (deadlineDate) deadline.deadlineDate = deadlineDate;
        if (priority) deadline.priority = priority;
        if (status) {
            deadline.status = status;
            if (status === 'completed' && !deadline.completedAt) {
                deadline.completedAt = new Date();
            }
        }
        if (assignedTo) deadline.assignedTo = assignedTo;
        if (reminderDates) deadline.reminderDates = reminderDates;
        if (notes !== undefined) deadline.notes = notes;
        if (relatedTask !== undefined) deadline.relatedTask = relatedTask;

        await deadline.save();
        await deadline.populate('case', 'title caseNumber');
        await deadline.populate('assignedTo', 'name email');

        res.json(deadline);
    } catch (error) {
        next(error);
    }
};

// Delete deadline
exports.deleteDeadline = async (req, res, next) => {
    try {
        const deadline = await Deadline.findByIdAndDelete(req.params.id);
        if (!deadline) {
            return res.status(404).json({ message: 'Deadline not found' });
        }

        res.json({ message: 'Deadline deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get deadline statistics
exports.getDeadlineStats = async (req, res, next) => {
    try {
        const totalDeadlines = await Deadline.countDocuments();
        const upcomingDeadlines = await Deadline.countDocuments({
            deadlineDate: { $gte: new Date() },
            status: { $nin: ['completed', 'cancelled'] }
        });
        const overdueDeadlines = await Deadline.countDocuments({
            deadlineDate: { $lt: new Date() },
            status: { $nin: ['completed', 'cancelled'] }
        });
        const completedDeadlines = await Deadline.countDocuments({ status: 'completed' });

        // Deadlines by type
        const deadlinesByType = await Deadline.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        // Critical deadlines (next 7 days)
        const criticalDate = new Date();
        criticalDate.setDate(criticalDate.getDate() + 7);
        const criticalDeadlines = await Deadline.countDocuments({
            deadlineDate: { $gte: new Date(), $lte: criticalDate },
            status: { $nin: ['completed', 'cancelled'] }
        });

        res.json({
            totalDeadlines,
            upcomingDeadlines,
            overdueDeadlines,
            completedDeadlines,
            criticalDeadlines,
            deadlinesByType
        });
    } catch (error) {
        next(error);
    }
};
