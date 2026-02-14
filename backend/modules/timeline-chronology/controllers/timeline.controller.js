const Timeline = require('../../../models/Timeline.model');
const AppError = require('../../../shared/errors/AppError');

// Get timelines by case
exports.getTimelinesByCase = async (req, res, next) => {
    try {
        const timelines = await Timeline.find({ case: req.params.caseId })
            .populate('case', 'caseNumber caseName')
            .populate('assignedTo', 'fullName email')
            .populate('createdBy', 'fullName')
            .populate('events.citations.document', 'fileName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { timelines }
        });
    } catch (error) {
        next(error);
    }
};

// Get timeline by ID
exports.getTimelineById = async (req, res, next) => {
    try {
        const timeline = await Timeline.findById(req.params.id)
            .populate('case', 'caseNumber caseName client')
            .populate('assignedTo', 'fullName email')
            .populate('createdBy', 'fullName')
            .populate('reviewedBy', 'fullName')
            .populate('events.citations.document', 'fileName fileUrl')
            .populate('events.createdBy', 'fullName');

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        // Sort events by date
        timeline.events.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json({
            success: true,
            data: { timeline }
        });
    } catch (error) {
        next(error);
    }
};

// Create timeline
exports.createTimeline = async (req, res, next) => {
    try {
        const timelineData = {
            ...req.body,
            createdBy: req.user._id
        };

        const timeline = await Timeline.create(timelineData);
        await timeline.populate('case assignedTo createdBy');

        res.status(201).json({
            success: true,
            message: 'Timeline created successfully',
            data: { timeline }
        });
    } catch (error) {
        next(error);
    }
};

// Update timeline
exports.updateTimeline = async (req, res, next) => {
    try {
        const timeline = await Timeline.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('case assignedTo createdBy');

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Timeline updated successfully',
            data: { timeline }
        });
    } catch (error) {
        next(error);
    }
};

// Delete timeline
exports.deleteTimeline = async (req, res, next) => {
    try {
        const timeline = await Timeline.findByIdAndDelete(req.params.id);

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Timeline deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Add event to timeline
exports.addEvent = async (req, res, next) => {
    try {
        const timeline = await Timeline.findById(req.params.id);

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        const eventData = {
            ...req.body,
            createdBy: req.user._id
        };

        timeline.events.push(eventData);
        await timeline.save();

        // Sort events by date
        timeline.events.sort((a, b) => new Date(a.date) - new Date(b.date));
        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Event added successfully',
            data: { timeline }
        });
    } catch (error) {
        next(error);
    }
};

// Update event
exports.updateEvent = async (req, res, next) => {
    try {
        const timeline = await Timeline.findById(req.params.timelineId);

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        const event = timeline.events.id(req.params.eventId);
        if (!event) {
            throw new AppError('Event not found', 404);
        }

        Object.assign(event, req.body);
        await timeline.save();

        // Re-sort events
        timeline.events.sort((a, b) => new Date(a.date) - new Date(b.date));
        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: { timeline }
        });
    } catch (error) {
        next(error);
    }
};

// Delete event
exports.deleteEvent = async (req, res, next) => {
    try {
        const timeline = await Timeline.findById(req.params.timelineId);

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        timeline.events.pull(req.params.eventId);
        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
            data: { timeline }
        });
    } catch (error) {
        next(error);
    }
};

// Get work queue (timelines assigned to user)
exports.getWorkQueue = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = {
            assignedTo: req.user._id
        };

        if (status) query.status = status;

        const timelines = await Timeline.find(query)
            .populate('case', 'caseNumber caseName')
            .populate('createdBy', 'fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { timelines }
        });
    } catch (error) {
        next(error);
    }
};

// Update timeline status
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const timeline = await Timeline.findById(req.params.id);

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        timeline.status = status;

        if (status === 'completed') {
            timeline.completedAt = new Date();
        }

        if (status === 'review') {
            timeline.reviewedBy = req.user._id;
            timeline.reviewedAt = new Date();
        }

        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Timeline status updated successfully',
            data: { timeline }
        });
    } catch (error) {
        next(error);
    }
};
