const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

/**
 * Rate limiting middleware
 */
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Strict rate limiting for authentication endpoints
 */
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true
});

/**
 * Security headers middleware
 */
exports.securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
});

/**
 * Data sanitization against NoSQL injection
 */
exports.sanitizeData = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized key: ${key} in request from IP: ${req.ip}`);
    }
});

/**
 * Data sanitization against XSS
 */
exports.preventXSS = xss();

/**
 * HIPAA compliance headers
 */
exports.hipaaHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

/**
 * Request logging for audit trail
 */
exports.auditLogger = (req, res, next) => {
    const startTime = Date.now();

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            userId: req.user?._id,
            timestamp: new Date().toISOString()
        };

        // Only log if user is authenticated and it's a sensitive operation
        if (req.user && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            console.log('AUDIT:', JSON.stringify(logData));
        }
    });

    next();
};

/**
 * Session timeout middleware
 */
exports.sessionTimeout = (timeoutMinutes = 30) => {
    return (req, res, next) => {
        if (req.user && req.user.lastActivity) {
            const now = Date.now();
            const lastActivity = new Date(req.user.lastActivity).getTime();
            const timeout = timeoutMinutes * 60 * 1000;

            if (now - lastActivity > timeout) {
                return res.status(401).json({
                    success: false,
                    message: 'Session expired due to inactivity'
                });
            }
        }
        next();
    };
};

/**
 * IP whitelist middleware (optional)
 */
exports.ipWhitelist = (allowedIPs = []) => {
    return (req, res, next) => {
        if (allowedIPs.length === 0) {
            return next();
        }

        const clientIP = req.ip || req.connection.remoteAddress;

        if (!allowedIPs.includes(clientIP)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied from this IP address'
            });
        }

        next();
    };
};
