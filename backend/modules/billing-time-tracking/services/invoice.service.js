const Invoice = require('../../../models/Invoice.model');
const TimeEntry = require('../../../models/TimeEntry.model');
const Case = require('../../../models/Case.model');

class InvoiceService {
    async generateInvoiceNumber() {
        const count = await Invoice.countDocuments();
        const year = new Date().getFullYear();
        return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
    }

    async createInvoiceFromTimeEntries(caseId, timeEntryIds, options, userId) {
        const caseData = await Case.findById(caseId)
            .populate('client')
            .populate('lawFirm');

        if (!caseData) {
            throw new Error('Case not found');
        }

        const timeEntries = await TimeEntry.find({
            _id: { $in: timeEntryIds },
            case: caseId,
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
        const taxAmount = (subtotal * (options.taxRate || 0)) / 100;
        const totalAmount = subtotal + taxAmount - (options.discount || 0) - (options.retainerApplied || 0);

        const invoice = new Invoice({
            case: caseId,
            client: caseData.client._id,
            lawFirm: caseData.lawFirm?._id,
            timeEntries: timeEntryIds,
            lineItems,
            subtotal,
            taxRate: options.taxRate || 0,
            taxAmount,
            discount: options.discount || 0,
            retainerApplied: options.retainerApplied || 0,
            totalAmount,
            billingPeriod: options.billingPeriod || {
                startDate: timeEntries[timeEntries.length - 1].date,
                endDate: timeEntries[0].date
            },
            dueDate: options.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            notes: options.notes,
            terms: options.terms || 'Payment due within 30 days',
            createdBy: userId
        });

        await invoice.save();

        // Mark time entries as invoiced
        await TimeEntry.updateMany(
            { _id: { $in: timeEntryIds } },
            { $set: { isInvoiced: true, invoice: invoice._id } }
        );

        return invoice;
    }

    async addLineItemToInvoice(invoiceId, lineItem) {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        if (invoice.status === 'paid' || invoice.status === 'void') {
            throw new Error(`Cannot modify ${invoice.status} invoice`);
        }

        invoice.lineItems.push(lineItem);
        invoice.subtotal += lineItem.amount;
        await invoice.save();

        return invoice;
    }

    async recordPayment(invoiceId, paymentData) {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        invoice.amountPaid += paymentData.amount;
        invoice.paymentMethod = paymentData.paymentMethod;
        invoice.paymentReference = paymentData.paymentReference;

        if (invoice.amountPaid >= invoice.totalAmount) {
            invoice.status = 'paid';
            invoice.paidDate = paymentData.paymentDate || new Date();
        } else if (invoice.amountPaid > 0) {
            invoice.status = 'partial';
        }

        await invoice.save();
        return invoice;
    }

    async voidInvoice(invoiceId) {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        invoice.status = 'void';
        await invoice.save();

        // Unmark time entries
        await TimeEntry.updateMany(
            { invoice: invoiceId },
            { $set: { isInvoiced: false }, $unset: { invoice: 1 } }
        );

        return invoice;
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

        const [totalInvoices, paidInvoices, overdueInvoices, revenueData, outstandingData] = await Promise.all([
            Invoice.countDocuments(query),
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
            paidInvoices,
            overdueInvoices,
            totalRevenue: revenueData[0]?.total || 0,
            outstandingBalance: outstandingData[0]?.total || 0
        };
    }

    async markOverdueInvoices() {
        const result = await Invoice.updateMany(
            {
                status: { $nin: ['paid', 'cancelled', 'void', 'overdue'] },
                dueDate: { $lt: new Date() }
            },
            { $set: { status: 'overdue' } }
        );

        return result.modifiedCount;
    }
}

module.exports = new InvoiceService();
