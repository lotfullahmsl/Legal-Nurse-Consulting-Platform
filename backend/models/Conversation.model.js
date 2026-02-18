const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        index: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        enum: ['direct', 'group', 'case'],
        required: true,
        index: true
    },
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    archivedAt: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for performance
conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ case: 1, type: 1 });
conversationSchema.index({ type: 1, isArchived: 1, lastMessageAt: -1 });

// Virtual for unread count (calculated per user)
conversationSchema.virtual('messageCount', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'conversation',
    count: true
});

module.exports = mongoose.model('Conversation', conversationSchema);
