const Report = require('../../../models/Report.model');
const reportService = require('../services/report.service');

exports.getTemplates = async (req, res, next) => {
    try {
        const templates = [
            { id: 'attorney-summary', name: 'Attorney Summary Report', description: 'Comprehensive case summary for attorneys' },
            { id: 'chronology', name: 'Medical Chronology', description: 'Timeline of medical events' },
            { id: 'trial-brief', name: 'Trial Brief', description: 'Detailed trial preparation document' },
            { id: 'custom', name: 'Custom Report', description: 'Build your own report' }
        ];

        res.json(templates);
    } catch (error) {
        next(error);
    }
};

exports.generateReport = async (req, res, next) => {
    try {
        const { type, caseId, template, format, parameters } = req.body;

        const report = new Report({
            title: parameters?.title || `${type} Report`,
            type,
            case: caseId,
            template,
            format: format || 'pdf',
            parameters,
            generatedBy: req.user.id,
            status: 'generating'
        });

        await report.save();

        reportService.generateReportAsync(report._id, type, caseId, template, format, parameters)
            .catch(err => console.error('Report generation error:', err));

        res.status(202).json({
            message: 'Report generation started',
            reportId: report._id,
            status: 'generating'
        });
    } catch (error) {
        next(error);
    }
};

exports.getReportById = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('case', 'caseNumber caseName')
            .populate('generatedBy', 'name email');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        next(error);
    }
};

exports.getAllReports = async (req, res, next) => {
    try {
        const { case: caseId, type, status, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (caseId) filter.case = caseId;
        if (type) filter.type = type;
        if (status) filter.status = status;

        const reports = await Report.find(filter)
            .populate('case', 'caseNumber caseName')
            .populate('generatedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Report.countDocuments(filter);

        res.json({
            reports,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        next(error);
    }
};

exports.downloadReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.status !== 'completed') {
            return res.status(400).json({ message: 'Report is not ready for download' });
        }

        if (!report.fileUrl) {
            return res.status(404).json({ message: 'Report file not found' });
        }

        res.json({
            fileUrl: report.fileUrl,
            fileName: `${report.title}.${report.format}`,
            fileSize: report.fileSize
        });
    } catch (error) {
        next(error);
    }
};

exports.generateCustomReport = async (req, res, next) => {
    try {
        const { title, caseId, sections, format } = req.body;

        const report = new Report({
            title,
            type: 'custom',
            case: caseId,
            template: 'custom',
            format: format || 'pdf',
            parameters: { sections },
            generatedBy: req.user.id,
            status: 'generating'
        });

        await report.save();

        reportService.generateCustomReportAsync(report._id, caseId, sections, format)
            .catch(err => console.error('Custom report generation error:', err));

        res.status(202).json({
            message: 'Custom report generation started',
            reportId: report._id
        });
    } catch (error) {
        next(error);
    }
};

exports.getCaseReports = async (req, res, next) => {
    try {
        const reports = await Report.find({ case: req.params.caseId })
            .populate('generatedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        next(error);
    }
};

exports.deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        await report.deleteOne();

        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        next(error);
    }
};
