require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/adapta-forms',
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
