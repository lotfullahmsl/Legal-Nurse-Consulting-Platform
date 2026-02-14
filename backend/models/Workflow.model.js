const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
    name: {
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
        enum: ['case-intake', 'medical-review', 'timeline-creation', 'report-generation', 'court-preparation', 'custom'],
        required: true
    },
    isTemplate: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    triggerEvent: {
        type: String,
        enum: ['case-created', 'case-status-change', 'document-uploaded', 'deadline-approaching', 'manual'],
        default: 'manual'
    },
    steps: [{
        order: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: String,
        taskType: {
            type: String,
            enum: ['review', 'analysis', 'timeline', 'report', 'court-date', 'deadline', 'follow-up', 'other'],
            default: 'other'
        },
        assignToRole: {
            type: String,
            enum: ['admin', 'attorney', 'consultant', 'client']
        },
        daysToComplete: {
            type: Number,
            default: 7
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        autoAssign: {
            type: Boolean,
            default: false
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes
workflowSchema.index({ type: 1, isActive: 1 });
workflowSchema.index({ isTemplate: 1 });

module.exports = mongoose.model('Workflow', workflowSchema);
