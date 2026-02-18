const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'CREATE', 'READ', 'UPDATE', 'DELETE',
            'LOGIN', 'LOGOUT', 'DATA_ACCESS',
            'GET', 'POST', 'PUT', 'PATCH',
            'view_case_analytics', 'view_revenue_analytics', 'view_workload_analytics',
            'view_referral_analytics', 'view_performance_metrics', 'export_analytics',
            'view_task_stats', 'view_client_stats', 'view_case_stats',
            'view_deadline_stats', 'view_audit_logs', 'export_audit_logs',
            'generate_compliance_report', 'view_audit_statistics',
            'view_notifications', 'mark_notification_read', 'delete_notification',
            'view_conversations', 'view_unread_count', 'send_message',
            'view_messages', 'create_conversation', 'delete_conversation'
        ]
    },
    resource: {
        type: String,
        required: true
    },
    resourceId: {
        type: String
    },
    method: {
        type: String
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    statusCode: {
        type: Number
    },
    requestBody: {
        type: mongoose.Schema.Types.Mixed
    },
    changes: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Index for faster queries
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

// TTL index for automatic deletion after retention period (7 years for HIPAA)
auditLogSchema.index({ timestamp: 1 }, {
    expireAfterSeconds: parseInt(process.env.AUDIT_LOG_RETENTION_DAYS || 2555) * 24 * 60 * 60
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
