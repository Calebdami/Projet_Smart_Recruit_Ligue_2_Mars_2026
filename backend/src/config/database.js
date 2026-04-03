import knex from 'knex';
import config from '../../knexfile.js';

// Get environment-specific configuration
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Create and export the database connection
const db = knex(dbConfig);

// Database connection health check
const checkDatabaseHealth = async () => {
    try {
        await db.raw('SELECT 1');
        return true;
    } catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
};

// Graceful shutdown
const closeDatabaseConnection = async () => {
    try {
        await db.destroy();
        console.log('Database connection closed successfully');
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
};

// Transaction helper
const withTransaction = async (callback) => {
    return db.transaction(callback);
};

// Pagination helper
const paginateQuery = (
    query,
    page = 1,
    limit = 20
    ) => {
    const offset = (page - 1) * limit;
    return query.limit(limit).offset(offset);
};

// Soft delete helper
const addSoftDelete = (query) => { return query.whereNull('deleted_at') };

// Common query patterns
const buildSearchQuery = (
    query,
    searchTerm,
    searchFields
    ) => {
        if (searchTerm && searchFields.length > 0) {
            query.where((builder) => {
            searchFields.forEach((field, index) => {
                if (index === 0) { builder.where(field, 'ilike', `%${searchTerm}%`) } 
                else { builder.orWhere(field, 'ilike', `%${searchTerm}%`) }
            });
        });
    }
    return query;
};

export {
    db,
    checkDatabaseHealth,
    closeDatabaseConnection,
    withTransaction,
    paginateQuery,
    addSoftDelete,
    buildSearchQuery,
};
