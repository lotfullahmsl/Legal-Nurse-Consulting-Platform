const Conversation = require('../../../models/Conversation.model');
const Message = require('../../../models/Message.model');

class ConversationService {
    async findDirectConversation(user1Id, user2Id) {
        const conversation = await Conversation.findOne({
            type: 'direct',
            'participants.user': { $all: [user1Id, user2Id] },
            'participants.isActive': true
        })
            .populate('participants.user', 'name email avatar')
            .populate('lastMessage');

        return conversation;
    }

    async getOrCreateDirectConversation(user1Id, user2Id) {
        let conversation = await this.findDirectConversation(user1Id, user2Id);

        if (!conversation) {
            conversation = new Conversation({
                type: 'direct',
                participants: [
                    { user: user1Id, role: 'member', isActive: true },
                    { user: user2Id, role: 'member', isActive: true }
                ],
                createdBy: user1Id
            });
            await conversation.save();
            await conversation.populate('participants.user', 'name email avatar');
        }

        return conversation;
    }

    async getCaseConversations(caseId) {
        return await Conversation.find({
            case: caseId,
            isArchived: false
        })
            .populate('participants.user', 'name email avatar')
            .populate('lastMessage')
            .populate('createdBy', 'name email')
            .sort({ lastMessageAt: -1 });
    }

    async getUserConversations(userId, filters = {}) {
        const query = {
            'participants.user': userId,
            'participants.isActive': true
        };

        if (filters.type) query.type = filters.type;
        if (filters.caseId) query.case = filters.caseId;
        if (filters.isArchived !== undefined) query.isArchived = filters.isArchived;

        return await Conversation.find(query)
            .populate('participants.user', 'name email avatar')
            .populate('lastMessage')
            .populate('case', 'title caseNumber')
            .sort({ lastMessageAt: -1 });
    }

    async getConversationStats(conversationId) {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const messageCount = await Message.countDocuments({
            conversation: conversationId,
            isDeleted: false
        });

        const activeParticipants = conversation.participants.filter(p => p.isActive).length;

        return {
            messageCount,
            participantCount: conversation.participants.length,
            activeParticipants,
            createdAt: conversation.createdAt,
            lastMessageAt: conversation.lastMessageAt,
            type: conversation.type
        };
    }

    async isUserParticipant(conversationId, userId) {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return false;
        }

        return conversation.participants.some(
            p => p.user.toString() === userId && p.isActive
        );
    }

    async getActiveConversations(userId) {
        const conversations = await this.getUserConversations(userId, { isArchived: false });

        // Add unread counts
        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await Message.countDocuments({
                    conversation: conv._id,
                    sender: { $ne: userId },
                    'readBy.user': { $ne: userId },
                    isDeleted: false
                });

                return {
                    ...conv.toObject(),
                    unreadCount
                };
            })
        );

        return conversationsWithUnread;
    }

    async archiveOldConversations(daysOld = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await Conversation.updateMany(
            {
                lastMessageAt: { $lt: cutoffDate },
                isArchived: false
            },
            {
                $set: {
                    isArchived: true,
                    archivedAt: new Date()
                }
            }
        );

        return result.modifiedCount;
    }
}

module.exports = new ConversationService();
