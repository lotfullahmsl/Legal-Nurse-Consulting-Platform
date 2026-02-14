const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../../../shared/middleware/validation.middleware');
const { protect } = require('../../../shared/middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

// Validation rules
const registerValidation = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
    body('role').optional().isIn(['admin', 'attorney', 'consultant', 'client']).withMessage('Invalid role')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
