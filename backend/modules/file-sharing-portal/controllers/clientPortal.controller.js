const clientPortalService = require('../services/clientPortal.service');
const asyncHandler = require('../../../shared/utils/asyncHandler.util');
const AppError = require('../../../shared/errors/AppError');

/**
 * @desc    Get client dashboard data
 * @route   GET /api/client/dashboard
 * @access  Private (Client)
 */
exports.getClientDashboard = asyncHandler(async (req, res) => {
    const clientId = req.user._id;

    const dashboardData = await clientPortalService.getClientDashboard(clientId);

    res.status(200).json({
        success: true,
        data: dashboardData
    });
});

/**
 * @desc    Get client's cases
 * @route   GET /api/client/cases
 * @access  Private (Client)
 */
exports.getClientCases = asyncHandler(async (req, res) => {
    const clientId = req.user._id;
    const filters = {
        status: req.query.status
    };

    const cases = await clientPortalService.getClientCases(clientId, filters);

    res.status(200).json({
        success: true,
        count: cases.length,
        data: cases
    });
});

/**
 * @desc    Get single case details for client
 * @route   GET /api/client/cases/:id
 * @access  Private (Client)
 */
exports.getClientCaseById = asyncHandler(async (req, res) => {
    const clientId = req.user._id;
    const caseId = req.params.id;

    const caseData = await clientPortalService.getClientCaseById(caseId, clientId);

    res.status(200).json({
        success: true,
        data: caseData
    });
});

/**
 * @desc    Get client's documents
 * @route   GET /api/client/documents
 * @access  Private (Client)
 */
exports.getClientDocuments = asyncHandler(async (req, res) => {
    const clientId = req.user._id;
    const filters = {
        caseId: req.query.caseId,
        fileType: req.query.fileType
    };

    const documents = await clientPortalService.getClientDocuments(clientId, filters);

    res.status(200).json({
        success: true,
        count: documents.length,
        data: documents
    });
});

/**
 * @desc    Get client's messages
 * @route   GET /api/client/messages
 * @access  Private (Client)
 */
exports.getClientMessages = asyncHandler(async (req, res) => {
    const clientId = req.user._id;
    const caseId = req.query.caseId;

    const messages = await clientPortalService.getClientMessages(clientId, caseId);

    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
    });
});

/**
 * @desc    Send message from client
 * @route   POST /api/client/messages
 * @access  Private (Client)
 */
exports.sendClientMessage = asyncHandler(async (req, res) => {
    const clientId = req.user._id;
    const { conversationId, content, attachments } = req.body;

    if (!conversationId || !content) {
        throw new AppError('Conversation ID and content are required', 400);
    }

    const message = await clientPortalService.sendClientMessage(clientId, conversationId, {
        content,
        attachments
    });

    res.status(201).json({
        success: true,
        data: message
    });
});

/**
 * @desc    Get client's activity updates
 * @route   GET /api/client/updates
 * @access  Private (Client)
 */
exports.getClientUpdates = asyncHandler(async (req, res) => {
    const clientId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;

    const updates = await clientPortalService.getClientUpdates(clientId, limit);

    res.status(200).json({
        success: true,
        count: updates.length,
        data: updates
    });
});

/**
 * @desc    Get client's invoices
 * @route   GET /api/client/invoices
 * @access  Private (Client)
 */
exports.getClientInvoices = asyncHandler(async (req, res) => {
    const clientId = req.user._id;

    const invoices = await clientPortalService.getClientInvoices(clientId);

    res.status(200).json({
        success: true,
        count: invoices.length,
        data: invoices
    });
});

/**
 * @desc    Get client's reports
 * @route   GET /api/client/reports
 * @access  Private (Client)
 */
exports.getClientReports = asyncHandler(async (req, res) => {
    const clientId = req.user._id;

    const reports = await clientPortalService.getClientReports(clientId);

    res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
    });
});

/**
 * @desc    Get client's timeline
 * @route   GET /api/client/timeline/:caseId
 * @access  Private (Client)
 */
exports.getClientTimeline = asyncHandler(async (req, res) => {
    const clientId = req.user._id;
    const caseId = req.params.caseId;

    const timeline = await clientPortalService.getClientTimeline(clientId, caseId);

    res.status(200).json({
        success: true,
        data: timeline
    });
});
