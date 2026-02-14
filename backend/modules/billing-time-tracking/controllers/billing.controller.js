const billingService = require('../services/billing.service');
const invoiceService = require('../services/invoice.service');
const timeTrackingService = require('../services/timeTracking.service');

exports.getBillingStats = async (req, res, next) => {
    try {
        const { startDate, endDate, caseId, clientId } = req.query;

        const stats = await billingService.getInvoiceStats({
            startDate,
            endDate,
            caseId,
            clientId
        });

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.getCaseBillingSummary = async (req, res, next) => {
    try {
        const { caseId } = req.params;

        const [timeSummary, invoiceSummary] = await Promise.all([
            billingService.calculateCaseBillingSummary(caseId),
            billingService.getCaseInvoiceSummary(caseId)
        ]);

        res.json({
            timeTracking: timeSummary,
            invoicing: invoiceSummary
        });
    } catch (error) {
        next(error);
    }
};

exports.getUnbilledWork = async (req, res, next) => {
    try {
        const { caseId } = req.params;

        const unbilledEntries = await billingService.getUnbilledTimeEntries(caseId);
        const summary = await timeTrackingService.calculateTimeSummary(unbilledEntries);

        res.json({
            entries: unbilledEntries,
            summary
        });
    } catch (error) {
        next(error);
    }
};

exports.getRevenueReport = async (req, res, next) => {
    try {
        const { startDate, endDate, groupBy = 'month' } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const revenue = await billingService.getRevenueByPeriod(startDate, endDate, groupBy);

        res.json(revenue);
    } catch (error) {
        next(error);
    }
};

exports.getAgingReport = async (req, res, next) => {
    try {
        const agingData = await billingService.getAgingReport();
        res.json(agingData);
    } catch (error) {
        next(error);
    }
};

exports.getTopBillingCases = async (req, res, next) => {
    try {
        const { limit = 10, startDate, endDate } = req.query;

        const topCases = await billingService.getTopBillingCases(
            parseInt(limit),
            startDate,
            endDate
        );

        res.json(topCases);
    } catch (error) {
        next(error);
    }
};

exports.getUserBillingStats = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        const stats = await billingService.getUserBillingSummary(userId, startDate, endDate);

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.getBillableRates = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const rates = await billingService.getBillableRatesByUser(startDate, endDate);

        res.json(rates);
    } catch (error) {
        next(error);
    }
};

exports.markOverdueInvoices = async (req, res, next) => {
    try {
        const count = await invoiceService.markOverdueInvoices();

        res.json({
            message: `${count} invoices marked as overdue`,
            count
        });
    } catch (error) {
        next(error);
    }
};

exports.generateBillingReport = async (req, res, next) => {
    try {
        const { caseId, startDate, endDate } = req.query;

        const timeEntries = await timeTrackingService.getTimeEntriesByDateRange({
            caseId,
            startDate,
            endDate,
            isBillable: true
        });

        const summary = await timeTrackingService.calculateTimeSummary(timeEntries);

        const invoiceStats = await billingService.getInvoiceStats({
            caseId,
            startDate,
            endDate
        });

        res.json({
            timeEntries,
            summary,
            invoiceStats,
            period: { startDate, endDate }
        });
    } catch (error) {
        next(error);
    }
};
