# Compliance & Security Module

## Overview
Phase 10 implementation providing HIPAA compliance, comprehensive audit trails, and security hardening for the Legal Nurse Consulting Platform.

## Features

### 10.1 Audit Module
- Comprehensive audit logging for all system activities
- User activity tracking
- Case access logs
- Data modification tracking
- Export audit logs to CSV
- Generate compliance reports
- Audit statistics and analytics

### 10.2 Compliance Features
- **HIPAA Audit Trails**: Complete logging of all PHI access and modifications
- **Data Encryption**: Encryption at rest (MongoDB) and in transit (HTTPS)
- **Access Control**: Role-based access control (RBAC) enforcement
- **Session Management**: Automatic session timeout after inactivity
- **Password Policies**: Enforced through User model validation
- **Audit Logging**: Tamper-proof audit trail for compliance

### 10.3 Security Hardening
- **Rate Limiting**: API rate limiting (100 req/15min general, 5 req/15min auth)
- **Input Validation**: Express-validator on all endpoints
- **NoSQL Injection Prevention**: MongoDB sanitization middleware
- **XSS Protection**: XSS-clean middleware
- **Security Headers**: Helmet.js with HIPAA-compliant headers
- **CSRF Protection**: Built into authentication flow
- **Request Logging**: Comprehensive audit logging

## API Endpoints

### Audit Logs
```
GET    /api/audit/logs              - Get all audit logs (Admin only)
GET    /api/audit/user/:userId      - Get user audit logs (Admin only)
GET    /api/audit/case/:caseId      - Get case audit logs (Admin, Attorney)
GET    /api/audit/export            - Export logs to CSV (Admin only)
POST   /api/audit/report            - Generate compliance report (Admin only)
GET    /api/audit/statistics        - Get audit statistics (Admin only)
```

## Security Middleware

### Rate Limiting
- **API Limiter**: 100 requests per 15 minutes per IP
- **Auth Limiter**: 5 login attempts per 15 minutes per IP

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer-Policy

### Data Sanitization
- NoSQL injection prevention
- XSS attack prevention
- Input validation on all endpoints

### HIPAA Compliance
- Cache-Control: no-store
- Pragma: no-cache
- Strict-Transport-Security
- Session timeout (30 minutes default)

## Usage Examples

### Get Audit Logs
```javascript
GET /api/audit/logs?startDate=2024-01-01&endDate=2024-12-31&page=1&limit=50

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "pages": 25
  }
}
```

### Generate Compliance Report
```javascript
POST /api/audit/report
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}

Response:
{
  "success": true,
  "data": {
    "period": { "startDate": "...", "endDate": "..." },
    "summary": {
      "totalActions": 15420,
      "failedLogins": 23,
      "dataAccess": 8500,
      "dataModifications": 3200
    },
    "actionsByType": [...],
    "actionsByUser": [...],
    "actionsByResource": [...]
  }
}
```

### Export Audit Logs
```javascript
GET /api/audit/export?startDate=2024-01-01&endDate=2024-12-31

Response: CSV file download
```

## Security Best Practices

### For Developers
1. Always use parameterized queries (Mongoose handles this)
2. Validate all user input using express-validator
3. Never log sensitive data (passwords, tokens, PHI)
4. Use HTTPS in production
5. Keep dependencies updated
6. Follow principle of least privilege for roles

### For Administrators
1. Regularly review audit logs
2. Monitor failed login attempts
3. Generate monthly compliance reports
4. Review user access permissions quarterly
5. Implement IP whitelisting for admin access (optional)
6. Enable 2FA for admin accounts (future enhancement)

## Compliance Checklist

- [x] Audit trail for all PHI access
- [x] Audit trail for all data modifications
- [x] User authentication and authorization
- [x] Session timeout
- [x] Data encryption in transit (HTTPS)
- [x] Data encryption at rest (MongoDB)
- [x] Access control (RBAC)
- [x] Audit log export capability
- [x] Compliance reporting
- [x] Security headers
- [x] Rate limiting
- [x] Input validation
- [x] XSS protection
- [x] NoSQL injection protection

## Dependencies
- express-rate-limit: Rate limiting
- helmet: Security headers
- express-mongo-sanitize: NoSQL injection prevention
- xss-clean: XSS attack prevention
- express-validator: Input validation

## Installation
```bash
cd backend
npm install
```

## Testing
```bash
npm test -- --grep "Audit"
npm test -- --grep "Security"
```

## Environment Variables
```
RATE_LIMIT_WINDOW=15          # Rate limit window in minutes
RATE_LIMIT_MAX_REQUESTS=100   # Max requests per window
SESSION_TIMEOUT=30            # Session timeout in minutes
```

## Notes
- All audit logs are stored in the `auditlogs` collection
- Audit logs are immutable (no updates or deletes)
- Failed login attempts are automatically logged
- All sensitive operations are logged
- Logs include IP address, user agent, and timestamp
- CSV exports include all relevant audit information
