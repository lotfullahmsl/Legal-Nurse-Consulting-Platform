const mongoose = require('mongoose');

const lawFirmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: [true, 'Law firm name is required'],
        trim: true
    },
    contactPerson: {
        type: String,
        required: [true, 'Contact person is required']
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
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'USA' }
    },
    website: String,
    specializations: [String],
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    partnershipDate: {
        type: Date,
        default: Date.now
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

lawFirmSchema.index({ firmName: 'text' });
lawFirmSchema.index({ status: 1 });

module.exports = mongoose.model('LawFirm', lawFirmSchema);
