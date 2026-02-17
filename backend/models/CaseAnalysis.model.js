const mongoose = require('mongoose');

const caseAnalysisSchema = new mongoose.Schema({
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: [true, 'Case reference is required'],
        unique: true
    },
    standardsOfCare: [{
        category: String,
        standard: String,
        assessment: String,
        evidence: String,
        description: String,
        source: String,
        met: {
            type: Boolean,
            default: null
        },
        notes: String
    }],
    breaches: [{
        description: String,
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'minor', 'moderate', 'severe', 'critical']
        },
        impact: String,
        date: Date,
        evidence: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MedicalRecord'
        }],
        notes: String
    }],
    causation: {
        directCause: String,
        contributingFactors: [String],
        analysis: String,
        strength: {
            type: String,
            enum: ['weak', 'moderate', 'strong', 'definitive']
        }
    },
    expertOpinions: [{
        expertName: String,
        specialty: String,
        opinion: String,
        date: Date,
        document: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MedicalRecord'
        }
    }],
    timeline: [{
        date: Date,
        event: String,
        significance: String,
        source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MedicalRecord'
        }
    }],
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    overallAssessment: String,
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

caseAnalysisSchema.index({ case: 1 });

module.exports = mongoose.model('CaseAnalysis', caseAnalysisSchema);
