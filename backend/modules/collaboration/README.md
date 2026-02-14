# Collaboration & Notes Module

## Overview
Complete collaboration system for team communication and case notes management. Supports internal notes, secure messaging, conversation threads, and team collaboration features.

## Features

### Notes Management
- Case notes with rich content
- Note types (general, medical, legal, administrative, research, communication)
- Priority levels (low, medium, high, urgent)
- Tagging system
- Version history tracking
- File attachments
- Team mentions
- Pin important notes
- Full-text search

### Messaging System
- Secure messaging between users
- Conversation types (direct, group, case-based)
- Message threads and replies
- Read receipts
- File attachments
- Message editing and deletion
- Unread message tracking
- Conversation archiving

## API Endpoints

### Notes: `/api/notes`
```
GET    /api/notes                    - Get all notes (filtered)
GET    /api/notes/:id                - Get specific note
GET    /api/notes/case/:caseId       - Get notes by case
POST   /api/notes                    - Create note
PUT    /api/notes/:id                - Update note
DELETE /api/notes/:id                - Delete note
POST   /api/notes/:id/attachments    - Add attachment
DELETE /api/notes/:id/attachments/:attachmentId - Remove attachment
GET    /api/notes/:id/history        - Get version history
POST   /api/notes/:id/tags           - Add tags
DELETE /api/notes/:id/tags           - Remove tags
GET    /api/notes/search             - Search notes
PATCH  /api/notes/:id/pin            - Pin/unpin note
```

### Messages: `/api/messages`
```
GET    /api/messages                           - Get all messages
GET    /api/messages/:id                       - Get specific message
GET    /api/messages/conversation/:conversationId - Get conversation messages
POST   /api/messages                           - Send message
PUT    /api/messages/:id                       - Edit message
DELETE /api/messages/:id                       - Delete message
PUT    /api/messages/:id/read                  - Mark as read
POST   /api/messages/:id/attachments           - Add attachment
GET    /api/messages/unread-count              - Get unread count
GET    /api/messages/unread-by-conversation    - Get unread by conversation
POST   /api/messages/conversation/:conversationId/read - Mark all as read
```

### Conversations: `/api/conversations`
```
GET    /api/conversations                      - Get all conversations
GET    /api/conversations/:id                  - Get specific conversation
POST   /api/conversations                      - Create conversation
PUT    /api/conversations/:id                  - Update conversation
POST   /api/conversations/:id/participants     - Add participants
DELETE /api/conversations/:id/participants/:participantId - Remove participant
POST   /api/conversations/:id/leave            - Leave conversation
PATCH  /api/conversations/:id/archive          - Archive/unarchive
```

## Models

### Note
- case (ref: Case)
- title, content
- type (enum)
- priority (enum)
- tags (array)
- attachments (array)
- mentions (array of User refs)
- isPrivate, isPinned
- createdBy, lastEditedBy
- version, history (array)
- relatedRecords (array)

### Message
- conversation (ref: Conversation)
- sender (ref: User)
- content
- messageType (text, file, system)
- attachments (array)
- readBy (array with timestamps)
- isEdited, editedAt
- isDeleted, deletedAt
- replyTo (ref: Message)

### Conversation
- case (ref: Case)
- participants (array with roles)
- type (direct, group, case)
- title, description
- lastMessage (ref: Message)
- lastMessageAt
- isArchived, archivedAt
- createdBy (ref: User)

## Services

### noteService
- getCaseNoteStats()
- notifyMentionedUsers()
- getAllTags()
- searchNotes()
- getRecentNotes()
- getNotesByTags()
- duplicateNote()
- exportNotes()

### messageService
- getUnreadCount()
- getUnreadByConversation()
- notifyParticipants()
- markAllAsRead()
- getMessageStats()
- searchMessages()
- getRecentMessages()

### conversationService
- findDirectConversation()
- getOrCreateDirectConversation()
- getCaseConversations()
- getUserConversations()
- getConversationStats()
- isUserParticipant()
- getActiveConversations()
- archiveOldConversations()

## Usage Examples

### Create Note
```javascript
POST /api/notes
{
  "case": "64abc123...",
  "title": "Medical Review Findings",
  "content": "Detailed analysis of medical records...",
  "type": "medical",
  "priority": "high",
  "tags": ["review", "urgent"],
  "mentions": ["64def456..."],
  "isPinned": true
}
```

### Send Message
```javascript
POST /api/messages
{
  "conversationId": "64abc123...",
  "content": "Please review the updated timeline",
  "replyTo": "64def456..."
}
```

### Create Conversation
```javascript
POST /api/conversations
{
  "type": "group",
  "title": "Case Discussion - Smith v. Hospital",
  "description": "Team discussion for case review",
  "participants": ["64abc123...", "64def456..."],
  "caseId": "64ghi789..."
}
```

### Search Notes
```javascript
GET /api/notes/search?q=medical+review&case=64abc123&type=medical
```

### Get Unread Messages
```javascript
GET /api/messages/unread-count
// Returns: { "unreadCount": 15 }

GET /api/messages/unread-by-conversation
// Returns: [{ conversationId, title, type, unreadCount }]
```

## Authorization

- **Admin/Attorney**: Full access to all features
- **Staff/Consultant**: Can create/edit notes, send messages
- **Client**: Limited access through client portal

## Validation

All inputs validated using express-validator:
- Notes: title (1-200 chars), content required, valid types/priorities
- Messages: content (1-5000 chars), valid conversation
- Conversations: valid type, at least one participant

## Business Logic

### Note Versioning
- Automatic version history on content changes
- Track who edited and when
- Retrieve previous versions

### Message Read Tracking
- Track who read each message and when
- Calculate unread counts per conversation
- Mark all as read functionality

### Conversation Management
- Direct conversations auto-created between two users
- Group conversations support multiple participants
- Case conversations linked to specific cases
- Archive old inactive conversations

## Integration Points

- **Case Management**: Links notes and conversations to cases
- **User Management**: Tracks creators, editors, participants
- **Task Management**: Can reference tasks in notes
- **Timeline**: Can link notes to timeline events
- **Audit Logging**: All actions are logged

## Performance Considerations

- Indexed fields: case, createdBy, type, tags, isPinned
- Text search indexes on notes
- Compound indexes for common queries
- Pagination for large result sets
- Efficient unread count calculations

## HIPAA Compliance

- All collaboration data is audit logged
- Access control enforced at route level
- Secure messaging with read tracking
- Private notes support
- Conversation participant verification

---

**Module Status**: ✅ 100% Complete
**Last Updated**: February 2026
**Phase**: 7 - Collaboration & Notes
