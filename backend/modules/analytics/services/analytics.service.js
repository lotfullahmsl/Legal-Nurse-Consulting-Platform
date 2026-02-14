const Case = require('../../../models/Case.model');
const TimeEntry = require('../../../models/TimeEntry.model');
const Invoice = require('../../../models/Invoice.model');
const Task = require('../../../models/Task.model');
const Client = require('../../../models/Client.model');

exports.getCaseAnalytics = async ({ startDate, endDate, status, caseType }) => {
    const filter = {};
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (status) filter.status = status;
    if (caseType) filter.caseType = caseType;

    const totalCases = await Case.countDocuments(filter);
    const casesByStatus = await Case.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const casesByType = await Case.aggregate([
        { $match: filter },
        { $group: { _id: '$caseType', count: { $sum: 1 } } }
    ]);

    const avgCaseDuration = await Case.aggregate([
        { $match: { ...filter, closedDate: { $exists: true } } },
        {
            $project: {
                duration: {
                    $divide: [
                        { $subtract: ['$closedDate', '$createdAt'] },
                        1000 * 60 * 60 * 24
                    ]
                }
            }
        },
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
    ]);

    return {
        totalCases,
        casesByStatus,
        casesByType,
        avgCaseDuration: avgCaseDuration[0]?.avgDuration || 0
    };
};

exports.getRevenueAnalytics = async ({ startDate, endDate, groupBy }) => {
    const filter = {};
    if (startDate || endDate) {
        filter.issueDate = {};
        if (startDate) filter.issueDate.$gte = new Date(startDate);
        if (endDate) filter.issueDate.$lte = new Date(endDate);
    }

    const groupByFormat = groupBy === 'month'
        ? { year: { $year: '$issueDate' }, month: { $month: '$issueDate' } }
        : { year: { $year: '$issueDate' }, week: { $week: '$issueDate' } };

    const revenueByPeriod = await Invoice.aggregate([
        { $match: filter },
        {
            $group: {
                _id: groupByFormat,
                totalRevenue: { $sum: '$totalAmount' },
                paidRevenue: { $sum: '$amountPaid' },
                invoiceCount: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const totalRevenue = await Invoice.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, paid: { $sum: '$amountPaid' } } }
    ]);

    const outstandingBalance = await Invoice.aggregate([
        { $match: { ...filter, status: { $nin: ['paid', 'void'] } } },
        { $group: { _id: null, total: { $sum: '$balanceDue' } } }
    ]);

    return {
        revenueByPeriod,
        totalRevenue: totalRevenue[0] || { total: 0, paid: 0 },
        outstandingBalance: outstandingBalance[0]?.total || 0
    };
};

exports.getWorkloadAnalytics = async ({ startDate, endDate, userId }) => {
    const filter = {};
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (userId) filter.assignedTo = userId;

    const tasksByUser = await Task.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$assignedTo',
                totalTasks: { $sum: 1 },
                completedTasks: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                overdueTasks: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $lt: ['$dueDate', new Date()] },
                                    { $ne: ['$status', 'completed'] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                userId: '$_id',
                userName: '$user.name',
                totalTasks: 1,
                completedTasks: 1,
                overdueTasks: 1,
                completionRate: {
                    $multiply: [
                        { $divide: ['$completedTasks', '$totalTasks'] },
                        100
                    ]
                }
            }
        }
    ]);

    const timeEntriesByUser = await TimeEntry.aggregate([
        { $match: filter },
        {
            $group: {
                _id: '$user',
                totalHours: {
                    $sum: { $add: ['$hours', { $divide: ['$minutes', 60] }] }
                },
                billableHours: {
                    $sum: {
                        $cond: [
                            '$isBillable',
                            { $add: ['$hours', { $divide: ['$minutes', 60] }] },
                            0
                        ]
                    }
                }
            }
        }
    ]);

    return {
        tasksByUser,
        timeEntriesByUser
    };
};

exports.getReferralAnalytics = async ({ startDate, endDate }) => {
    const filter = {};
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const referralSources = await Client.aggregate([
        { $match: filter },
        { $group: { _id: '$referralSource', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    const topReferrers = await Client.aggregate([
        { $match: filter },
        { $group: { _id: '$referredBy', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    return {
        referralSources,
        topReferrers
    };
};

exports.getPerformanceMetrics = async ({ startDate, endDate, userId }) => {
    const filter = {};
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const caseMetrics = await Case.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                avgResponseTime: { $avg: '$responseTime' },
                avgResolutionTime: { $avg: '$resolutionTime' }
            }
        }
    ]);

    const taskMetrics = await Task.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                completedOnTime: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$status', 'completed'] },
                                    { $lte: ['$completedDate', '$dueDate'] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const onTimeRate = taskMetrics[0]
        ? (taskMetrics[0].completedOnTime / taskMetrics[0].totalTasks) * 100
        : 0;

    return {
        caseMetrics: caseMetrics[0] || {},
        taskMetrics: taskMetrics[0] || {},
        onTimeCompletionRate: onTimeRate
    };
};

exports.exportAnalytics = async ({ type, format, startDate, endDate }) => {
    let data;

    switch (type) {
        case 'cases':
            data = await exports.getCaseAnalytics({ startDate, endDate });
            break;
        case 'revenue':
            data = await exports.getRevenueAnalytics({ startDate, endDate });
            break;
        case 'workload':
            data = await exports.getWorkloadAnalytics({ startDate, endDate });
            break;
        case 'referrals':
            data = await exports.getReferralAnalytics({ startDate, endDate });
            break;
        default:
            data = {};
    }

    return data;
};
