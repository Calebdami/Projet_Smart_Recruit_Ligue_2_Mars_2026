import { createClient } from 'redis';

// Redis client configuration
const redisConfig = {
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    password: process.env.REDIS_PASSWORD || undefined,
    database: parseInt(process.env.REDIS_DB || '0', 10),
};

// Create and export Redis client
const redisClient = createClient(redisConfig);

// Redis connection health check
const checkRedisHealth = async () => {
    try {
        await redisClient.ping();
        return true;
    } catch (error) {
        console.error('Redis health check failed:', error);
        return false;
    }
};

// Redis connection event handlers
redisClient.on('connect', () => { console.log('Connected to Redis') });
redisClient.on('error', (error) => { console.error('Redis connection error:', error) });
redisClient.on('end', () => { console.log('Redis connection ended') });

// Graceful shutdown
const closeRedisConnection = async () => {
    try {
        await redisClient.quit();
        console.log('Redis connection closed successfully');
    } catch (error) {
        console.error('Error closing Redis connection:', error);
        throw error;
    }
};

// Cache helpers
const cache = {
    // Set cache with expiration
    set: async (key, value, ttl) => {
        const serializedValue = JSON.stringify(value);
        if (ttl) { await redisClient.setEx(key, ttl, serializedValue) } 
        else { await redisClient.set(key, serializedValue) }
    },

    // Get cache value
    get: async (key) => {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    },

    // Delete cache key
    del: async (key) => { await redisClient.del(key) },

    // Check if key exists
    exists: async (key) => {
        const result = await redisClient.exists(key);
        return result === 1;
    },

    // Set cache with expiration only if key doesn't exist
    setNX: async (key, value, ttl) => {
        const serializedValue = JSON.stringify(value);
        const result = await redisClient.setNX(key, serializedValue, { EX: ttl });
        return result;
    },

    // Increment counter
    incr: async (key) => { return await redisClient.incr(key) },

    // Increment counter with expiration
    incrWithExpiry: async (key, ttl) => {
        const multi = redisClient.multi();
        multi.incr(key);
        multi.expire(key, ttl);
        const results = await multi.exec();
        return results?.[0];
    },

    // Get TTL of key
    ttl: async (key) => { return await redisClient.ttl(key) },

    // Clear all cache (use with caution!)
    flush: async () => { await redisClient.flushDb() },
};

// Rate limiting helpers
const rateLimit = {
    // Check if user is rate limited
    isLimited: async (identifier, limit, windowMs) => {
        const key = `rate_limit:${identifier}`;
        const current = await redisClient.incr(key);
        
        if (current === 1) { await redisClient.expire(key, Math.ceil(windowMs / 1000)) }
        return current > limit;
    },

    // Get remaining requests
    getRemaining: async (identifier, limit) => {
        const key = `rate_limit:${identifier}`;
        const current = parseInt(await redisClient.get(key) || '0', 10);
        return Math.max(0, limit - current);
    },

    // Get time until reset
    getResetTime: async (identifier) => {
        const key = `rate_limit:${identifier}`;
        return await redisClient.ttl(key);
    },
};

// Session helpers
const session = {
    // Store session data
    set: async (sessionId, data, ttl = 86400) => {
        const key = `session:${sessionId}`;
        await cache.set(key, data, ttl);
    },

    // Get session data
    get: async (sessionId) => {
        const key = `session:${sessionId}`;
        return await cache.get(key);
    },

    // Delete session
    delete: async (sessionId) => {
        const key = `session:${sessionId}`;
        await cache.del(key);
    },

    // Refresh session TTL
    refresh: async (sessionId, ttl = 86400) => {
        const key = `session:${sessionId}`;
        await redisClient.expire(key, ttl);
    },
};

export {
    redisClient,
    checkRedisHealth,
    closeRedisConnection,
    cache,
    rateLimit,
    session,
};
