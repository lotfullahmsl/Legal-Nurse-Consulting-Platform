const AuditLog = require('../../models/AuditLog.model');

// Log all user actions for HIPAA compliance
exports.auditLog = (action) => {
    return async (req, res, next) => {
        try {
            // Store original send function
            const originalSend = res.send;

            // Override send function to capture response
            res.send = function (data) {
                // Create audit log entry
                if (req.user) {
                    AuditLog.create({
                        user: req.user._id,
                        action: action || req.method,
                        resource: req.originalUrl,
                        method: req.method,
                        ipAddress: req.ip || req.connection.remoteAddress,
                        userAgent: req.get('user-agent'),
                        statusCode: res.statusCode,
                        requestBody: sanitizeBody(req.body),
                        timestamp: new Date()
                    }).catch(err => {
                        console.error('Audit log error:', err);
                    });
                }

                // Call original send
                originalSend.call(this, data);
            };

            next();
        } catch (error) {
            // Don't fail request if audit logging fails
            console.error('Audit middleware error:', error);
            next();
        }
    };
};

// Sanitize sensitive data from logs
function sanitizeBody(body) {
    if (!body) return {};

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'ssn', 'creditCard'];

    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '***REDACTED***';
        }
    });

    return sanitized;
}

// Log data access for HIPAA compliance
exports.logDataAccess = async (req, res, next) => {
    try {
        if (req.user && req.params.id) {
            await AuditLog.create({
                user: req.user._id,
                action: 'DATA_ACCESS',
                resource: req.originalUrl,
                resourceId: req.params.id,
                method: req.method,
                ipAddress: req.ip || req.connection.remoteAddress,
                timestamp: new Date()
            });
        }
        next();
    } catch (error) {
        console.error('Data access log error:', error);
        next();
    }
};
