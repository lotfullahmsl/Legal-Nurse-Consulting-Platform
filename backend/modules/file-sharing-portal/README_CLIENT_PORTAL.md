# Client Portal Module

## Overview
The Client Portal module provides secure, client-facing APIs for case management, document access, messaging, and activity tracking.

## Features
- Client dashboard with case overview
- Case status and details viewing
- Secure document access and downloads
- Encrypted messaging with case team
- Activity timeline and updates
- Invoice and payment tracking
- Report access

## API Endpoints

### Dashboard
```
GET /api/client/dashboard
```
Returns client dashboard data including active cases, recent documents, unread messages, and pending invoices.

**Response:**
```json
{
  "success": true,
  "data": {
    "cases": [...],
    "documents": [...],
    "unreadMessages": 5,
    "pendingInvoices": [...],
    "recentActivity": [...],
    "stats": {
      "activeCases": 3,
      "totalDocuments": 12,
      "unreadMessages": 5,
      "pendingInvoices": 2
    }
  }
}
```

### Cases
```
GET /api/client/cases
GET /api/client/cases/:id
```
Get all client cases or specific case details.

**Query Parameters:**
- `status` - Filter by case status (optional)

### Documents
```
GET /api/client/documents
```
Get all documents shared with the client.

**Query Parameters:**
- `caseId` - Filter by case (optional)
- `fileType` - Filter by file type (optional)

### Messages
```
GET /api/client/messages
POST /api/client/messages
```
Get conversations and send messages.

**POST Body:**
```json
{
  "conversationId": "mongoId",
  "content": "Message text",
  "attachments": []
}
```

### Updates
```
GET /api/client/updates
```
Get activity timeline and case updates.

**Query Parameters:**
- `limit` - Number of updates to return (default: 20, max: 100)

### Invoices
```
GET /api/client/invoices
```
Get all invoices for client's cases.

### Reports
```
GET /api/client/reports
```
Get all reports generated for client's cases.

### Timeline
```
GET /api/client/timeline/:caseId
```
Get medical chronology timeline for a specific case.

## Authentication
All endpoints require:
- Valid JWT token in Authorization header
- User role: `client`

## Security Features
- Role-based access control (RBAC)
- Client can only access their own cases and data
- All file access is logged
- Encrypted messaging
- HIPAA-compliant data handling

## Error Handling
All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Usage Example

```javascript
// Frontend service example
import apiClient from './api.service';

export const clientPortalService = {
  getDashboard: () => apiClient.get('/client/dashboard'),
  getCases: (status) => apiClient.get('/client/cases', { params: { status } }),
  getCaseById: (id) => apiClient.get(`/client/cases/${id}`),
  getDocuments: (filters) => apiClient.get('/client/documents', { params: filters }),
  getMessages: (caseId) => apiClient.get('/client/messages', { params: { caseId } }),
  sendMessage: (data) => apiClient.post('/client/messages', data),
  getUpdates: (limit) => apiClient.get('/client/updates', { params: { limit } }),
  getInvoices: () => apiClient.get('/client/invoices'),
  getReports: () => apiClient.get('/client/reports'),
  getTimeline: (caseId) => apiClient.get(`/client/timeline/${caseId}`)
};
```

## Dependencies
- Case model
- FileShare model
- Message/Conversation models
- Invoice model
- Timeline model
- Report model
- AuditLog model

## Testing
Run tests with:
```bash
npm test -- --grep "Client Portal"
```

## Notes
- All client portal routes are prefixed with `/api/client`
- Clients can only access data for cases they are associated with
- All actions are logged in the audit trail
- File downloads are tracked and logged
