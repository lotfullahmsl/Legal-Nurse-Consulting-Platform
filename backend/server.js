require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// Import middleware
const errorHandler = require('./shared/middleware/errorHandler.middleware');
const logger = require('./shared/utils/logger.util');

// Import routes
const authRoutes = require('./modules/auth');
const userRoutes = require('./modules/user-management');
const clientRoutes = require('./modules/crm-case-intake/routes/client.routes');
const lawFirmRoutes = require('./modules/crm-case-intake/routes/lawFirm.routes');
const caseRoutes = require('./modules/crm-case-intake/routes/case.routes');
const medicalRecordRoutes = require('./modules/medical-records/routes/medicalRecord.routes');
const caseAnalysisRoutes = require('./modules/case-analysis/routes/caseAnalysis.routes');
const searchRoutes = require('./modules/ocr-search/routes/search.routes');
const fileShareRoutes = require('./modules/file-sharing-portal/routes/fileShare.routes');
const timelineRoutes = require('./modules/timeline-chronology/routes/timeline.routes');
const taskRoutes = require('./modules/task-workflow/routes/task.routes');
const workflowRoutes = require('./modules/task-workflow/routes/workflow.routes');
const deadlineRoutes = require('./modules/task-workflow/routes/deadline.routes');
const timeEntryRoutes = require('./modules/billing-time-tracking/routes/timeEntry.routes');
const invoiceRoutes = require('./modules/billing-time-tracking/routes/invoice.routes');
const billingRoutes = require('./modules/billing-time-tracking/routes/billing.routes');
const timeTrackingRoutes = require('./modules/billing-time-tracking/routes/timeTracking.routes');
const noteRoutes = require('./modules/collaboration/routes/note.routes');
const messageRoutes = require('./modules/collaboration/routes/message.routes');
const conversationRoutes = require('./modules/collaboration/routes/conversation.routes');

// Import services
const { schedulerService } = require('./modules/task-workflow');

// Initialize app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        logger.info('✅ MongoDB Connected Successfully');
        logger.info(`📊 Database: ${mongoose.connection.name}`);

        // Initialize scheduler after DB connection
        try {
            schedulerService.initializeScheduler();
            logger.info('✅ Task scheduler initialized');
        } catch (error) {
            logger.error('❌ Failed to initialize scheduler:', error);
        }
    })
    .catch((err) => {
        logger.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/law-firms', lawFirmRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/case-analysis', caseAnalysisRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/files', fileShareRoutes);
app.use('/api/timelines', timelineRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/time-tracking', timeTrackingRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    logger.info(`📍 API URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('❌ Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    schedulerService.stopScheduler();
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

module.exports = app;
