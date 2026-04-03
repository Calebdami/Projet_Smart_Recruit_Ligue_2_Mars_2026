import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export configuration object
const config = {
    // Server Configuration
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
    
    // Database Configuration
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'smartrecruit_db',
        user: process.env.DB_USER || 'smartrecruit_user',
        password: process.env.DB_PASSWORD || 'password',
        ssl: process.env.DB_SSL === 'true',
    },
    
    // Redis Configuration
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0', 10),
    },
    
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    
    // 2FA Configuration
    twoFactor: { secretBase: process.env.TWO_FACTOR_SECRET_BASE || 'smartrecruit_2fa_base', },
    
    // Email Configuration
    email: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@smartrecruit.com',
        fromName: process.env.EMAIL_FROM_NAME || 'SmartRecruit Team',
    },
    
    // File Upload Configuration
    upload: {
        directory: process.env.UPLOAD_DIR || 'uploads',
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
        allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/webp',
        ],
    },
    
    // S3 Configuration (Optional)
    s3: {
        bucket: process.env.S3_BUCKET || '',
        region: process.env.S3_REGION || 'us-east-1',
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        endpoint: process.env.S3_ENDPOINT || '',
    },
    
    // Rate Limiting Configuration
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
    
    // Webinar Configuration
    webinar: {
        baseUrl: process.env.WEBINAR_BASE_URL || '',
        apiKey: process.env.WEBINAR_API_KEY || '',
        apiSecret: process.env.WEBINAR_API_SECRET || '',
    },
    
    // Security Configuration
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
        corsOrigins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        helmetEnabled: process.env.HELMET_ENABLED === 'true',
    },
    
    // AI Configuration
    ai: {
        scoringEnabled: process.env.AI_SCORING_ENABLED === 'true',
        modelPath: process.env.AI_MODEL_PATH || './models/scoring-model.json',
        semanticThreshold: parseFloat(process.env.SEMANTIC_SIMILARITY_THRESHOLD || '0.8'),
    },
    
    // Logging Configuration
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      sentryDsn: process.env.SENTRY_DSN || '',
      metricsEnabled: process.env.METRICS_ENABLED === 'true',
    },
    
    // Cron Jobs Configuration
    cron: {
        reminderEnabled: process.env.CRON_REMINDER_ENABLED === 'true',
        cleanupEnabled: process.env.CRON_CLEANUP_ENABLED === 'true',
        reportEnabled: process.env.CRON_REPORT_ENABLED === 'true',
    },
    
    // Feature Flags
    features: {
        aiScoring: process.env.AI_SCORING_ENABLED === 'true',
        webinars: true, // Always enabled in v2.0
        twoFactorAuth: true,
        emailNotifications: true,
        auditTrail: true,
        rateLimiting: true,
    },
};

// Validation helper
const validateConfig = () => {
    const requiredVars = [
        'JWT_SECRET',
        'DB_HOST',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) { throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`) }
    
    // Warn about optional but recommended variables
    const recommendedVars = [
        'SMTP_USER',
        'SMTP_PASS',
        'REDIS_HOST',
        'WEBINAR_API_KEY',
    ];
    
    const missingRecommended = recommendedVars.filter(varName => !process.env[varName]);
    
    if (missingRecommended.length > 0) { console.warn(`Warning: Missing recommended environment variables: ${missingRecommended.join(', ')}`) }
};

export { config, validateConfig };