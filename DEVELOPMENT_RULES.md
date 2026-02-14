# Development Rules & Guidelines
## Legal Nurse Consulting Software - MERN Stack

---

## 🎯 CRITICAL RULES - MUST FOLLOW

### 1. MODULARITY IS MANDATORY
- Each of the 14 modules MUST be completely independent
- No module should directly depend on another module's internal logic
- All inter-module communication MUST go through APIs or shared services
- Each module should be able to be developed, tested, and deployed independently

### 2. FOLDER STRUCTURE - STRICT HIERARCHY
```
project-root/
├── backend/
│   ├── modules/
│   │   ├── crm-case-intake/
│   │   ├── medical-records/
│   │   ├── ocr-search/
│   │   ├── timeline-chronology/
│   │   ├── case-analysis/
│   │   ├── damages-tracking/
│   │   ├── reporting/
│   │   ├── file-sharing-portal/
│   │   ├── task-workflow/
│   │   ├── billing-time-tracking/
│   │   ├── collaboration/
│   │   ├── compliance-security/
│   │   ├── analytics/
│   │   └── integrations/
│   ├── shared/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── services/
│   ├── models/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── crm-case-intake/
│   │   │   ├── medical-records/
│   │   │   ├── ocr-search/
│   │   │   ├── timeline-chronology/
│   │   │   ├── case-analysis/
│   │   │   ├── damages-tracking/
│   │   │   ├── reporting/
│   │   │   ├── file-sharing-portal/
│   │   │   ├── task-workflow/
│   │   │   ├── billing-time-tracking/
│   │   │   ├── collaboration/
│   │   │   ├── compliance-security/
│   │   │   ├── analytics/
│   │   │   └── integrations/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── services/
│   │   ├── layouts/
│   │   ├── routes/
│   │   └── App.js
│   └── public/
└── docs/
```

### 3. MODULE STRUCTURE - EACH MODULE MUST HAVE

**Backend Module Structure:**
```
module-name/
├── controllers/       # Handle HTTP requests
├── services/         # Business logic
├── routes/           # API endpoints
├── validators/       # Input validation
├── tests/           # Unit & integration tests
└── index.js         # Module entry point
```

**Frontend Module Structure:**
```
module-name/
├── components/      # React components
├── pages/          # Page-level components
├── hooks/          # Custom React hooks
├── services/       # API calls
├── utils/          # Helper functions
├── styles/         # Module-specific styles
├── tests/          # Component tests
└── index.js        # Module exports
```

### 4. NAMING CONVENTIONS - STRICTLY ENFORCE

**Files:**
- Components: `PascalCase.jsx` (e.g., `ClientForm.jsx`)
- Services: `camelCase.service.js` (e.g., `caseIntake.service.js`)
- Controllers: `camelCase.controller.js` (e.g., `client.controller.js`)
- Models: `PascalCase.model.js` (e.g., `Client.model.js`)
- Routes: `camelCase.routes.js` (e.g., `case.routes.js`)
- Utils: `camelCase.util.js` (e.g., `dateFormatter.util.js`)

**Variables & Functions:**
- Variables: `camelCase` (e.g., `clientData`, `caseId`)
- Functions: `camelCase` (e.g., `getClientById`, `createCase`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_FILE_SIZE`, `API_BASE_URL`)
- Classes: `PascalCase` (e.g., `ClientService`, `CaseController`)

**Database Collections:**
- Plural PascalCase (e.g., `Users`, `Clients`, `Cases`, `MedicalRecords`)

**API Endpoints:**
- Lowercase with hyphens (e.g., `/api/case-intake`, `/api/medical-records`)

---

## 🔒 SECURITY RULES - NON-NEGOTIABLE

### 1. Authentication & Authorization
- EVERY API endpoint MUST have authentication middleware
- Role-based access control (RBAC) MUST be implemented on ALL routes
- JWT tokens MUST expire (recommended: 24 hours for access, 7 days for refresh)
- Passwords MUST be hashed using bcrypt (minimum 10 salt rounds)
- NEVER store sensitive data in localStorage (use httpOnly cookies for tokens)

### 2. Data Validation
- EVERY input MUST be validated on both frontend AND backend
- Use Joi or express-validator for backend validation
- Sanitize ALL user inputs to prevent XSS attacks
- Validate file uploads (type, size, content)

### 3. HIPAA Compliance
- ALL medical data MUST be encrypted at rest (AES-256)
- ALL data transmission MUST use HTTPS/TLS
- Implement audit logging for ALL access to medical records
- Data retention policies MUST be configurable
- Implement automatic session timeout (recommended: 15 minutes of inactivity)
- PHI (Protected Health Information) MUST NEVER be logged in plain text

### 4. File Security
- Uploaded files MUST be scanned for malware
- Files MUST be stored outside the web root
- Use signed URLs for file access with expiration
- Implement watermarking for sensitive documents
- Track all file downloads with user ID and timestamp

---

## 📊 DATABASE RULES - MONGODB ATLAS

### 1. Schema Design
- EVERY collection MUST have a Mongoose schema
- Use proper data types (String, Number, Date, ObjectId, etc.)
- Implement schema validation at the database level
- Add indexes for frequently queried fields
- Use references (ObjectId) for relationships, not embedding large documents

### 2. Required Fields in Every Collection
```javascript
{
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  isDeleted: { type: Boolean, default: false },  // Soft delete
  deletedAt: { type: Date, default: null }
}
```

### 3. Query Optimization
- ALWAYS use `.select()` to limit returned fields
- Implement pagination for ALL list endpoints (default: 20 items per page)
- Use `.lean()` for read-only queries (faster performance)
- Create compound indexes for complex queries
- Use aggregation pipeline for complex data transformations

### 4. Data Integrity
- Use transactions for operations affecting multiple collections
- Implement soft delete (set `isDeleted: true`) instead of hard delete
- Maintain referential integrity with pre/post hooks
- Validate data before saving to database

---

## 🎨 FRONTEND RULES - REACT

### 1. Component Structure
- ONE component per file
- Maximum 300 lines per component (split if larger)
- Use functional components with hooks (NO class components)
- Implement proper prop validation using PropTypes or TypeScript
- Keep components pure and reusable

### 2. State Management
- Use React Context API for global state (auth, user, theme)
- Use local state (useState) for component-specific data
- Consider Redux only if state becomes too complex
- NEVER store sensitive data in state
- Implement proper error boundaries

### 3. API Calls
- ALL API calls MUST be in service files, NOT in components
- Implement proper error handling for ALL API calls
- Show loading states during API calls
- Implement retry logic for failed requests
- Use axios interceptors for token refresh

### 4. Performance
- Implement lazy loading for routes and heavy components
- Use React.memo() for expensive components
- Implement virtualization for long lists (react-window)
- Optimize images (compress, use appropriate formats)
- Implement code splitting

### 5. Accessibility
- ALL forms MUST have proper labels
- Implement keyboard navigation
- Use semantic HTML elements
- Add ARIA attributes where necessary
- Maintain proper color contrast ratios

---

## 🔌 API RULES - REST ENDPOINTS

### 1. Endpoint Structure
```
GET    /api/v1/resource          # Get all (with pagination)
GET    /api/v1/resource/:id      # Get one by ID
POST   /api/v1/resource          # Create new
PUT    /api/v1/resource/:id      # Update (full)
PATCH  /api/v1/resource/:id      # Update (partial)
DELETE /api/v1/resource/:id      # Delete
```

### 2. Response Format - MUST BE CONSISTENT
**Success Response:**
```javascript
{
  success: true,
  data: { /* actual data */ },
  message: "Operation successful",
  timestamp: "2026-02-14T10:30:00Z"
}
```

**Error Response:**
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human-readable error message",
    details: { /* additional error info */ }
  },
  timestamp: "2026-02-14T10:30:00Z"
}
```

### 3. HTTP Status Codes - USE CORRECTLY
- `200` - OK (successful GET, PUT, PATCH)
- `201` - Created (successful POST)
- `204` - No Content (successful DELETE)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (authenticated but not authorized)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (semantic errors)
- `500` - Internal Server Error

### 4. Pagination & Filtering
**Query Parameters:**
```
GET /api/v1/cases?page=1&limit=20&sort=-createdAt&status=active&search=john
```

**Response with Pagination:**
```javascript
{
  success: true,
  data: [ /* array of items */ ],
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 200,
    itemsPerPage: 20,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

---

## 🧪 TESTING RULES - MANDATORY

### 1. Test Coverage Requirements
- Minimum 70% code coverage for backend
- Minimum 60% code coverage for frontend
- ALL critical paths MUST have tests
- ALL API endpoints MUST have integration tests

### 2. Testing Stack
**Backend:**
- Jest for unit tests
- Supertest for API integration tests
- MongoDB Memory Server for database tests

**Frontend:**
- Jest for unit tests
- React Testing Library for component tests
- Cypress or Playwright for E2E tests

### 3. Test File Naming
- Unit tests: `filename.test.js`
- Integration tests: `filename.integration.test.js`
- E2E tests: `filename.e2e.test.js`

### 4. What to Test
**Backend:**
- Controller functions
- Service layer business logic
- Validation logic
- Authentication & authorization
- Database operations

**Frontend:**
- Component rendering
- User interactions
- Form submissions
- API call handling
- Error states

---

## 📝 CODE QUALITY RULES

### 1. Code Documentation
- EVERY function MUST have JSDoc comments
- Complex logic MUST have inline comments
- README.md MUST exist in every module folder
- API endpoints MUST be documented (Swagger/OpenAPI)

**JSDoc Example:**
```javascript
/**
 * Creates a new case in the system
 * @param {Object} caseData - The case information
 * @param {string} caseData.title - Case title
 * @param {string} caseData.clientId - Client ID reference
 * @returns {Promise<Object>} Created case object
 * @throws {ValidationError} If case data is invalid
 */
async function createCase(caseData) {
  // implementation
}
```

### 2. Code Formatting
- Use ESLint with Airbnb style guide
- Use Prettier for automatic formatting
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Maximum line length: 100 characters

### 3. Error Handling
- NEVER use empty catch blocks
- ALWAYS log errors with proper context
- Use custom error classes for different error types
- Implement global error handler middleware
- Return user-friendly error messages

**Error Handler Example:**
```javascript
class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}
```

### 4. Code Review Checklist
- [ ] Code follows naming conventions
- [ ] No hardcoded values (use config/env)
- [ ] Proper error handling implemented
- [ ] Input validation present
- [ ] Tests written and passing
- [ ] No console.logs in production code
- [ ] No commented-out code
- [ ] Documentation updated
- [ ] Security best practices followed

---

## 🔐 ENVIRONMENT VARIABLES - REQUIRED

### Backend (.env)
```
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
DB_NAME=legal_nurse_consulting

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=7d

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=legal-nurse-docs

# OCR Service
OCR_API_KEY=your-ocr-api-key
OCR_API_URL=https://ocr-service.com/api

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@legalconsulting.com

# Security
ENCRYPTION_KEY=your-32-char-encryption-key
BCRYPT_ROUNDS=10
SESSION_TIMEOUT=900000

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ENV=development
REACT_APP_MAX_FILE_SIZE=52428800
REACT_APP_ALLOWED_FILE_TYPES=.pdf,.jpg,.png,.doc,.docx
```

**CRITICAL:** NEVER commit .env files to Git!

---

## 📦 DEPENDENCIES - APPROVED LIST

### Backend Dependencies
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.0.0",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.7.0",
  "express-validator": "^7.0.0",
  "multer": "^1.4.5",
  "aws-sdk": "^2.1300.0",
  "nodemailer": "^6.9.0",
  "pdfkit": "^0.13.0",
  "node-cron": "^3.0.2",
  "winston": "^3.8.0"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.10.0",
  "axios": "^1.3.0",
  "react-query": "^3.39.0",
  "@mui/material": "^5.12.0",
  "formik": "^2.2.9",
  "yup": "^1.1.0",
  "chart.js": "^4.2.0",
  "react-chartjs-2": "^5.2.0",
  "date-fns": "^2.29.0",
  "react-toastify": "^9.1.0"
}
```

**Rule:** Get approval before adding new dependencies!

---

## 🚀 DEPLOYMENT RULES

### 1. Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Security audit passed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Backup created

### 2. Git Workflow
- Main branch: `main` (production)
- Development branch: `develop`
- Feature branches: `feature/module-name-feature`
- Bug fix branches: `bugfix/issue-description`
- Hotfix branches: `hotfix/critical-issue`

**Commit Message Format:**
```
type(scope): subject

[optional body]

[optional footer]
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(case-intake): add conflict check validation

Implemented automatic conflict checking when creating new cases.
Checks against existing clients and opposing parties.

Closes #123
```

### 3. CI/CD Pipeline
- Automated testing on every push
- Code quality checks (ESLint, Prettier)
- Security scanning
- Automated deployment to staging
- Manual approval for production deployment

### 4. Monitoring & Logging
- Implement application performance monitoring (APM)
- Set up error tracking (Sentry or similar)
- Configure log aggregation
- Set up alerts for critical errors
- Monitor server resources (CPU, memory, disk)

---

## 📋 MODULE DEVELOPMENT CHECKLIST

For EACH of the 14 modules, ensure:

### Backend Module Checklist
- [ ] Mongoose models created with proper schema
- [ ] Controllers implemented with error handling
- [ ] Services contain business logic
- [ ] Routes defined with proper middleware
- [ ] Input validation implemented
- [ ] Authentication & authorization added
- [ ] Unit tests written (70%+ coverage)
- [ ] Integration tests written
- [ ] API documentation created
- [ ] Error handling implemented
- [ ] Logging added
- [ ] Module README.md created

### Frontend Module Checklist
- [ ] Components created following structure
- [ ] API service file created
- [ ] Forms with validation implemented
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Responsive design implemented
- [ ] Accessibility features added
- [ ] Component tests written (60%+ coverage)
- [ ] Module README.md created
- [ ] Props validated (PropTypes/TypeScript)

---

## 🎯 14 MODULES - SPECIFIC REQUIREMENTS

### Module 1: Client, Law Firm & Case Intake CRM
**Must Have:**
- Client CRUD operations
- Law firm management
- Attorney profiles
- Case creation with conflict checks
- Engagement setup
- Referral source tracking

### Module 2: Medical Records Organization & Indexing
**Must Have:**
- Large file upload support (chunked uploads)
- Document indexing by provider, date, type
- Pagination for multi-page documents
- Version control system
- Chain-of-custody logging
- Document categorization

### Module 3: OCR & Intelligent Medical Search
**Must Have:**
- Automatic OCR on upload
- Full-text search across all documents
- Page-level citation in search results
- Search result highlighting
- Advanced filters (date, provider, type)
- Search history tracking

### Module 4: Medical Timeline & Chronology Builder
**Must Have:**
- Citation-linked timeline entries
- Treatment tracking
- Medication tracking
- Lab results tracking
- Medical encounters tracking
- Chronological visualization
- Export timeline functionality

### Module 5: Case Analysis & Standards of Care
**Must Have:**
- Identify care deviations
- Flag documentation gaps
- Liability link identification
- Nursing expert insights generation
- Standards of care comparison
- Analysis report generation

### Module 6: Damages & Injury Tracking
**Must Have:**
- Injury documentation
- Functional impact tracking
- Future care needs assessment
- Economic damages calculation
- Non-economic damages tracking
- Structured damage summaries

### Module 7: Court-Ready Reports & Summaries
**Must Have:**
- Attorney-ready summary generation
- Medical chronology reports
- Trial brief generation
- PDF export functionality
- Word document export
- Customizable report templates

### Module 8: Secure File Sharing & Client Portal
**Must Have:**
- Encrypted file upload/download
- Access logs for all file activities
- Document watermarking
- Client portal with secure login
- Case status viewing
- Secure messaging system
- Expiring download links

### Module 9: Task, Workflow & Deadline Management
**Must Have:**
- Task creation and assignment
- Workflow automation
- Reminder notifications
- Court date tracking
- Statutory deadline monitoring
- Task progress tracking
- Recurring task templates

### Module 10: Time Tracking & Billing Engine
**Must Have:**
- Billable time tracking
- Multiple billing models (hourly, flat fee, contingency)
- Invoice generation
- Retainer management
- Payment tracking
- Time entry timer
- Billing reports

### Module 11: Collaboration & Internal Notes
**Must Have:**
- Internal notes system
- Attorney comments
- Version history for notes
- Note categorization
- Note search functionality
- @mention functionality

### Module 12: Compliance, Security & Audit Controls
**Must Have:**
- HIPAA-aligned security
- Role-based access control
- Comprehensive audit trails
- Secure data retention
- Access logs
- Compliance reports
- Data encryption

### Module 13: Analytics & Business Insights
**Must Have:**
- Case profitability dashboard
- Workload analytics
- Referral performance tracking
- Revenue reports
- Interactive charts
- Custom date range filtering
- Export analytics data

### Module 14: Integrations & System Administration
**Must Have:**
- Accounting system sync
- User role management
- System settings configuration
- API key management
- Integration logs
- System health monitoring

---

## ⚠️ COMMON MISTAKES TO AVOID

### 1. Backend Mistakes
- ❌ Not validating input data
- ❌ Storing passwords in plain text
- ❌ Not implementing pagination
- ❌ Exposing sensitive data in API responses
- ❌ Not handling errors properly
- ❌ Hardcoding configuration values
- ❌ Not using transactions for multi-collection operations
- ❌ Returning entire documents when only IDs needed
- ❌ Not implementing rate limiting
- ❌ Logging sensitive information

### 2. Frontend Mistakes
- ❌ Making API calls directly in components
- ❌ Not handling loading states
- ❌ Not handling error states
- ❌ Storing sensitive data in localStorage
- ❌ Not implementing proper form validation
- ❌ Not optimizing re-renders
- ❌ Not implementing lazy loading
- ❌ Hardcoding API URLs
- ❌ Not implementing proper error boundaries
- ❌ Ignoring accessibility

### 3. Database Mistakes
- ❌ Not creating indexes for frequently queried fields
- ❌ Not implementing soft delete
- ❌ Embedding large documents instead of referencing
- ❌ Not validating data at schema level
- ❌ Not using transactions for critical operations
- ❌ Not implementing proper error handling
- ❌ Not backing up data regularly

### 4. Security Mistakes
- ❌ Not implementing HTTPS
- ❌ Weak JWT secrets
- ❌ Not implementing rate limiting
- ❌ Not sanitizing user inputs
- ❌ Exposing error stack traces in production
- ❌ Not implementing CORS properly
- ❌ Not validating file uploads
- ❌ Not implementing session timeout
- ❌ Not logging security events

---

## 📚 DOCUMENTATION REQUIREMENTS

### 1. Code Documentation
- JSDoc comments for all functions
- Inline comments for complex logic
- README.md in every module
- API documentation (Swagger/OpenAPI)

### 2. Project Documentation
- Architecture diagrams
- Database schema diagrams
- API endpoint documentation
- Deployment guide
- User manuals
- Troubleshooting guide

### 3. README.md Template for Modules
```markdown
# Module Name

## Overview
Brief description of what this module does.

## Features
- Feature 1
- Feature 2

## API Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | /api/... | Description | Yes           |

## Database Collections
- Collection1: Description
- Collection2: Description

## Dependencies
- dependency1: Why it's needed
- dependency2: Why it's needed

## Testing
How to run tests for this module

## Notes
Any important notes or considerations
```

---

## 🔄 DEVELOPMENT WORKFLOW

### Daily Workflow
1. Pull latest changes from develop branch
2. Create feature branch from develop
3. Write code following all rules above
4. Write tests (aim for 70%+ coverage)
5. Run linter and fix all issues
6. Run all tests and ensure they pass
7. Commit with proper commit message
8. Push to remote branch
9. Create pull request
10. Address code review comments
11. Merge after approval

### Code Review Process
**Reviewer Must Check:**
- Code follows all naming conventions
- Proper error handling implemented
- Input validation present
- Tests written and passing
- No security vulnerabilities
- Documentation updated
- No hardcoded values
- Performance considerations addressed

### Testing Workflow
1. Write unit tests first (TDD approach recommended)
2. Write integration tests
3. Run tests locally before pushing
4. Ensure all tests pass in CI/CD pipeline
5. Maintain minimum coverage requirements

---

## 🎯 PERFORMANCE OPTIMIZATION RULES

### Backend Performance
- Use database indexes strategically
- Implement caching (Redis) for frequently accessed data
- Use pagination for all list endpoints
- Optimize database queries (use .lean(), .select())
- Implement request compression (gzip)
- Use connection pooling for database
- Implement background jobs for heavy operations
- Monitor and optimize slow queries

### Frontend Performance
- Implement code splitting
- Use lazy loading for routes and components
- Optimize images (compress, use WebP)
- Implement virtual scrolling for long lists
- Use React.memo() for expensive components
- Minimize bundle size
- Implement service workers for caching
- Use CDN for static assets

### File Upload Performance
- Implement chunked uploads for large files
- Process OCR in background jobs
- Use streaming for file downloads
- Implement progress indicators
- Compress files before upload (if applicable)

---

## 🛡️ SECURITY BEST PRACTICES

### Input Validation
```javascript
// Backend validation example
const { body, validationResult } = require('express-validator');

const validateCase = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('clientId').isMongoId().withMessage('Invalid client ID'),
  body('caseType').isIn(['personal-injury', 'medical-malpractice'])
    .withMessage('Invalid case type'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
```

### Authentication Middleware
```javascript
// JWT authentication middleware
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' }
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit login attempts
  message: 'Too many login attempts, please try again later'
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

---

## 📊 LOGGING STANDARDS

### Winston Logger Configuration
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### What to Log
**DO Log:**
- Authentication attempts (success/failure)
- Authorization failures
- API errors
- Database errors
- File uploads/downloads
- Critical business operations
- Performance metrics

**DON'T Log:**
- Passwords or tokens
- PHI (Protected Health Information)
- Credit card numbers
- Social security numbers
- Any sensitive personal data

---

## 🚨 ERROR HANDLING STANDARDS

### Custom Error Classes
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400);
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError
};
```

### Global Error Handler
```javascript
const errorHandler = (err, req, res, next) => {
  const logger = require('./logger');
  
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
      ...(isDevelopment && { stack: err.stack }),
      ...(err.details && { details: err.details })
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
```

---

## 🎨 UI/UX STANDARDS

### Design Principles
- Consistent spacing (use 8px grid system)
- Consistent color palette
- Clear visual hierarchy
- Responsive design (mobile-first approach)
- Accessible color contrast (WCAG AA minimum)
- Loading states for all async operations
- Error messages that are helpful and actionable
- Success feedback for user actions

### Form Design Rules
- Clear labels for all inputs
- Inline validation with helpful error messages
- Disable submit button during submission
- Show loading indicator during submission
- Clear success/error messages after submission
- Preserve form data on error
- Use appropriate input types (email, tel, date, etc.)

### Table Design Rules
- Implement pagination (default 20 items)
- Sortable columns
- Search/filter functionality
- Loading skeleton during data fetch
- Empty state with helpful message
- Row actions (edit, delete, view)
- Responsive design (stack on mobile)

---

## 📱 RESPONSIVE DESIGN BREAKPOINTS

```css
/* Mobile First Approach */
/* Extra small devices (phones, less than 576px) */
/* Default styles */

/* Small devices (tablets, 576px and up) */
@media (min-width: 576px) { }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { }

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) { }

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) { }
```

---

## 🔧 CONFIGURATION MANAGEMENT

### Config File Structure
```javascript
// config/index.js
module.exports = {
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET
  },
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 900000,
    encryptionKey: process.env.ENCRYPTION_KEY
  },
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
  }
};
```

---

## ✅ FINAL CHECKLIST BEFORE DEPLOYMENT

### Code Quality
- [ ] All linting errors fixed
- [ ] All tests passing (70%+ coverage)
- [ ] No console.logs in production code
- [ ] No commented-out code
- [ ] All TODOs addressed or documented

### Security
- [ ] All environment variables configured
- [ ] JWT secrets are strong and unique
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS prevention (sanitizing inputs)
- [ ] CSRF protection implemented

### Performance
- [ ] Database indexes created
- [ ] Pagination implemented
- [ ] Caching strategy in place
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading implemented

### Documentation
- [ ] API documentation complete
- [ ] README files updated
- [ ] Deployment guide created
- [ ] User manuals created
- [ ] Code comments added

### Monitoring
- [ ] Error tracking configured
- [ ] Performance monitoring set up
- [ ] Logging configured
- [ ] Alerts configured
- [ ] Backup strategy in place

---

## 📞 SUPPORT & ESCALATION

### When to Ask for Help
- Security concerns or vulnerabilities discovered
- Performance issues that can't be resolved
- Architecture decisions that affect multiple modules
- Third-party integration issues
- Database design questions
- Deployment issues

### How to Report Issues
1. Check documentation first
2. Search existing issues
3. Create detailed issue report with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs if applicable
   - Environment details

---

## 🎓 LEARNING RESOURCES

### Required Reading
- MongoDB Best Practices
- Express.js Security Best Practices
- React Performance Optimization
- OWASP Top 10 Security Risks
- HIPAA Compliance Guidelines

### Recommended Tools
- Postman (API testing)
- MongoDB Compass (database GUI)
- VS Code (IDE)
- Git (version control)
- Docker (containerization)

---

**Document Version**: 1.0  
**Last Updated**: February 14, 2026  
**Status**: MANDATORY - ALL RULES MUST BE FOLLOWED  

**Remember: These rules exist to ensure code quality, security, and maintainability. Following them will save time and prevent issues in the long run.**
