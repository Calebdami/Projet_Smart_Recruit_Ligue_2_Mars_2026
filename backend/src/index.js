import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config, validateConfig } from './config/index.js';
import { db, checkDatabaseHealth } from './config/database.js';
import { redisClient, checkRedisHealth, closeRedisConnection } from './config/redis.js';
import { rateLimitMiddleware } from './middleware/auth.js';
import { initCronJobs } from './utils/cron.js';

// Import routes
import authRoutes from './routes/auth.js';
import candidateRoutes from './routes/candidates.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import webinarRoutes from './routes/webinars.js';

// Validate configuration
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error);
  process.exit(1);
}

const app = express();

// Security middleware
if (config.security.helmetEnabled) {
  app.use(helmet());
}

// CORS configuration
app.use(cors({
  origin: config.security.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for all requests
app.use(rateLimitMiddleware(
  config.rateLimit.maxRequests,
  config.rateLimit.windowMs
));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    const redisHealth = await checkRedisHealth();
    
    const isHealthy = dbHealth && redisHealth;
    
    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '2.0.0',
        environment: config.nodeEnv,
        services: {
          database: dbHealth ? 'connected' : 'disconnected',
          redis: redisHealth ? 'connected' : 'disconnected',
        },
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'Health check failed',
      message: 'Unable to check system health',
    });
  }
});

// API routes
const apiRouter = express.Router();

// API version
app.use(`/api/${config.apiVersion}`, apiRouter);

// Mount routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/candidates', candidateRoutes);
apiRouter.use('/jobs', jobRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/webinars', webinarRoutes);

// Initialize background jobs
initCronJobs();

// API documentation endpoint
apiRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'SmartRecruit API',
      version: '2.0.0',
      description: 'Écosystème de Recrutement Prédictif & Engagement Candidat',
      endpoints: {
        auth: `/api/${config.apiVersion}/auth`,
        candidates: `/api/${config.apiVersion}/candidates`,
        jobs: `/api/${config.apiVersion}/jobs`,
        applications: `/api/${config.apiVersion}/applications`,
        webinars: `/api/${config.apiVersion}/webinars`,
      },
      documentation: `/api/${config.apiVersion}/docs`,
      health: '/health',
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);

  // Don't expose error details in production
  const isDevelopment = config.nodeEnv === 'development';
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.name || 'Internal server error',
    message: error.message || (isDevelopment ? error.message : 'Something went wrong'),
    ...(isDevelopment && { details: error.details, stack: error.stack }),
  });
});

// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close database connection
    await db.destroy();
    console.log('Database connection closed');
    
    // Close Redis connection
    await closeRedisConnection();
    console.log('Redis connection closed');
    
    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start server
const startServer = async () => {
  try {
    // Initialize Redis connection
    await redisClient.connect();
    console.log('Redis connected successfully');
    
    // Test database connection
    await db.raw('SELECT 1');
    console.log('Database connected successfully');
    
    // Start HTTP server
    app.listen(config.port, () => {
      console.log(`\n🚀 SmartRecruit API Server Started`);
      console.log(`🌐 Server running on: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
