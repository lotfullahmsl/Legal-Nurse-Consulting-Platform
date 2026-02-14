const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    query: {
        type: String,
        required: true
    },
    filters: {
        caseId: mongoose.Schema.Types.ObjectId,
        documentType: String,
        dateRange: {
            start: Date,
            end: Date
        }
    },
    resultsCount: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

searchHistorySchema.index({ user: 1, timestamp: -1 });
searchHistorySchema.index({ query: 'text' });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
