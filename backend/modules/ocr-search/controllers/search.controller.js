const MedicalRecord = require('../../../models/MedicalRecord.model');
const SearchHistory = require('../../../models/SearchHistory.model');

// Search medical records
exports.searchRecords = async (req, res, next) => {
    try {
        const { query, caseId, documentType, dateFrom, dateTo, page = 1, limit = 20 } = req.body;

        const searchQuery = { isDeleted: false };

        // Search in OCR text, file name, and metadata
        if (query) {
            searchQuery.$or = [
                { ocrText: { $regex: query, $options: 'i' } },
                { fileName: { $regex: query, $options: 'i' } },
                { 'metadata.diagnosis': { $regex: query, $options: 'i' } },
                { 'metadata.provider': { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ];
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
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('fileName fileType documentType recordDate pageCount ocrText ocrStatus case uploadedBy createdAt');

        const total = await MedicalRecord.countDocuments(searchQuery);

        // Save search history (don't let this fail the search)
        if (query && req.user && req.user._id) {
            try {
                const filters = {};
                if (caseId && caseId.trim()) filters.caseId = caseId;
                if (documentType) filters.documentType = documentType;
                if (dateFrom || dateTo) {
                    filters.dateRange = {};
                    if (dateFrom) filters.dateRange.start = dateFrom;
                    if (dateTo) filters.dateRange.end = dateTo;
                }

                await SearchHistory.create({
                    user: req.user._id,
                    query: query,
                    filters: filters,
                    resultsCount: total
                });
            } catch (historyError) {
                console.error('Failed to save search history:', historyError);
                // Continue without failing the search
            }
        }

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
