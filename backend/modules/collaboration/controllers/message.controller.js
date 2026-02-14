const Message = require('../../../models/Message.model');
const Conversation = require('../../../models/Conversation.model');
const messageService = require('../services/message.service');

exports.getAllMessages = async (req, res, next) => {
    try {
        const { conversation, page = 1, limit = 50 } = req.query;

        const filter = {};
        if (conversation) filter.conversation = conversation;

        const messages = await Message.find(filter)
            .populate('sender', 'name email avatar')
            .populate('replyTo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Message.countDocuments(filter);

        res.json({
            messages: messages.reverse(), // Reverse to show oldest first
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        next(error);
    }
};

exports.getMessageById = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id)
            .populate('sender', 'name email avatar')
            .populate('conversation')
            .populate('replyTo')
            .populate('readBy.user', 'name email');

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        next(error);
    }
};

exports.getConversationMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is participant
        const isParticipant = conversation.participants.some(
            p => p.user.toString() === req.user.id && p.isActive
        );

        if (!isParticipant) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messages = await Message.find({
            conversation: conversationId,
            isDeleted: false
        })
            .populate('sender', 'name email avatar')
            .populate('replyTo', 'content sender')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Message.countDocuments({
            conversation: conversationId,
            isDeleted: false
        });

        res.json({
            messages: messages.reverse(),
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        next(error);
    }
};

exports.sendMessage = async (req, res, next) => {
    try {
        const { conversationId, content, replyTo } = req.body;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is participant
        const isParticipant = conversation.participants.some(
            p => p.user.toString() === req.user.id && p.isActive
        );

        if (!isParticipant) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const message = new Message({
            conversation: conversationId,
            sender: req.user.id,
            content,
            replyTo: replyTo || null
        });

        await message.save();

        // Update conversation last message
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        await message.populate('sender', 'name email avatar');
        if (replyTo) {
            await message.populate('replyTo', 'content sender');
        }

        // Notify other participants
        await messageService.notifyParticipants(conversation, message, req.user.id);

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if already read by this user
        const alreadyRead = message.readBy.some(
            r => r.user.toString() === req.user.id
        );

        if (!alreadyRead) {
            message.readBy.push({
                user: req.user.id,
                readAt: new Date()
            });
            await message.save();
        }

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        next(error);
    }
};

exports.markConversationAsRead = async (req, res, next) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({
            conversation: conversationId,
            sender: { $ne: req.user.id },
            'readBy.user': { $ne: req.user.id }
        });

        for (const message of messages) {
            message.readBy.push({
                user: req.user.id,
                readAt: new Date()
            });
            await message.save();
        }

        res.json({ message: `${messages.length} messages marked as read` });
    } catch (error) {
        next(error);
    }
};

exports.addAttachment = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { filename, originalName, mimeType, size, path } = req.body;

        message.attachments.push({
            filename,
            originalName,
            mimeType,
            size,
            path
        });

        await message.save();
        res.json(message);
    } catch (error) {
        next(error);
    }
};

exports.editMessage = async (req, res, next) => {
    try {
        const { content } = req.body;

        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        message.content = content;
        message.isEdited = true;
        message.editedAt = new Date();

        await message.save();
        await message.populate('sender', 'name email avatar');

        res.json(message);
    } catch (error) {
        next(error);
    }
};

exports.deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        message.isDeleted = true;
        message.deletedAt = new Date();
        message.content = '[Message deleted]';

        await message.save();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await messageService.getUnreadCount(req.user.id);
        res.json({ unreadCount: count });
    } catch (error) {
        next(error);
    }
};

exports.getUnreadByConversation = async (req, res, next) => {
    try {
        const unreadCounts = await messageService.getUnreadByConversation(req.user.id);
        res.json(unreadCounts);
    } catch (error) {
        next(error);
    }
};
