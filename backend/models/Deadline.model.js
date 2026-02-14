const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['court-date', 'statute-of-limitations', 'discovery', 'filing', 'hearing', 'trial', 'other'],
        required: true
    },
    deadlineDate: {
        type: Date,
        required: true
    },
    reminderDates: [{
        date: Date,
        sent: {
            type: Boolean,
            default: false
        }
    }],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['upcoming', 'due-soon', 'overdue', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    completedAt: Date,
    notes: String,
    relatedTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes
deadlineSchema.index({ case: 1, deadlineDate: 1 });
deadlineSchema.index({ deadlineDate: 1, status: 1 });
deadlineSchema.index({ type: 1 });

// Virtual to check if deadline is approaching
deadlineSchema.virtual('isApproaching').get(function () {
    const daysUntil = Math.ceil((this.deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 7 && daysUntil > 0;
});

// Virtual to check if overdue
deadlineSchema.virtual('isOverdue').get(function () {
    return this.deadlineDate < new Date() && this.status !== 'completed';
});

module.exports = mongoose.model('Deadline', deadlineSchema);
