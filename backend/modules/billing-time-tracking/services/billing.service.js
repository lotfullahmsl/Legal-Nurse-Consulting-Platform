const TimeEntry = require('../../../models/TimeEntry.model');
const Invoice = require('../../../models/Invoice.model');
const Case = require('../../../models/Case.model');
const User = require('../../../models/User.model');

class BillingService {
    // Time Entry Services
    async calculateTimeEntryAmount(hours, minutes, billableRate) {
        const totalHours = hours + (minutes / 60);
        return totalHours * billableRate;
    }

    async getUnbilledTimeEntries(caseId) {
        return await TimeEntry.find({
            case: caseId,
            isBillable: true,
            isInvoiced: false
        })
            .populate('user', 'name email')
            .populate('task', 'title')
            .sort({ date: -1 });
    }

    async getTimeEntriesByDateRange(caseId, startDate, endDate) {
        const filter = { case: caseId };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        return await TimeEntry.find(filter)
            .populate('user', 'name email')
            .sort({ date: -1 });
    }

    async calculateCaseBillingSummary(caseId) {
        const timeEntries = await TimeEntry.find({ case: caseId });
        
        const totalHours = timeEntries.reduce((sum, entry) => 
            sum + entry.hours + (entry.minutes / 60), 0
        );
        
        const totalAmount = timeEntries.reduce((sum, entry) => 
            sum + entry.totalAmount, 0
        );
        
        const billableEntries = timeEntries.filter(e => e.isBillable);
        const billableHours = billableEntries.reduce((sum, entry) => 
            sum + entry.hours + (entry.minutes / 60), 0
        );
        
        const billableAmount = billableEntries.reduce((sum, entry) => 
            sum + entry.totalAmount, 0
        );
        
        const unbilledEntries = timeEntries.filter(e => !e.isInvoiced && e.isBillable);
        const unbilledAmount = unbilledEntries.reduce((sum, entry) => 
            sum + entry.totalAmount, 0
        );
        
        const invoicedAmount = timeEntries
            .filter(e => e.isInvoiced)
            .reduce((sum, entry) => sum + entry.totalAmount, 0);

        return {
            totalHours: totalHours.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            billableHours: billableHours.toFixed(2),
            billableAmount: billableAmount.toFixed(2),
            unbilledAmount: unbilledAmount.toFixed(2),
            invoicedAmount: invoicedAmount.toFixed(2),
            totalEntries: timeEntries.length,
            unbilledEntries: unbilledEntries.length
        };
    }

    async getUserBillingSummary(userId, startDate, endDate) {
        const filter = { user: userId };
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const timeEntries = await TimeEntry.find(filter);
        
        const totalHours = timeEntries.reduce((sum, entry) => 
            sum + entry.hours + (entry.minutes / 60), 0
        );
        
        const totalAmount = timeEntries.reduce((sum, entry) => 
            sum + entry.totalAmount, 0
        );

        const byActivityType = {};
        timeEntries.forEach(entry => {
            if (!byActivityType[entry.activityType]) {
                byActivityType[entry.activityType] = {
                    hours: 0,
                    amount: 0,
                    count: 0
                };
            }
            byActivityType[entry.activityType].hours += entry.hours + (entry.minutes / 60);
            byActivityType[entry.activityType].amount += entry.totalAmount;
            byActivityType[entry.activityType].count += 1;
        });

        return {
            totalHours: totalHours.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            totalEntries: timeEntries.length,
            byActivityType
        };
    }

    // Invoice Services
    async generateInvoiceNumber() {
        const count = await Invoice.countDocuments();
        const year = new Date().getFullYear();
        return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
    }

    async calculateInvoiceTotals(subtotal, taxRate = 0, discount = 0, retainerApplied = 0) {
        const taxAmount = (subtotal * taxRate) / 100;
        const totalAmount = subtotal + taxAmount - discount - retainerApplied;
        
        return {
            subtotal,
            taxRate,
            taxAmount,
            discount,
            retainerApplied,
            totalAmount,
            balanceDue: totalAmount
        };
    }

    async createInvoiceFromTimeEntries(caseId, timeEntryIds, options = {}) {
        const caseData = await Case.findById(caseId)
            .populate('client')
            .populate('lawFirm');
        
        if (!caseData) {
            throw new Error('Case not found');
        }

        const timeEntries = await TimeEntry.find({
            _id: { $in: timeEntryIds },
            isInvoiced: false,
            isBillable: true
        }).populate('user', 'name');

        if (timeEntries.length === 0) {
            throw new Error('No billable time entries found');
        }

        const lineItems = timeEntries.map(entry => ({
            description: `${entry.user.name} - ${entry.description} (${entry.hours}h ${entry.minutes}m)`,
            quantity: entry.hours + (entry.minutes / 60),
            rate: entry.billableRate,
            amount: entry.totalAmount,
            type: 'time'
        }));

        const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);

        const totals = await this.calculateInvoiceTotals(
            subtotal,
            options.taxRate || 0,
            options.discount || 0,
            options.retainerApplied || 0
        );

        return {
            case: caseId,
            client: caseData.client._id,
            lawFirm: caseData.lawFirm?._id,
            timeEntries: timeEntryIds,
            lineItems,
            ...totals,
            billingPeriod: options.billingPeriod || {
                startDate: timeEntries[timeEntries.length - 1].date,
                endDate: timeEntries[0].date
            },
            dueDate: options.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            notes: options.notes,
            terms: options.terms || 'Payment due within 30 days'
        };
    }

    async getInvoiceStats(filters = {}) {
        const query = {};
        if (filters.startDate || filters.endDate) {
            query.issueDate = {};
            if (filters.startDate) query.issueDate.$gte = new Date(filters.startDate);
            if (filters.endDate) query.issueDate.$lte = new Date(filters.endDate);
        }
        if (filters.caseId) query.case = filters.caseId;
        if (filters.clientId) query.client = filters.clientId;

        const [
            totalInvoices,
            draftInvoices,
            sentInvoices,
            paidInvoices,
            overdueInvoices,
            revenueData,
            outstandingData
        ] = await Promise.all([
            Invoice.countDocuments(query),
            Invoice.countDocuments({ ...query, status: 'draft' }),
            Invoice.countDocuments({ ...query, status: 'sent' }),
            Invoice.countDocuments({ ...query, status: 'paid' }),
            Invoice.countDocuments({ ...query, status: 'overdue' }),
            Invoice.aggregate([
                { $match: { ...query, status: { $in: ['paid', 'partial'] } } },
                { $group: { _id: null, total: { $sum: '$amountPaid' } } }
            ]),
            Invoice.aggregate([
                { $match: { ...query, status: { $nin: ['paid', 'void', 'cancelled'] } } },
                { $group: { _id: null, total: { $sum: '$balanceDue' } } }
            ])
        ]);

        return {
            totalInvoices,
            draftInvoices,
            sentInvoices,
            paidInvoices,
            overdueInvoices,
            totalRevenue: revenueData[0]?.total || 0,
            outstandingBalance: outstandingData[0]?.total || 0
        };
    }

    async getCaseInvoiceSummary(caseId) {
        const invoices = await Invoice.find({ case: caseId });
        
        const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
        const outstanding = totalBilled - totalPaid;

        const byStatus = {};
        invoices.forEach(inv => {
            if (!byStatus[inv.status]) {
                byStatus[inv.status] = {
                    count: 0,
                    amount: 0
                };
            }
            byStatus[inv.status].count += 1;
            byStatus[inv.status].amount += inv.totalAmount;
        });

        return {
            totalInvoices: invoices.length,
            totalBilled: totalBilled.toFixed(2),
            totalPaid: totalPaid.toFixed(2),
            outstanding: outstanding.toFixed(2),
            byStatus
        };
    }

    async markInvoiceOverdue() {
        const overdueInvoices = await Invoice.find({
            status: { $nin: ['paid', 'cancelled', 'void', 'overdue'] },
            dueDate: { $lt: new Date() }
        });

        for (const invoice of overdueInvoices) {
            invoice.status = 'overdue';
            await invoice.save();
        }

        return overdueInvoices.length;
    }

    async getRevenueByPeriod(startDate, endDate, groupBy = 'month') {
        const matchStage = {
            status: { $in: ['paid', 'partial'] },
            paidDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        };

        let groupFormat;
        switch (groupBy) {
            case 'day':
                groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$paidDate' } };
                break;
            case 'week':
                groupFormat = { $week: '$paidDate' };
                break;
            case 'year':
                groupFormat = { $year: '$paidDate' };
                break;
            default: // month
                groupFormat = { $dateToString: { format: '%Y-%m', date: '$paidDate' } };
        }

        const revenue = await Invoice.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: groupFormat,
                    totalRevenue: { $sum: '$amountPaid' },
                    invoiceCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return revenue;
    }

    async getTopBillingCases(limit = 10, startDate, endDate) {
        const matchStage = {};
        if (startDate || endDate) {
            matchStage.issueDate = {};
            if (startDate) matchStage.issueDate.$gte = new Date(startDate);
            if (endDate) matchStage.issueDate.$lte = new Date(endDate);
        }

        const topCases = await Invoice.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$case',
                    totalBilled: { $sum: '$totalAmount' },
                    totalPaid: { $sum: '$amountPaid' },
                    invoiceCount: { $sum: 1 }
                }
            },
            { $sort: { totalBilled: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'cases',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'caseDetails'
                }
            },
            { $unwind: '$caseDetails' }
        ]);

        return topCases;
    }

    async getAgingReport() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        const [current, thirtyDays, sixtyDays, ninetyDays, overNinety] = await Promise.all([
            Invoice.aggregate([
                { $match: { status: { $nin: ['paid', 'void', 'cancelled'] }, dueDate: { $gte: now } } },
                { $group: { _id: null, total: { $sum: '$balanceDue' }, count: { $sum: 1 } } }
            ]),
            Invoice.aggregate([
                { $match: { status: { $nin: ['paid', 'void', 'cancelled'] }, dueDate: { $gte: thirtyDaysAgo, $lt: now } } },
                { $group: { _id: null, total: { $sum: '$balanceDue' }, count: { $sum: 1 } } }
            ]),
            Invoice.aggregate([
                { $match: { status: { $nin: ['paid', 'void', 'cancelled'] }, dueDate: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
                { $group: { _id: null, total: { $sum: '$balanceDue' }, count: { $sum: 1 } } }
            ]),
            Invoice.aggregate([
                { $match: { status: { $nin: ['paid', 'void', 'cancelled'] }, dueDate: { $gte: ninetyDaysAgo, $lt: sixtyDaysAgo } } },
                { $group: { _id: null, total: { $sum: '$balanceDue' }, count: { $sum: 1 } } }
            ]),
            Invoice.aggregate([
                { $match: { status: { $nin: ['paid', 'void', 'cancelled'] }, dueDate: { $lt: ninetyDaysAgo } } },
                { $group: { _id: null, total: { $sum: '$balanceDue' }, count: { $sum: 1 } } }
            ])
        ]);

        return {
            current: { amount: current[0]?.total || 0, count: current[0]?.count || 0 },
            '1-30days': { amount: thirtyDays[0]?.total || 0, count: thirtyDays[0]?.count || 0 },
            '31-60days': { amount: sixtyDays[0]?.total || 0, count: sixtyDays[0]?.count || 0 },
            '61-90days': { amount: ninetyDays[0]?.total || 0, count: ninetyDays[0]?.count || 0 },
            'over90days': { amount: overNinety[0]?.total || 0, count: overNinety[0]?.count || 0 }
        };
    }

    async getBillableRatesByUser(startDate, endDate) {
        const matchStage = {};
        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) matchStage.date.$lte = new Date(endDate);
        }

        const rates = await TimeEntry.aggregate([
            { $match: { ...matchStage, isBillable: true } },
            {
                $group: {
                    _id: '$user',
                    avgRate: { $avg: '$billableRate' },
                    minRate: { $min: '$billableRate' },
                    maxRate: { $max: '$billableRate' },
                    totalHours: { $sum: { $add: ['$hours', { $divide: ['$minutes', 60] }] } },
                    totalAmount: { $sum: '$totalAmount' },
                    entryCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            { $sort: { totalAmount: -1 } }
        ]);

        return rates;
    }
}

module.exports = new BillingService();
