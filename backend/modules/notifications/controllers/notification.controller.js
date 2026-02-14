const notificationService = require('../services/notification.service');
const asyncHandler = require('../../../shared/utils/asyncHandler.util');
const AppError = require('../../../shared/errors/AppError');

// Get all notifications for current user
exports.getNotifications = asyncHandler(async (req, res) => {
    const { notifications, total } = await notificationService.getNotifications(
        req.user._id,
        req.query
    );

    res.status(200).json({
        success: true,
        data: {
            notifications,
            total,
            page: parseInt(req.query.skip || 0) / parseInt(req.query.limit || 20) + 1,
            limit: parseInt(req.query.limit || 20)
        }
    });
});

// Get unread notification count
exports.getUnreadCount = asyncHandler(async (req, res) => {
    const count = await notificationService.getUnreadCount(req.user._id);

    res.status(200).json({
        success: true,
        data: { count }
    });
});

// Mark notification as read
exports.markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(
        req.params.id,
        req.user._id
    );

    if (!notification) {
        throw new AppError('Notification not found', 404);
    }

    res.status(200).json({
        success: true,
        data: { notification }
    });
});

// Mark all notifications as read
exports.markAllAsRead = asyncHandler(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user._id);

    res.status(200).json({
        success: true,
        data: {
            modifiedCount: result.modifiedCount
        }
    });
});

// Delete notification
exports.deleteNotification = asyncHandler(async (req, res) => {
    const notification = await notificationService.deleteNotification(
        req.params.id,
        req.user._id
    );

    if (!notification) {
        throw new AppError('Notification not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Notification deleted successfully'
    });
});

// Delete all read notifications
exports.deleteAllRead = asyncHandler(async (req, res) => {
    const result = await notificationService.deleteAllRead(req.user._id);

    res.status(200).json({
        success: true,
        data: {
            deletedCount: result.deletedCount
        }
    });
});
