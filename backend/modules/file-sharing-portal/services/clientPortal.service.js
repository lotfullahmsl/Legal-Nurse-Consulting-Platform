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
    // For client users, find their client record by email
    const User = require('../../../models/User.model');
    const user = await User.findById(clientId);

    if (!user) {
        throw new Error('User not found');
    }

    // Find client record by email
    const Client = require('../../../models/Client.model');
    const client = await Client.findOne({ email: user.email });

    if (!client) {
        // Return empty dashboard if client profile not found
        return {
            cases: [],
            documents: [],
            unreadMessages: 0,
            pendingInvoices: [],
            recentActivity: [],
            stats: {
                activeCases: 0,
                totalDocuments: 0,
                unreadMessages: 0,
                pendingInvoices: 0
            }
        };
    }

    // Get client's active cases
    const cases = await Case.find({ client: client._id, status: { $nin: ['closed', 'archived'] } })
        .select('caseNumber caseName caseType status priority createdAt assignedConsultant')
        .populate('assignedConsultant', 'firstName lastName fullName')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    // Transform cases to match frontend expectations
    const transformedCases = cases.map(c => ({
        ...c,
        title: c.caseName,
        assignedTo: c.assignedConsultant
    }));

    // Get recent documents
    const documents = await FileShare.find({ sharedWith: clientId })
        .select('fileName fileSize uploadedAt case')
        .populate('case', 'caseNumber caseName')
        .sort({ uploadedAt: -1 })
        .limit(5)
        .lean();

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
        status: 'pending'
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
        cases: transformedCases,
        documents,
        unreadMessages,
        pendingInvoices,
        recentActivity,
        stats: {
            activeCases: transformedCases.length,
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
    // For client users, find their client record by email
    const User = require('../../../models/User.model');
    const user = await User.findById(clientId);

    if (!user) {
        throw new Error('User not found');
    }

    // Find client record by email
    const Client = require('../../../models/Client.model');
    const client = await Client.findOne({ email: user.email });

    if (!client) {
        // Return empty array if client profile not found
        return [];
    }

    const query = { client: client._id };

    if (filters.status) {
        query.status = filters.status;
    }

    const cases = await Case.find(query)
        .select('caseNumber caseName caseType status priority incidentDate description createdAt updatedAt')
        .populate('assignedConsultant', 'fullName email')
        .populate('lawFirm', 'firmName contactPerson')
        .sort({ updatedAt: -1 });

    return cases;
};

/**
 * Get single case details for client
 */
exports.getClientCaseById = async (caseId, clientId) => {
    // For client users, find their client record by email
    const User = require('../../../models/User.model');
    const user = await User.findById(clientId);

    if (!user) {
        throw new Error('User not found');
    }

    // Find client record by email
    const Client = require('../../../models/Client.model');
    const client = await Client.findOne({ email: user.email });

    if (!client) {
        throw new Error('Client profile not found - please contact support');
    }

    const caseData = await Case.findOne({ _id: caseId, client: client._id })
        .populate('client', 'fullName email phone')
        .populate('assignedConsultant', 'fullName email')
        .populate('lawFirm', 'firmName contactPerson');

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
            .populate('sender', 'fullName')
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
    const query = { sharedWith: clientId, isRevoked: false };

    if (filters.caseId) {
        query.case = filters.caseId;
    }

    if (filters.fileType) {
        query.fileType = filters.fileType;
    }

    const fileShares = await FileShare.find(query)
        .populate('case', 'caseNumber caseName')
        .populate('sharedBy', 'firstName lastName fullName')
        .populate({
            path: 'file',
            select: 'fileName fileSize fileType uploadDate'
        })
        .sort({ createdAt: -1 });

    // Transform to include file details at top level
    const documents = fileShares.map(share => ({
        _id: share._id,
        fileName: share.file?.fileName || 'Unknown',
        fileSize: share.file?.fileSize,
        fileType: share.file?.fileType,
        case: share.case,
        uploadedBy: share.sharedBy,
        createdAt: share.createdAt,
        accessLevel: share.accessLevel,
        expiresAt: share.expiresAt
    }));

    return documents;
};

/**
 * Get client's messages
 */
exports.getClientMessages = async (clientId, caseId = null) => {
    // For client users, find their client record by email
    const User = require('../../../models/User.model');
    const user = await User.findById(clientId);

    if (!user) {
        throw new Error('User not found');
    }

    // Find client record by email
    const Client = require('../../../models/Client.model');
    const client = await Client.findOne({ email: user.email });

    if (!client) {
        // Return empty if no client profile
        return [];
    }

    // Get client's cases
    const cases = await Case.find({ client: client._id }).select('_id');
    const caseIds = cases.map(c => c._id);

    // Build query for conversations
    const query = {
        participants: clientId,
        case: { $in: caseIds }
    };

    if (caseId) {
        query.case = caseId;
    }

    const conversations = await Conversation.find(query)
        .populate('case', 'caseNumber caseName')
        .populate('participants', 'fullName email role')
        .sort({ lastMessageAt: -1 });

    // Get unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
        conversations.map(async (conv) => {
            const unreadCount = await Message.countDocuments({
                conversation: conv._id,
                sender: { $ne: clientId },
                'readBy.user': { $ne: clientId },
                isDeleted: false
            });

            return {
                ...conv.toObject(),
                unreadCount
            };
        })
    );

    return conversationsWithUnread;
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
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return message.populate('sender', 'fullName email');
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
    // For client users, find their client record by email
    const User = require('../../../models/User.model');
    const user = await User.findById(clientId);

    if (!user) {
        throw new Error('User not found');
    }

    // Find client record by email
    const Client = require('../../../models/Client.model');
    const client = await Client.findOne({ email: user.email });

    if (!client) {
        // Return empty timeline if client profile not found
        return {
            timelines: [],
            case: null
        };
    }

    const caseData = await Case.findOne({ _id: caseId, client: client._id })
        .populate('client', 'fullName email phone')
        .populate('assignedConsultant', 'fullName email')
        .populate('lawFirm', 'firmName contactPerson');

    if (!caseData) {
        throw new Error('Case not found or access denied');
    }

    const timelines = await Timeline.find({ case: caseId })
        .populate('case', 'caseNumber caseName')
        .populate('assignedTo', 'fullName email')
        .populate('createdBy', 'fullName')
        .populate('events.citations.document', 'fileName')
        .sort({ createdAt: -1 });

    return {
        timelines,
        case: caseData
    };
};
