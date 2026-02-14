const LawFirm = require('../../../models/LawFirm.model');
const AppError = require('../../../shared/errors/AppError');

// Get all law firms
exports.getAllLawFirms = async (req, res, next) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (search) query.$text = { $search: search };

        const lawFirms = await LawFirm.find(query)
            .populate('createdBy', 'fullName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LawFirm.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                lawFirms,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get law firm by ID
exports.getLawFirmById = async (req, res, next) => {
    try {
        const lawFirm = await LawFirm.findById(req.params.id)
            .populate('createdBy', 'fullName email');

        if (!lawFirm) {
            throw new AppError('Law firm not found', 404);
        }

        res.status(200).json({
            success: true,
            data: { lawFirm }
        });
    } catch (error) {
        next(error);
    }
};

// Create new law firm
exports.createLawFirm = async (req, res, next) => {
    try {
        const lawFirmData = {
            ...req.body,
            createdBy: req.user._id
        };

        const lawFirm = await LawFirm.create(lawFirmData);

        res.status(201).json({
            success: true,
            message: 'Law firm created successfully',
            data: { lawFirm }
        });
    } catch (error) {
        if (error.code === 11000) {
            return next(new AppError('Law firm with this email already exists', 400));
        }
        next(error);
    }
};

// Update law firm
exports.updateLawFirm = async (req, res, next) => {
    try {
        const lawFirm = await LawFirm.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!lawFirm) {
            throw new AppError('Law firm not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Law firm updated successfully',
            data: { lawFirm }
        });
    } catch (error) {
        next(error);
    }
};

// Delete law firm
exports.deleteLawFirm = async (req, res, next) => {
    try {
        const lawFirm = await LawFirm.findByIdAndDelete(req.params.id);

        if (!lawFirm) {
            throw new AppError('Law firm not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Law firm deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
