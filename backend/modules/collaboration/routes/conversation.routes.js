const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const conversationValidators = require('../validators/conversation.validator');
const { protect } = require('../../../shared/middleware/auth.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

router.use(protect);

// CRUD operations
router.get('/', validate(conversationValidators.getAll), auditLog('view_conversations'), conversationController.getAllConversations);
router.get('/:id', validate(conversationValidators.getById), auditLog('view_conversation'), conversationController.getConversationById);
router.post('/', validate(conversationValidators.create), auditLog('create_conversation'), conversationController.createConversation);
router.put('/:id', validate(conversationValidators.update), auditLog('update_conversation'), conversationController.updateConversation);

// Participant management
router.post('/:id/participants', validate(conversationValidators.addParticipants), auditLog('add_conversation_participants'), conversationController.addParticipants);
router.delete('/:id/participants/:participantId', validate(conversationValidators.removeParticipant), auditLog('remove_conversation_participant'), conversationController.removeParticipant);
router.post('/:id/leave', validate(conversationValidators.getById), auditLog('leave_conversation'), conversationController.leaveConversation);

// Archive
router.patch('/:id/archive', validate(conversationValidators.getById), auditLog('archive_conversation'), conversationController.archiveConversation);

module.exports = router;
