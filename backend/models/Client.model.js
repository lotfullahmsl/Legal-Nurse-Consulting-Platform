const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Client full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'USA' }
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    medicalHistory: {
        conditions: [String],
        medications: [String],
        allergies: [String]
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lawFirm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LawFirm'
    },
    notes: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

clientSchema.index({ email: 1 });
clientSchema.index({ fullName: 'text' });
clientSchema.index({ status: 1 });

module.exports = mongoose.model('Client', clientSchema);
