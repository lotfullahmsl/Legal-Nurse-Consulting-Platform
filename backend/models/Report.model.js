const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['case-summary', 'timeline', 'analysis', 'billing', 'custom', 'attorney-summary', 'trial-brief', 'chronology']
    },
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        index: true
    },
    template: {
        type: String,
        enum: ['attorney-summary', 'chronology', 'trial-brief', 'custom']
    },
    format: {
        type: String,
        enum: ['pdf', 'docx', 'html'],
        default: 'pdf'
    },
    content: {
        type: mongoose.Schema.Types.Mixed
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['generating', 'completed', 'failed'],
        default: 'generating'
    },
    fileUrl: {
        type: String
    },
    fileSize: {
        type: Number
    },
    parameters: {
        type: mongoose.Schema.Types.Mixed
    },
    error: {
        type: String
    }
}, {
    timestamps: true
});

reportSchema.index({ case: 1, type: 1 });
reportSchema.index({ generatedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
