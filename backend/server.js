require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/auth');
const templateRoutes = require('./routes/templates');
const workflowRoutes = require('./routes/workflows');
const ruleRoutes = require('./routes/rules');
const patientRoutes = require('./routes/patients');
const visitRoutes = require('./routes/visits');
const prescriptionRoutes = require('./routes/prescriptions');

const app = express();

// 1. Connect to Database
connectDB();

// 2. Security Middleware
app.use(helmet()); 

// CORS configuration
// NOTE: Ensure config.corsOrigin is NOT '*' if credentials is true.
// It must be specific, e.g., 'http://localhost:5173'
app.use(cors({
    origin: config.corsOrigin, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for auth routes (Login/Register) - Strict is good here
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // INCREASED: 5 is too low for testing (accidental double clicks, etc)
    standardHeaders: true, 
    legacyHeaders: false,
    message: { success: false, error: 'Too many login attempts, please try again after 15 minutes' }
});

// Rate limiting for general API - Needs to be generous for React Apps
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // INCREASED: 100 was too low. React dashboards fetch data aggressively.
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later' }
});

// 3. Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Logging Middleware
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// 5. Base Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'AdaptaForms API is running',
        version: '1.0.0',
        environment: config.nodeEnv
    });
});

// Health check endpoint (Keep outside rate limiters for load balancers)
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// 6. API Routes
app.use('/api/auth', authLimiter, authRoutes);
// Apply apiLimiter to data routes
app.use('/api/templates', apiLimiter, templateRoutes);
app.use('/api/workflows', apiLimiter, workflowRoutes);
app.use('/api/rules', apiLimiter, ruleRoutes);
app.use('/api/patients', apiLimiter, patientRoutes);
app.use('/api/visits', apiLimiter, visitRoutes);
app.use('/api/prescriptions', apiLimiter, prescriptionRoutes);

// 7. 404 Handler (Moved BEFORE Error Handler)
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    // Pass the error to the global error handler
    next(error);
});

// 8. Global Error Handler (Must be last)
app.use(errorHandler);

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
    // Determine color based on environment (Optional helper)
    const envColor = config.nodeEnv === 'production' ? '\x1b[31m' : '\x1b[32m'; // Red for prod, Green for dev
    const resetColor = '\x1b[0m';

    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         AdaptaForms Backend API Server                ║
║                                                       ║
║  Status:   Online 🟢                                  ║
║  Mode:     ${envColor}${config.nodeEnv.toUpperCase()}${resetColor}                                    ║
║  Port:     ${PORT}                                       ║
║  Database: MongoDB                                    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections (e.g. DB connection fail)
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;