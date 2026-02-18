const Conversation = require('../../../models/Conversation.model');
const Message = require('../../../models/Message.model');
const conversationService = require('../services/conversation.service');

exports.getAllConversations = async (req, res, next) => {
    try {
        const { type, case: caseId, isArchived, page = 1, limit = 20 } = req.query;

        const filter = {
            participants: req.user._id,
            isArchived: isArchived === 'true'
        };

        if (type) filter.type = type;
        if (caseId) filter.case = caseId;

        const conversations = await Conversation.find(filter)
            .populate('participants', 'fullName email role')
            .populate('lastMessage')
            .populate('case', 'caseName caseNumber')
            .populate('createdBy', 'fullName email')
            .sort({ lastMessageAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Conversation.countDocuments(filter);

        // Get unread counts for each conversation
        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await Message.countDocuments({
                    conversation: conv._id,
                    sender: { $ne: req.user._id },
                    'readBy.user': { $ne: req.user._id },
                    isDeleted: false
                });
                return {
                    ...conv.toObject(),
                    unreadCount
                };
            })
        );

        res.json({
            conversations: conversationsWithUnread,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        next(error);
    }
};

exports.getConversationById = async (req, res, next) => {
    try {
        const conversation = await Conversation.findById(req.params.id)
            .populate('participants', 'fullName email role')
            .populate('lastMessage')
            .populate('case', 'caseName caseNumber')
            .populate('createdBy', 'fullName email');

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is participant
        const isParticipant = conversation.participants.some(
            p => p._id.toString() === req.user._id.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(conversation);
    } catch (error) {
        next(error);
    }
};

exports.createConversation = async (req, res, next) => {
    try {
        const { type, title, description, participants, caseId } = req.body;

        // For direct conversations, check if one already exists
        if (type === 'direct' && participants.length === 1) {
            const existing = await Conversation.findOne({
                type: 'direct',
                participants: { $all: [req.user._id, participants[0]] }
            });
            if (existing) {
                return res.json(existing);
            }
        }

        const participantsList = [req.user._id, ...participants];

        const conversation = new Conversation({
            type,
            title,
            description,
            participants: participantsList,
            case: caseId || null,
            createdBy: req.user._id
        });

        await conversation.save();
        await conversation.populate('participants', 'fullName email role');
        await conversation.populate('case', 'caseName caseNumber');

        res.status(201).json(conversation);
    } catch (error) {
        next(error);
    }
};

exports.updateConversation = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is admin of conversation
        const userParticipant = conversation.participants.find(
            p => p.user.toString() === req.user.id
        );

        if (!userParticipant || userParticipant.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (title) conversation.title = title;
        if (description !== undefined) conversation.description = description;

        await conversation.save();
        await conversation.populate('participants.user', 'name email avatar');

        res.json(conversation);
    } catch (error) {
        next(error);
    }
};

exports.addParticipants = async (req, res, next) => {
    try {
        const { participants } = req.body;

        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is admin
        const userParticipant = conversation.participants.find(
            p => p.user.toString() === req.user.id
        );

        if (!userParticipant || userParticipant.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Add new participants
        for (const userId of participants) {
            const exists = conversation.participants.some(
                p => p.user.toString() === userId
            );
            if (!exists) {
                conversation.participants.push({
                    user: userId,
                    role: 'member',
                    isActive: true
                });
            }
        }

        await conversation.save();
        await conversation.populate('participants.user', 'name email avatar');

        res.json(conversation);
    } catch (error) {
        next(error);
    }
};

exports.removeParticipant = async (req, res, next) => {
    try {
        const { participantId } = req.params;

        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is admin
        const userParticipant = conversation.participants.find(
            p => p.user.toString() === req.user.id
        );

        if (!userParticipant || userParticipant.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Mark participant as inactive
        const participant = conversation.participants.find(
            p => p.user.toString() === participantId
        );

        if (participant) {
            participant.isActive = false;
            participant.leftAt = new Date();
        }

        await conversation.save();
        res.json({ message: 'Participant removed successfully' });
    } catch (error) {
        next(error);
    }
};

exports.leaveConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const participant = conversation.participants.find(
            p => p.user.toString() === req.user.id
        );

        if (participant) {
            participant.isActive = false;
            participant.leftAt = new Date();
            await conversation.save();
        }

        res.json({ message: 'Left conversation successfully' });
    } catch (error) {
        next(error);
    }
};

exports.archiveConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findById(req.params.id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        conversation.isArchived = !conversation.isArchived;
        conversation.archivedAt = conversation.isArchived ? new Date() : null;

        await conversation.save();
        res.json({
            message: `Conversation ${conversation.isArchived ? 'archived' : 'unarchived'} successfully`,
            conversation
        });
    } catch (error) {
        next(error);
    }
};
