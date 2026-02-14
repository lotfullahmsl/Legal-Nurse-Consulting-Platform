const auditService = require('../services/audit.service');
const asyncHandler = require('../../../shared/utils/asyncHandler.util');

/**
 * @desc    Get all audit logs
 * @route   GET /api/audit/logs
 * @access  Private (Admin only)
 */
exports.getAuditLogs = asyncHandler(async (req, res) => {
    const filters = {
        userId: req.query.userId,
        caseId: req.query.caseId,
        action: req.query.action,
        resource: req.query.resource,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    };

    const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50
    };

    const result = await auditService.getAuditLogs(filters, pagination);

    res.status(200).json({
        success: true,
        data: result.logs,
        pagination: result.pagination
    });
});

/**
 * @desc    Get audit logs for a specific user
 * @route   GET /api/audit/user/:userId
 * @access  Private (Admin only)
 */
exports.getUserAuditLogs = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50
    };

    const result = await auditService.getUserAuditLogs(userId, pagination);

    res.status(200).json({
        success: true,
        data: result.logs,
        pagination: result.pagination
    });
});

/**
 * @desc    Get audit logs for a specific case
 * @route   GET /api/audit/case/:caseId
 * @access  Private (Admin, Attorney)
 */
exports.getCaseAuditLogs = asyncHandler(async (req, res) => {
    const { caseId } = req.params;
    const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 50
    };

    const result = await auditService.getCaseAuditLogs(caseId, pagination);

    res.status(200).json({
        success: true,
        data: result.logs,
        pagination: result.pagination
    });
});

/**
 * @desc    Export audit logs to CSV
 * @route   GET /api/audit/export
 * @access  Private (Admin only)
 */
exports.exportAuditLogs = asyncHandler(async (req, res) => {
    const filters = {
        userId: req.query.userId,
        caseId: req.query.caseId,
        action: req.query.action,
        resource: req.query.resource,
        startDate: req.query.startDate,
        endDate: req.query.endDate
    };

    const csv = await auditService.exportAuditLogs(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
    res.status(200).send(csv);
});

/**
 * @desc    Generate compliance report
 * @route   POST /api/audit/report
 * @access  Private (Admin only)
 */
exports.generateComplianceReport = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body;

    const report = await auditService.generateComplianceReport(startDate, endDate);

    res.status(200).json({
        success: true,
        data: report
    });
});

/**
 * @desc    Get audit statistics
 * @route   GET /api/audit/statistics
 * @access  Private (Admin only)
 */
exports.getAuditStatistics = asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days) || 30;

    const statistics = await auditService.getAuditStatistics(days);

    res.status(200).json({
        success: true,
        data: statistics
    });
});
