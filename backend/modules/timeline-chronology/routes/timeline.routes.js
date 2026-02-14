const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timeline.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../../../shared/middleware/validation.middleware');

// Validation
const timelineValidation = [
    body('case').notEmpty().withMessage('Case ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required')
];

const eventValidation = [
    body('date').notEmpty().withMessage('Event date is required'),
    body('category').isIn(['treatment', 'medication', 'lab', 'imaging', 'consultation', 'procedure', 'symptom', 'other'])
        .withMessage('Valid category is required'),
    body('title').trim().notEmpty().withMessage('Event title is required')
];

// Get work queue
router.get('/work-queue', protect, timelineController.getWorkQueue);

// Get timelines by case
router.get('/case/:caseId', protect, timelineController.getTimelinesByCase);

// Get timeline by ID
router.get('/:id', protect, timelineController.getTimelineById);

// Create timeline
router.post('/',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    timelineValidation,
    validate,
    timelineController.createTimeline
);

// Update timeline
router.put('/:id',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    timelineController.updateTimeline
);

// Delete timeline
router.delete('/:id',
    protect,
    authorize('admin'),
    timelineController.deleteTimeline
);

// Update status
router.patch('/:id/status',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    body('status').isIn(['draft', 'in-progress', 'review', 'completed']).withMessage('Valid status required'),
    validate,
    timelineController.updateStatus
);

// Add event
router.post('/:id/events',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    eventValidation,
    validate,
    timelineController.addEvent
);

// Update event
router.put('/:timelineId/events/:eventId',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    timelineController.updateEvent
);

// Delete event
router.delete('/:timelineId/events/:eventId',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    timelineController.deleteEvent
);

module.exports = router;
