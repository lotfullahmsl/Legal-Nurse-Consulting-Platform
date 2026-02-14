const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const messageValidators = require('../validators/message.validator');
const { protect } = require('../../../shared/middleware/auth.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

router.use(protect);

// Unread counts
router.get('/unread-count', auditLog('view_unread_count'), messageController.getUnreadCount);
router.get('/unread-by-conversation', auditLog('view_unread_by_conversation'), messageController.getUnreadByConversation);

// Conversation messages
router.get('/conversation/:conversationId', validate(messageValidators.getByConversation), auditLog('view_conversation_messages'), messageController.getConversationMessages);
router.post('/conversation/:conversationId/read', validate(messageValidators.markConversationRead), auditLog('mark_conversation_read'), messageController.markConversationAsRead);

// Message operations
router.get('/', validate(messageValidators.getAll), auditLog('view_messages'), messageController.getAllMessages);
router.get('/:id', validate(messageValidators.getById), auditLog('view_message'), messageController.getMessageById);
router.post('/', validate(messageValidators.send), auditLog('send_message'), messageController.sendMessage);
router.put('/:id', validate(messageValidators.edit), auditLog('edit_message'), messageController.editMessage);
router.delete('/:id', validate(messageValidators.delete), auditLog('delete_message'), messageController.deleteMessage);

// Mark as read
router.put('/:id/read', validate(messageValidators.markRead), auditLog('mark_message_read'), messageController.markAsRead);

// Attachments
router.post('/:id/attachments', validate(messageValidators.addAttachment), auditLog('add_message_attachment'), messageController.addAttachment);

module.exports = router;
