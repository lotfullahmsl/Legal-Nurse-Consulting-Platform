const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['general', 'medical', 'legal', 'administrative', 'research', 'communication'],
        default: 'general',
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    attachments: [{
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastEditedAt: Date,
    version: {
        type: Number,
        default: 1
    },
    history: [{
        content: String,
        editedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        editedAt: {
            type: Date,
            default: Date.now
        },
        version: Number
    }],
    relatedRecords: [{
        recordType: {
            type: String,
            enum: ['MedicalRecord', 'Timeline', 'Task', 'Deadline']
        },
        recordId: mongoose.Schema.Types.ObjectId
    }]
}, {
    timestamps: true
});

// Indexes for performance
noteSchema.index({ case: 1, createdAt: -1 });
noteSchema.index({ createdBy: 1, createdAt: -1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ type: 1, case: 1 });
noteSchema.index({ isPinned: -1, createdAt: -1 });

// Text search index
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Save version history before updating
noteSchema.pre('save', function (next) {
    if (this.isModified('content') && !this.isNew) {
        this.history.push({
            content: this.content,
            editedBy: this.lastEditedBy,
            editedAt: new Date(),
            version: this.version
        });
        this.version += 1;
        this.lastEditedAt = new Date();
    }
    next();
});

module.exports = mongoose.model('Note', noteSchema);
