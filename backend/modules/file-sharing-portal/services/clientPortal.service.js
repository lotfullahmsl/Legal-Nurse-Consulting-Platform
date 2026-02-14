const Case = require('../../../models/Case.model');
const FileShare = require('../../../models/FileShare.model');
const Message = require('../../../models/Message.model');
const Conversation = require('../../../models/Conversation.model');
const Invoice = require('../../../models/Invoice.model');
const Timeline = require('../../../models/Timeline.model');
const Report = require('../../../models/Report.model');
const AuditLog = require('../../../models/AuditLog.model');

/**
 * Get client dashboard data
 */
exports.getClientDashboard = async (clientId) => {
    // Get client's active cases
    const cases = await Case.find({ client: clientId, status: { $ne: 'Closed' } })
        .select('caseNumber title status priority createdAt assignedTo')
        .populate('assignedTo', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(10);

    // Get recent documents
    const documents = await FileShare.find({ sharedWith: clientId })
        .select('fileName fileSize uploadedAt case')
        .populate('case', 'caseNumber title')
        .sort({ uploadedAt: -1 })
        .limit(5);

    // Get unread messages count
    const conversations = await Conversation.find({ participants: clientId });
    const conversationIds = conversations.map(c => c._id);
    const unreadMessages = await Message.countDocuments({
        conversation: { $in: conversationIds },
        sender: { $ne: clientId },
        readBy: { $ne: clientId }
    });

    // Get pending invoices
    const pendingInvoices = await Invoice.find({
        case: { $in: cases.map(c => c._id) },
        status: 'Pending'
    }).select('invoiceNumber amount dueDate');

    // Get recent activity
    const recentActivity = await AuditLog.find({
        $or: [
            { userId: clientId },
            { caseId: { $in: cases.map(c => c._id) } }
        ]
    })
        .sort({ timestamp: -1 })
        .limit(10)
        .select('action resource timestamp details');

    return {
        cases,
        documents,
        unreadMessages,
        pendingInvoices,
        recentActivity,
        stats: {
            activeCases: cases.length,
            totalDocuments: documents.length,
            unreadMessages,
            pendingInvoices: pendingInvoices.length
        }
    };
};

/**
 * Get client's cases
 */
exports.getClientCases = async (clientId, filters = {}) => {
    const query = { client: clientId };

    if (filters.status) {
        query.status = filters.status;
    }

    const cases = await Case.find(query)
        .select('caseNumber title status priority createdAt updatedAt assignedTo')
        .populate('assignedTo', 'firstName lastName email')
        .sort({ updatedAt: -1 });

    return cases;
};

/**
 * Get single case details for client
 */
exports.getClientCaseById = async (caseId, clientId) => {
    const caseData = await Case.findOne({ _id: caseId, client: clientId })
        .populate('client', 'firstName lastName email phone')
        .populate('assignedTo', 'firstName lastName email')
        .populate('lawFirm', 'name contactPerson');

    if (!caseData) {
        throw new Error('Case not found or access denied');
    }

    // Get case documents
    const documents = await FileShare.find({ case: caseId, sharedWith: clientId })
        .select('fileName fileSize uploadedAt fileType')
        .sort({ uploadedAt: -1 });

    // Get case timeline
    const timeline = await Timeline.findOne({ case: caseId })
        .select('events')
        .lean();

    // Get case messages
    const conversation = await Conversation.findOne({
        case: caseId,
        participants: clientId
    });

    let messages = [];
    if (conversation) {
        messages = await Message.find({ conversation: conversation._id })
            .populate('sender', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(20);
    }

    return {
        case: caseData,
        documents,
        timeline: timeline?.events || [],
        messages
    };
};

/**
 * Get client's documents
 */
exports.getClientDocuments = async (clientId, filters = {}) => {
    const query = { sharedWith: clientId };

    if (filters.caseId) {
        query.case = filters.caseId;
    }

    if (filters.fileType) {
        query.fileType = filters.fileType;
    }

    const documents = await FileShare.find(query)
        .populate('case', 'caseNumber title')
        .populate('uploadedBy', 'firstName lastName')
        .sort({ uploadedAt: -1 });

    return documents;
};

/**
 * Get client's messages
 */
exports.getClientMessages = async (clientId, caseId = null) => {
    const query = { participants: clientId };

    if (caseId) {
        query.case = caseId;
    }

    const conversations = await Conversation.find(query)
        .populate('case', 'caseNumber title')
        .populate('participants', 'firstName lastName')
        .sort({ lastMessageAt: -1 });

    const conversationsWithMessages = await Promise.all(
        conversations.map(async (conv) => {
            const messages = await Message.find({ conversation: conv._id })
                .populate('sender', 'firstName lastName')
                .sort({ createdAt: -1 })
                .limit(50);

            return {
                conversation: conv,
                messages
            };
        })
    );

    return conversationsWithMessages;
};

/**
 * Send message from client
 */
exports.sendClientMessage = async (clientId, conversationId, messageData) => {
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: clientId
    });

    if (!conversation) {
        throw new Error('Conversation not found or access denied');
    }

    const message = await Message.create({
        conversation: conversationId,
        sender: clientId,
        content: messageData.content,
        attachments: messageData.attachments || []
    });

    // Update conversation last message time
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return message.populate('sender', 'firstName lastName');
};

/**
 * Get client's activity updates
 */
exports.getClientUpdates = async (clientId, limit = 20) => {
    const cases = await Case.find({ client: clientId }).select('_id');
    const caseIds = cases.map(c => c._id);

    const updates = await AuditLog.find({
        $or: [
            { userId: clientId },
            { caseId: { $in: caseIds } }
        ],
        action: {
            $in: [
                'document_uploaded',
                'message_sent',
                'case_status_updated',
                'report_generated',
                'invoice_created'
            ]
        }
    })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('userId', 'firstName lastName')
        .populate('caseId', 'caseNumber title');

    return updates;
};

/**
 * Get client's invoices
 */
exports.getClientInvoices = async (clientId) => {
    const cases = await Case.find({ client: clientId }).select('_id');
    const caseIds = cases.map(c => c._id);

    const invoices = await Invoice.find({ case: { $in: caseIds } })
        .populate('case', 'caseNumber title')
        .sort({ createdAt: -1 });

    return invoices;
};

/**
 * Get client's reports
 */
exports.getClientReports = async (clientId) => {
    const cases = await Case.find({ client: clientId }).select('_id');
    const caseIds = cases.map(c => c._id);

    const reports = await Report.find({ case: { $in: caseIds } })
        .populate('case', 'caseNumber title')
        .populate('generatedBy', 'firstName lastName')
        .sort({ createdAt: -1 });

    return reports;
};

/**
 * Get client's timeline
 */
exports.getClientTimeline = async (clientId, caseId) => {
    const caseData = await Case.findOne({ _id: caseId, client: clientId });

    if (!caseData) {
        throw new Error('Case not found or access denied');
    }

    const timeline = await Timeline.findOne({ case: caseId })
        .populate('case', 'caseNumber title')
        .populate('createdBy', 'firstName lastName');

    return timeline;
};
