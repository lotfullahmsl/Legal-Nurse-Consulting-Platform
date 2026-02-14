const User = require('../../../models/User.model');
const AuditLog = require('../../../models/AuditLog.model');
const { generateToken, generateRefreshToken } = require('../../../shared/utils/jwt.util');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { fullName, email, password, phone, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Map frontend role to backend role
        // Frontend: attorney, consultant, client
        // Backend: admin, attorney, consultant, client
        const userRole = role || 'consultant';

        // Validate role
        const validRoles = ['admin', 'attorney', 'consultant', 'client'];
        if (!validRoles.includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            phone,
            role: userRole
        });

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Log registration
        await AuditLog.create({
            user: user._id,
            action: 'CREATE',
            resource: '/api/auth/register',
            method: 'POST',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            statusCode: 201
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    status: user.status
                },
                token,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user (include password)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is not active. Please contact administrator.'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Log login
        await AuditLog.create({
            user: user._id,
            action: 'LOGIN',
            resource: '/api/auth/login',
            method: 'POST',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            statusCode: 200
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    lastLogin: user.lastLogin
                },
                token,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        // Clear refresh token
        req.user.refreshToken = undefined;
        await req.user.save();

        // Log logout
        await AuditLog.create({
            user: req.user._id,
            action: 'LOGOUT',
            resource: '/api/auth/logout',
            method: 'POST',
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            statusCode: 200
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    status: user.status,
                    avatar: user.avatar,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const { verifyRefreshToken } = require('../../../shared/utils/jwt.util');
        const decoded = verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new tokens
        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Update refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};
