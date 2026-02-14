const MedicalRecord = require('../../../models/MedicalRecord.model');
const SearchHistory = require('../../../models/SearchHistory.model');

// Search medical records
exports.searchRecords = async (req, res, next) => {
    try {
        const { query, caseId, documentType, dateFrom, dateTo, page = 1, limit = 20 } = req.body;

        const searchQuery = { isDeleted: false };

        if (query) {
            searchQuery.$text = { $search: query };
        }
        if (caseId) searchQuery.case = caseId;
        if (documentType) searchQuery.documentType = documentType;
        if (dateFrom || dateTo) {
            searchQuery.recordDate = {};
            if (dateFrom) searchQuery.recordDate.$gte = new Date(dateFrom);
            if (dateTo) searchQuery.recordDate.$lte = new Date(dateTo);
        }

        const records = await MedicalRecord.find(searchQuery)
            .populate('case', 'caseNumber caseName')
            .populate('uploadedBy', 'fullName')
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await MedicalRecord.countDocuments(searchQuery);

        // Save search history
        await SearchHistory.create({
            user: req.user._id,
            query: query || '',
            filters: { caseId, documentType, dateRange: { start: dateFrom, end: dateTo } },
            resultsCount: total
        });

        res.status(200).json({
            success: true,
            data: {
                records,
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

// Get search suggestions
exports.getSuggestions = async (req, res, next) => {
    try {
        const { query } = req.query;

        const suggestions = await MedicalRecord.aggregate([
            {
                $match: {
                    isDeleted: false,
                    $or: [
                        { fileName: { $regex: query, $options: 'i' } },
                        { 'metadata.diagnosis': { $regex: query, $options: 'i' } },
                        { tags: { $regex: query, $options: 'i' } }
                    ]
                }
            },
            { $limit: 10 },
            {
                $project: {
                    fileName: 1,
                    'metadata.diagnosis': 1,
                    tags: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: { suggestions }
        });
    } catch (error) {
        next(error);
    }
};

// Get search history
exports.getSearchHistory = async (req, res, next) => {
    try {
        const history = await SearchHistory.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            data: { history }
        });
    } catch (error) {
        next(error);
    }
};
