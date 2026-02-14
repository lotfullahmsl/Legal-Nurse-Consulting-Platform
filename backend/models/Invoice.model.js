const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    case: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: true,
        index: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    lawFirm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LawFirm'
    },
    billingPeriod: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    timeEntries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeEntry'
    }],
    lineItems: [{
        description: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 0
        },
        rate: {
            type: Number,
            required: true,
            min: 0
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        type: {
            type: String,
            enum: ['time', 'expense', 'fee', 'adjustment'],
            default: 'time'
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    taxRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    taxAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    amountPaid: {
        type: Number,
        default: 0,
        min: 0
    },
    balanceDue: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled', 'void'],
        default: 'draft',
        index: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    sentDate: {
        type: Date
    },
    paidDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ['check', 'wire', 'credit-card', 'ach', 'cash', 'other']
    },
    paymentReference: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    terms: {
        type: String,
        trim: true,
        default: 'Payment due within 30 days'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    retainerApplied: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Auto-generate invoice number
invoiceSchema.pre('save', async function (next) {
    if (this.isNew && !this.invoiceNumber) {
        const count = await mongoose.model('Invoice').countDocuments();
        const year = new Date().getFullYear();
        this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
    }

    // Calculate totals
    if (this.isModified('subtotal') || this.isModified('taxRate') || this.isModified('discount') || this.isModified('retainerApplied')) {
        this.taxAmount = (this.subtotal * this.taxRate) / 100;
        this.totalAmount = this.subtotal + this.taxAmount - this.discount - this.retainerApplied;
        this.balanceDue = this.totalAmount - this.amountPaid;
    }

    // Update status based on payment
    if (this.isModified('amountPaid')) {
        this.balanceDue = this.totalAmount - this.amountPaid;
        if (this.amountPaid >= this.totalAmount) {
            this.status = 'paid';
            this.paidDate = new Date();
        } else if (this.amountPaid > 0) {
            this.status = 'partial';
        }
    }

    // Check if overdue
    if (this.status !== 'paid' && this.status !== 'cancelled' && this.status !== 'void') {
        if (new Date() > this.dueDate) {
            this.status = 'overdue';
        }
    }

    next();
});

// Indexes for performance
invoiceSchema.index({ case: 1, issueDate: -1 });
invoiceSchema.index({ client: 1, status: 1 });
invoiceSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
