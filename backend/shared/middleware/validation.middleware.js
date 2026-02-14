const { validationResult } = require('express-validator');

// Validate request using express-validator
// Can be used in two ways:
// 1. As middleware directly: router.post('/path', validators, validate, controller)
// 2. As a function: router.post('/path', validate(validators), controller)
exports.validate = (validatorsOrReq, res, next) => {
    // If called as a function with validators array
    if (Array.isArray(validatorsOrReq)) {
        return async (req, res, next) => {
            // Run all validations
            for (let validation of validatorsOrReq) {
                await validation.run(req);
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array().map(err => ({
                        field: err.param,
                        message: err.msg
                    }))
                });
            }

            next();
        };
    }

    // If called as middleware directly (req is the first parameter)
    const req = validatorsOrReq;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }

    next();
};

// Sanitize input data
exports.sanitize = (fields) => {
    return (req, res, next) => {
        fields.forEach(field => {
            if (req.body[field]) {
                req.body[field] = req.body[field].trim();
            }
        });
        next();
    };
};
