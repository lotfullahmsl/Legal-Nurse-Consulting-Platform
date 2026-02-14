const AuditLog = require('../../../models/AuditLog.model');

/**
 * Get all audit logs with filters
 */
exports.getAuditLogs = async (filters = {}, pagination = {}) => {
    const { page = 1, limit = 50 } = pagination;
    const query = {};

    // Apply filters
    if (filters.userId) query.userId = filters.userId;
    if (filters.caseId) query.caseId = filters.caseId;
    if (filters.action) query.action = filters.action;
    if (filters.resource) query.resource = filters.resource;

    if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
        if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        AuditLog.find(query)
            .populate('userId', 'firstName lastName email role')
            .populate('caseId', 'caseNumber title')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        AuditLog.countDocuments(query)
    ]);

    return {
        logs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Get audit logs for a specific user
 */
exports.getUserAuditLogs = async (userId, pagination = {}) => {
    const { page = 1, limit = 50 } = pagination;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        AuditLog.find({ userId })
            .populate('caseId', 'caseNumber title')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        AuditLog.countDocuments({ userId })
    ]);

    return {
        logs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Get audit logs for a specific case
 */
exports.getCaseAuditLogs = async (caseId, pagination = {}) => {
    const { page = 1, limit = 50 } = pagination;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        AuditLog.find({ caseId })
            .populate('userId', 'firstName lastName email role')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        AuditLog.countDocuments({ caseId })
    ]);

    return {
        logs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Export audit logs to CSV
 */
exports.exportAuditLogs = async (filters = {}) => {
    const query = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.caseId) query.caseId = filters.caseId;
    if (filters.action) query.action = filters.action;
    if (filters.resource) query.resource = filters.resource;

    if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
        if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
    }

    const logs = await AuditLog.find(query)
        .populate('userId', 'firstName lastName email role')
        .populate('caseId', 'caseNumber title')
        .sort({ timestamp: -1 })
        .lean();

    // Convert to CSV format
    const csvHeaders = ['Timestamp', 'User', 'Email', 'Role', 'Action', 'Resource', 'Case', 'IP Address', 'Details'];
    const csvRows = logs.map(log => [
        log.timestamp.toISOString(),
        log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'N/A',
        log.userId?.email || 'N/A',
        log.userId?.role || 'N/A',
        log.action,
        log.resource,
        log.caseId?.caseNumber || 'N/A',
        log.ipAddress || 'N/A',
        JSON.stringify(log.details || {})
    ]);

    const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
    return csv;
};

/**
 * Generate compliance report
 */
exports.generateComplianceReport = async (startDate, endDate) => {
    const query = {
        timestamp: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    };

    const [
        totalActions,
        actionsByType,
        actionsByUser,
        actionsByResource,
        failedLogins,
        dataAccess,
        dataModifications
    ] = await Promise.all([
        AuditLog.countDocuments(query),
        AuditLog.aggregate([
            { $match: query },
            { $group: { _id: '$action', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]),
        AuditLog.aggregate([
            { $match: query },
            { $group: { _id: '$userId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            }
        ]),
        AuditLog.aggregate([
            { $match: query },
            { $group: { _id: '$resource', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]),
        AuditLog.countDocuments({ ...query, action: 'login_failed' }),
        AuditLog.countDocuments({ ...query, action: { $regex: /^(view|read|access)/ } }),
        AuditLog.countDocuments({ ...query, action: { $regex: /^(create|update|delete)/ } })
    ]);

    return {
        period: { startDate, endDate },
        summary: {
            totalActions,
            failedLogins,
            dataAccess,
            dataModifications
        },
        actionsByType,
        actionsByUser: actionsByUser.map(item => ({
            user: item.user[0] ? `${item.user[0].firstName} ${item.user[0].lastName}` : 'Unknown',
            email: item.user[0]?.email,
            count: item.count
        })),
        actionsByResource
    };
};

/**
 * Get audit statistics
 */
exports.getAuditStatistics = async (days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
        totalLogs,
        uniqueUsers,
        uniqueCases,
        recentActions
    ] = await Promise.all([
        AuditLog.countDocuments({ timestamp: { $gte: startDate } }),
        AuditLog.distinct('userId', { timestamp: { $gte: startDate } }),
        AuditLog.distinct('caseId', { timestamp: { $gte: startDate } }),
        AuditLog.find({ timestamp: { $gte: startDate } })
            .sort({ timestamp: -1 })
            .limit(10)
            .populate('userId', 'firstName lastName')
            .lean()
    ]);

    return {
        totalLogs,
        uniqueUsers: uniqueUsers.length,
        uniqueCases: uniqueCases.length,
        recentActions
    };
};
