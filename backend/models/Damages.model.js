const mongoose = require('mongoose');

const damagesSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: [true, 'Case reference is required']
    },
    category: {
        type: String,
        enum: ['economic', 'non-economic', 'punitive'],
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: String,
    amount: {
        type: Number,
        default: 0
    },
    dateIncurred: Date,
    status: {
        type: String,
        enum: ['estimated', 'documented', 'verified', 'disputed'],
        default: 'estimated'
    },
    supportingDocuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalRecord'
    }],
    notes: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

damagesSchema.index({ case: 1 });
damagesSchema.index({ category: 1 });

module.exports = mongoose.model('Damages', damagesSchema);
