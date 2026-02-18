const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: [true, 'Case reference is required']
    },
    fileName: {
        type: String,
        required: [true, 'File name is required']
    },
    fileType: {
        type: String,
        enum: ['pdf', 'image', 'doc', 'other'],
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileUrl: {
        type: String,
        required: false // Optional when using fileData (base64 storage)
    },
    // For development: store small files as base64 in MongoDB
    // WARNING: Not recommended for production - use cloud storage instead
    fileData: {
        type: String,
        select: false // Don't include by default in queries for performance
    },
    mimeType: {
        type: String,
        required: false // MIME type of the file (e.g., 'image/jpeg', 'application/pdf')
    },
    documentType: {
        type: String,
        enum: ['medical-record', 'lab-report', 'imaging', 'prescription', 'consultation', 'discharge-summary', 'other'],
        default: 'medical-record'
    },
    provider: {
        name: String,
        facility: String,
        specialty: String
    },
    recordDate: Date,
    pageCount: {
        type: Number,
        default: 1
    },
    ocrStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    ocrText: String,
    ocrProcessedAt: Date,
    metadata: {
        patientName: String,
        dateOfService: Date,
        diagnosis: [String],
        procedures: [String],
        medications: [String]
    },
    tags: [String],
    notes: String,
    chainOfCustody: [{
        action: {
            type: String,
            enum: ['uploaded', 'viewed', 'downloaded', 'shared', 'modified', 'deleted']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        ipAddress: String,
        details: String
    }],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    version: {
        type: Number,
        default: 1
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

medicalRecordSchema.index({ case: 1 });
medicalRecordSchema.index({ fileName: 'text', ocrText: 'text', 'metadata.diagnosis': 'text' });
medicalRecordSchema.index({ documentType: 1 });
medicalRecordSchema.index({ recordDate: 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
