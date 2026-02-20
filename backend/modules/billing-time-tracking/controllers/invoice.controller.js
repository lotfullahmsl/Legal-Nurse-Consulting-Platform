const Invoice = require('../../../models/Invoice.model');
const TimeEntry = require('../../../models/TimeEntry.model');
const Case = require('../../../models/Case.model');
const Client = require('../../../models/Client.model');

exports.getAllInvoices = async (req, res, next) => {
    try {
        const { status, case: caseId, client: clientId, startDate, endDate, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (caseId) filter.case = caseId;
        if (clientId) filter.client = clientId;
        if (startDate || endDate) {
            filter.issueDate = {};
            if (startDate) filter.issueDate.$gte = new Date(startDate);
            if (endDate) filter.issueDate.$lte = new Date(endDate);
        }

        const invoices = await Invoice.find(filter)
            .populate('case', 'title caseNumber')
            .populate('client', 'name email')
            .populate('lawFirm', 'name')
            .populate('createdBy', 'name email')
            .sort({ issueDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Invoice.countDocuments(filter);

        res.json({
            invoices,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        next(error);
    }
};

exports.getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('case', 'title caseNumber')
            .populate('client', 'name email address phone')
            .populate('lawFirm', 'name address phone email')
            .populate('timeEntries')
            .populate('createdBy', 'name email');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        next(error);
    }
};

exports.generateInvoice = async (req, res, next) => {
    try {
        const { caseId, timeEntryIds, billingPeriod, dueDate, notes, terms, discount, taxRate, retainerApplied, lineItems } = req.body;

        const caseData = await Case.findById(caseId).populate('client').populate('lawFirm');
        if (!caseData) {
            return res.status(404).json({ message: 'Case not found' });
        }

        let invoiceLineItems = [];
        let subtotal = 0;

        // Handle manual invoice with provided line items
        if (lineItems && lineItems.length > 0) {
            invoiceLineItems = lineItems;
            subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
        }
        // Handle invoice from time entries
        else if (timeEntryIds && timeEntryIds.length > 0) {
            const timeEntries = await TimeEntry.find({
                _id: { $in: timeEntryIds },
                isInvoiced: false,
                isBillable: true
            }).populate('user', 'name');

            if (timeEntries.length === 0) {
                return res.status(400).json({ message: 'No billable time entries found' });
            }

            invoiceLineItems = timeEntries.map(entry => ({
                description: `${entry.user.name} - ${entry.description} (${entry.hours}h ${entry.minutes}m)`,
                quantity: entry.hours + (entry.minutes / 60),
                rate: entry.billableRate,
                amount: entry.totalAmount,
                type: 'time'
            }));

            subtotal = invoiceLineItems.reduce((sum, item) => sum + item.amount, 0);

            // Mark time entries as invoiced
            await TimeEntry.updateMany(
                { _id: { $in: timeEntryIds } },
                { $set: { isInvoiced: true } }
            );
        } else {
            return res.status(400).json({ message: 'Either timeEntryIds or lineItems must be provided' });
        }

        const invoice = new Invoice({
            case: caseId,
            client: caseData.client._id,
            lawFirm: caseData.lawFirm?._id,
            billingPeriod: billingPeriod || {
                startDate: new Date(),
                endDate: new Date()
            },
            timeEntries: timeEntryIds || [],
            lineItems: invoiceLineItems,
            subtotal,
            taxRate: taxRate || 0,
            discount: discount || 0,
            retainerApplied: retainerApplied || 0,
            dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            notes,
            terms,
            createdBy: req.user.id
        });

        await invoice.save();

        await invoice.populate('case', 'title caseNumber');
        await invoice.populate('client', 'name email');

        res.status(201).json(invoice);
    } catch (error) {
        next(error);
    }
};

exports.updateInvoice = async (req, res, next) => {
    try {
        const { dueDate, notes, terms, discount, taxRate, status } = req.body;

        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (invoice.status === 'paid' || invoice.status === 'void') {
            return res.status(400).json({ message: `Cannot update ${invoice.status} invoice` });
        }

        if (dueDate) invoice.dueDate = dueDate;
        if (notes !== undefined) invoice.notes = notes;
        if (terms) invoice.terms = terms;
        if (discount !== undefined) invoice.discount = discount;
        if (taxRate !== undefined) invoice.taxRate = taxRate;
        if (status) invoice.status = status;

        await invoice.save();
        await invoice.populate('case', 'title caseNumber');
        await invoice.populate('client', 'name email');

        res.json(invoice);
    } catch (error) {
        next(error);
    }
};

exports.sendInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        if (invoice.status === 'draft') {
            invoice.status = 'sent';
            invoice.sentDate = new Date();
            await invoice.save();
        }

        res.json({ message: 'Invoice sent successfully', invoice });
    } catch (error) {
        next(error);
    }
};

exports.recordPayment = async (req, res, next) => {
    try {
        const { amount, paymentMethod, paymentReference, paymentDate } = req.body;

        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.amountPaid += amount;
        invoice.paymentMethod = paymentMethod;
        invoice.paymentReference = paymentReference;

        if (invoice.amountPaid >= invoice.totalAmount) {
            invoice.status = 'paid';
            invoice.paidDate = paymentDate || new Date();
        } else {
            invoice.status = 'partial';
        }

        await invoice.save();
        await invoice.populate('case', 'title caseNumber');

        res.json(invoice);
    } catch (error) {
        next(error);
    }
};

exports.getInvoicesByCase = async (req, res, next) => {
    try {
        const invoices = await Invoice.find({ case: req.params.caseId })
            .populate('client', 'name email')
            .sort({ issueDate: -1 });

        const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
        const outstanding = totalBilled - totalPaid;

        res.json({
            invoices,
            summary: {
                totalBilled: totalBilled.toFixed(2),
                totalPaid: totalPaid.toFixed(2),
                outstanding: outstanding.toFixed(2)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getBillingStats = async (req, res, next) => {
    try {
        const totalInvoices = await Invoice.countDocuments();
        const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
        const overdueInvoices = await Invoice.countDocuments({ status: 'overdue' });

        const revenueData = await Invoice.aggregate([
            { $match: { status: { $in: ['paid', 'partial'] } } },
            { $group: { _id: null, total: { $sum: '$amountPaid' } } }
        ]);

        const outstandingData = await Invoice.aggregate([
            { $match: { status: { $nin: ['paid', 'void', 'cancelled'] } } },
            { $group: { _id: null, total: { $sum: '$balanceDue' } } }
        ]);

        res.json({
            totalInvoices,
            paidInvoices,
            overdueInvoices,
            totalRevenue: revenueData[0]?.total || 0,
            outstandingBalance: outstandingData[0]?.total || 0
        });
    } catch (error) {
        next(error);
    }
};

exports.voidInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.status = 'void';
        await invoice.save();

        await TimeEntry.updateMany(
            { invoice: invoice._id },
            { $set: { isInvoiced: false }, $unset: { invoice: 1 } }
        );

        res.json({ message: 'Invoice voided successfully', invoice });
    } catch (error) {
        next(error);
    }
};
