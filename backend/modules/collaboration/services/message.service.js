const Message = require('../../../models/Message.model');
const Conversation = require('../../../models/Conversation.model');

class MessageService {
    async getUnreadCount(userId) {
        // Get all conversations where user is participant
        const conversations = await Conversation.find({
            'participants.user': userId,
            'participants.isActive': true
        }).select('_id');

        const conversationIds = conversations.map(c => c._id);

        const count = await Message.countDocuments({
            conversation: { $in: conversationIds },
            sender: { $ne: userId },
            'readBy.user': { $ne: userId },
            isDeleted: false
        });

        return count;
    }

    async getUnreadByConversation(userId) {
        const conversations = await Conversation.find({
            'participants.user': userId,
            'participants.isActive': true
        }).select('_id title type');

        const unreadCounts = await Promise.all(
            conversations.map(async (conv) => {
                const count = await Message.countDocuments({
                    conversation: conv._id,
                    sender: { $ne: userId },
                    'readBy.user': { $ne: userId },
                    isDeleted: false
                });

                return {
                    conversationId: conv._id,
                    title: conv.title,
                    type: conv.type,
                    unreadCount: count
                };
            })
        );

        return unreadCounts.filter(c => c.unreadCount > 0);
    }

    async notifyParticipants(conversation, message, senderId) {
        // Get all active participants except sender
        const recipients = conversation.participants
            .filter(p => p.isActive && p.user.toString() !== senderId)
            .map(p => p.user);

        // This would integrate with notification service
        // For now, just return the recipients
        return recipients;
    }

    async markAllAsRead(userId, conversationId) {
        const messages = await Message.find({
            conversation: conversationId,
            sender: { $ne: userId },
            'readBy.user': { $ne: userId },
            isDeleted: false
        });

        for (const message of messages) {
            message.readBy.push({
                user: userId,
                readAt: new Date()
            });
            await message.save();
        }

        return messages.length;
    }

    async getMessageStats(conversationId) {
        const messages = await Message.find({
            conversation: conversationId,
            isDeleted: false
        });

        const stats = {
            total: messages.length,
            withAttachments: messages.filter(m => m.attachments.length > 0).length,
            edited: messages.filter(m => m.isEdited).length,
            bySender: {}
        };

        messages.forEach(msg => {
            const senderId = msg.sender.toString();
            stats.bySender[senderId] = (stats.bySender[senderId] || 0) + 1;
        });

        return stats;
    }

    async searchMessages(query, conversationId, userId) {
        const filter = {
            conversation: conversationId,
            content: { $regex: query, $options: 'i' },
            isDeleted: false
        };

        // Verify user is participant
        const conversation = await Conversation.findById(conversationId);
        const isParticipant = conversation.participants.some(
            p => p.user.toString() === userId && p.isActive
        );

        if (!isParticipant) {
            throw new Error('Access denied');
        }

        const messages = await Message.find(filter)
            .populate('sender', 'name email avatar')
            .sort({ createdAt: -1 })
            .limit(50);

        return messages;
    }

    async getRecentMessages(userId, limit = 20) {
        const conversations = await Conversation.find({
            'participants.user': userId,
            'participants.isActive': true
        }).select('_id');

        const conversationIds = conversations.map(c => c._id);

        return await Message.find({
            conversation: { $in: conversationIds },
            isDeleted: false
        })
            .populate('sender', 'name email avatar')
            .populate('conversation', 'title type')
            .sort({ createdAt: -1 })
            .limit(limit);
    }
}

module.exports = new MessageService();
