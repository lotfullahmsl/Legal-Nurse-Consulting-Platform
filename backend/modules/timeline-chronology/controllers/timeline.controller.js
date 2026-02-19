const Timeline = require('../../../models/Timeline.model');
const AppError = require('../../../shared/errors/AppError');

// Get timelines by case
exports.getTimelinesByCase = async (req, res, next) => {
    try {
        const timelines = await Timeline.find({ case: req.params.caseId })
            .populate({
                path: 'case',
                select: 'caseNumber caseName caseType client lawFirm',
                populate: [
                    { path: 'client', select: 'firstName lastName fullName' },
                    { path: 'lawFirm', select: 'name' }
                ]
            })
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

// Get work queue (timelines assigned to user or all timelines)
exports.getWorkQueue = async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = {};

        // Only filter by assignedTo if it's explicitly requested
        // This allows showing all timelines in the work queue
        if (req.query.assignedToMe === 'true') {
            query.assignedTo = req.user._id;
        }

        if (status) query.status = status;

        const timelines = await Timeline.find(query)
            .populate({
                path: 'case',
                select: 'caseNumber caseName caseType client lawFirm',
                populate: [
                    { path: 'client', select: 'firstName lastName fullName' },
                    { path: 'lawFirm', select: 'name' }
                ]
            })
            .populate('createdBy', 'fullName')
            .populate('assignedTo', 'fullName')
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

// Generate timeline (mark as completed and ready for export)
exports.generateTimeline = async (req, res, next) => {
    try {
        const timeline = await Timeline.findById(req.params.id)
            .populate('case', 'caseNumber caseName')
            .populate('events.citations.document', 'fileName');

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        // Sort events by date
        timeline.events.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Update status to completed
        timeline.status = 'completed';
        timeline.completedAt = new Date();
        await timeline.save();

        res.status(200).json({
            success: true,
            message: 'Timeline generated successfully',
            data: { timeline }
        });
    } catch (error) {
        next(error);
    }
};

// Export timeline as text report
exports.exportTimeline = async (req, res, next) => {
    try {
        const { format = 'txt' } = req.query;
        const timeline = await Timeline.findById(req.params.id)
            .populate({
                path: 'case',
                select: 'caseNumber caseName client lawFirm',
                populate: [
                    { path: 'client', select: 'fullName' },
                    { path: 'lawFirm', select: 'name' }
                ]
            })
            .populate('events.citations.document', 'fileName')
            .populate('createdBy', 'fullName');

        if (!timeline) {
            throw new AppError('Timeline not found', 404);
        }

        // Sort events by date
        timeline.events.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Generate text report
        let report = '';
        report += '='.repeat(80) + '\n';
        report += 'MEDICAL CHRONOLOGY TIMELINE REPORT\n';
        report += '='.repeat(80) + '\n\n';

        report += `Case Number: ${timeline.case?.caseNumber || 'N/A'}\n`;
        report += `Case Name: ${timeline.case?.caseName || 'N/A'}\n`;
        report += `Client: ${timeline.case?.client?.fullName || 'N/A'}\n`;
        report += `Law Firm: ${timeline.case?.lawFirm?.name || 'N/A'}\n`;
        report += `Timeline Title: ${timeline.title}\n`;
        report += `Status: ${timeline.status.toUpperCase()}\n`;
        report += `Total Events: ${timeline.events.length}\n`;
        report += `Created By: ${timeline.createdBy?.fullName || 'N/A'}\n`;
        report += `Generated: ${new Date().toLocaleString()}\n`;
        report += '\n' + '='.repeat(80) + '\n\n';

        // Add events
        report += 'CHRONOLOGICAL EVENTS\n';
        report += '='.repeat(80) + '\n\n';

        timeline.events.forEach((event, index) => {
            report += `${index + 1}. ${new Date(event.date).toLocaleDateString()}`;
            if (event.time) report += ` at ${event.time}`;
            report += '\n';
            report += `   Category: ${event.category.toUpperCase()}\n`;
            report += `   Title: ${event.title}\n`;

            if (event.description) {
                report += `   Description: ${event.description}\n`;
            }

            if (event.provider?.name) {
                report += `   Provider: ${event.provider.name}`;
                if (event.provider.facility) report += ` - ${event.provider.facility}`;
                report += '\n';
            }

            if (event.citations && event.citations.length > 0) {
                report += `   Citations:\n`;
                event.citations.forEach((citation, idx) => {
                    report += `     ${idx + 1}. ${citation.document?.fileName || 'Document'} - Page ${citation.pageNumber}\n`;
                    if (citation.excerpt) {
                        report += `        "${citation.excerpt}"\n`;
                    }
                });
            }

            report += '\n';
        });

        report += '='.repeat(80) + '\n';
        report += 'END OF REPORT\n';
        report += '='.repeat(80) + '\n';

        // Set headers for download
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="timeline-${timeline.case?.caseNumber || 'report'}.txt"`);
        res.send(report);
    } catch (error) {
        next(error);
    }
};
