const { validationResult } = require('express-validator');

// Validate request using express-validator
exports.validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        for (let validation of validations) {
            const result = await validation.run(req);
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
