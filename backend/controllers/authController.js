const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../middleware/auth');
const { logAudit } = require('../middleware/auditLogger');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { username, email, password, role, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email or username'
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'user',
            firstName,
            lastName
        });

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
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

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            await logAudit({
                action: 'FAILED_LOGIN',
                details: { email, reason: 'User not found' },
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent']
            });

            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            await logAudit({
                user: user._id,
                action: 'FAILED_LOGIN',
                details: { email, reason: 'Invalid password' },
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent']
            });

            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is inactive'
            });
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await logAudit({
            user: user._id,
            action: 'LOGIN',
            details: { email },
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                token,
                refreshToken
            }
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
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Please provide refresh token'
            });
        }

        const jwt = require('jsonwebtoken');
        const config = require('../config/config');

        const decoded = jwt.verify(refreshToken, config.jwtSecret);
        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Invalid refresh token'
            });
        }

        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

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
            error: 'Invalid refresh token'
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        await logAudit({
            user: req.user._id,
            action: 'LOGOUT',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
