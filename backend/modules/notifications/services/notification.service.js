const Notification = require('../../../models/Notification.model');

const notificationService = {
    // Get all notifications for a user
    getNotifications: async (userId, filters = {}) => {
        const query = { user: userId };

        if (filters.unread !== undefined) {
            query.isRead = !filters.unread;
        }

        if (filters.type) {
            query.type = filters.type;
        }

        const limit = parseInt(filters.limit) || 20;
        const skip = parseInt(filters.skip) || 0;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        const total = await Notification.countDocuments(query);

        return { notifications, total };
    },

    // Get unread notification count
    getUnreadCount: async (userId) => {
        const count = await Notification.countDocuments({
            user: userId,
            isRead: false
        });

        return count;
    },

    // Create notification
    createNotification: async (notificationData) => {
        const notification = await Notification.create(notificationData);
        return notification;
    },

    // Create bulk notifications
    createBulkNotifications: async (notificationsData) => {
        const notifications = await Notification.insertMany(notificationsData);
        return notifications;
    },

    // Mark notification as read
    markAsRead: async (notificationId, userId) => {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId },
            { isRead: true },
            { new: true }
        );

        return notification;
    },

    // Mark all notifications as read
    markAllAsRead: async (userId) => {
        const result = await Notification.updateMany(
            { user: userId, isRead: false },
            { isRead: true }
        );

        return result;
    },

    // Delete notification
    deleteNotification: async (notificationId, userId) => {
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            user: userId
        });

        return notification;
    },

    // Delete all read notifications
    deleteAllRead: async (userId) => {
        const result = await Notification.deleteMany({
            user: userId,
            isRead: true
        });

        return result;
    }
};

module.exports = notificationService;
