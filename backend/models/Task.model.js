const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['review', 'analysis', 'timeline', 'report', 'court-date', 'deadline', 'follow-up', 'other'],
        default: 'other'
    },
    dueDate: {
        type: Date,
        required: true
    },
    completedAt: Date,
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly']
        },
        interval: Number,
        endDate: Date
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    reminderDate: Date,
    tags: [String],
    attachments: [{
        fileName: String,
        fileUrl: String,
        uploadedAt: Date
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    workflowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workflow'
    }
}, {
    timestamps: true
});

// Indexes for performance
taskSchema.index({ case: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
