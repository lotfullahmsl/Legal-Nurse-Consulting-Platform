const mongoose = require('mongoose');

const fileShareSchema = new mongoose.Schema({
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord',
        required: true
    },
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    sharedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accessLevel: {
        type: String,
        enum: ['view', 'download'],
        default: 'view'
    },
    expiresAt: Date,
    accessLog: [{
        action: {
            type: String,
            enum: ['viewed', 'downloaded']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        ipAddress: String
    }],
    isRevoked: {
        type: Boolean,
        default: false
    },
    revokedAt: Date,
    revokedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

fileShareSchema.index({ file: 1, sharedWith: 1 });
fileShareSchema.index({ case: 1 });
fileShareSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('FileShare', fileShareSchema);
