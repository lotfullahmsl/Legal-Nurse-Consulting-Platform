const mongoose = require('mongoose');
const CaseAnalysis = require('../../../models/CaseAnalysis.model');
const Damages = require('../../../models/Damages.model');
const AppError = require('../../../shared/errors/AppError');

// Get case analysis
exports.getAnalysis = async (req, res, next) => {
    try {
        let analysis = await CaseAnalysis.findOne({ case: req.params.caseId })
            .populate('case', 'caseNumber caseName title')
            .populate('lastUpdatedBy', 'fullName')
            .populate('breaches.evidence')
            .populate('expertOpinions.document');

        if (!analysis) {
            // Create empty analysis if doesn't exist
            analysis = await CaseAnalysis.create({
                case: req.params.caseId,
                lastUpdatedBy: req.user._id
            });

            // Populate after creation
            analysis = await CaseAnalysis.findById(analysis._id)
                .populate('case', 'caseNumber caseName title')
                .populate('lastUpdatedBy', 'fullName');
        }

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        next(error);
    }
};

// Create or update analysis
exports.upsertAnalysis = async (req, res, next) => {
    try {
        const analysisData = {
            ...req.body,
            case: req.body.caseId || req.body.case,
            lastUpdatedBy: req.user._id
        };

        const analysis = await CaseAnalysis.findOneAndUpdate(
            { case: analysisData.case },
            analysisData,
            { new: true, upsert: true, runValidators: true }
        ).populate('case', 'caseNumber caseName title')
            .populate('lastUpdatedBy', 'fullName');

        res.status(200).json({
            success: true,
            message: 'Case analysis updated successfully',
            data: { analysis }
        });
    } catch (error) {
        next(error);
    }
};

// Alias for create
exports.createAnalysis = exports.upsertAnalysis;

// Get damages for case
exports.getDamages = async (req, res, next) => {
    try {
        const damages = await Damages.find({ case: req.params.caseId })
            .populate('createdBy', 'fullName')
            .populate('supportingDocuments')
            .sort({ createdAt: -1 });

        const summary = await Damages.aggregate([
            { $match: { case: new mongoose.Types.ObjectId(req.params.caseId) } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                damages,
                summary
            }
        });
    } catch (error) {
        next(error);
    }
};

// Add damage entry
exports.addDamage = async (req, res, next) => {
    try {
        const damageData = {
            ...req.body,
            createdBy: req.user._id
        };

        const damage = await Damages.create(damageData);
        await damage.populate('createdBy', 'fullName');

        res.status(201).json({
            success: true,
            message: 'Damage entry added successfully',
            data: { damage }
        });
    } catch (error) {
        next(error);
    }
};

// Update damage
exports.updateDamage = async (req, res, next) => {
    try {
        const damage = await Damages.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy');

        if (!damage) {
            throw new AppError('Damage entry not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Damage entry updated successfully',
            data: { damage }
        });
    } catch (error) {
        next(error);
    }
};

// Delete damage
exports.deleteDamage = async (req, res, next) => {
    try {
        const damage = await Damages.findByIdAndDelete(req.params.id);

        if (!damage) {
            throw new AppError('Damage entry not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Damage entry deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
