const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    hours: {
        type: Number,
        required: true,
        min: 0,
        max: 24
    },
    minutes: {
        type: Number,
        default: 0,
        min: 0,
        max: 59
    },
    billableRate: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    isBillable: {
        type: Boolean,
        default: true
    },
    isInvoiced: {
        type: Boolean,
        default: false,
        index: true
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    },
    activityType: {
        type: String,
        enum: ['Medical Record Review', 'Timeline Creation', 'Report Writing', 'Client Communication', 'Research', 'Expert Consultation', 'Court Preparation', 'Administrative', 'Other'],
        default: 'Other'
    },
    notes: {
        type: String,
        trim: true
    },
    timerStart: {
        type: Date
    },
    timerEnd: {
        type: Date
    },
    isTimerActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Calculate total amount before saving
timeEntrySchema.pre('save', function (next) {
    if (this.isModified('hours') || this.isModified('minutes') || this.isModified('billableRate')) {
        const totalHours = this.hours + (this.minutes / 60);
        this.totalAmount = totalHours * this.billableRate;
    }
    next();
});

// Indexes for performance
timeEntrySchema.index({ case: 1, date: -1 });
timeEntrySchema.index({ user: 1, date: -1 });
timeEntrySchema.index({ isInvoiced: 1, isBillable: 1 });

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
