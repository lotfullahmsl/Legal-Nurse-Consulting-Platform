// Collaboration Module Entry Point

const noteRoutes = require('./routes/note.routes');
const messageRoutes = require('./routes/message.routes');
const conversationRoutes = require('./routes/conversation.routes');

const noteService = require('./services/note.service');
const messageService = require('./services/message.service');
const conversationService = require('./services/conversation.service');

module.exports = {
    routes: {
        note: noteRoutes,
        message: messageRoutes,
        conversation: conversationRoutes
    },
    services: {
        note: noteService,
        message: messageService,
        conversation: conversationService
    }
};
