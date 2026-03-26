/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.up = function(knex) {
  return knex.schema.createTable('audit_trail', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.string('action').notNullable(); // create, update, delete, view, export, etc.
    table.string('entity_type').notNullable(); // user, candidate, application, job, webinar, etc.
    table.uuid('entity_id').notNullable(); // ID of the affected entity
    table.text('old_values').nullable(); // JSON string of old values
    table.text('new_values').nullable(); // JSON string of new values
    table.string('ip_address').nullable();
    table.string('user_agent').nullable();
    table.string('session_id').nullable();
    table.string('request_id').nullable(); // For request tracing
    table.boolean('is_sensitive').defaultTo(false); // Mark sensitive operations
    table.jsonb('metadata').defaultTo('{}'); // Additional audit data
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('user_id');
    table.index('action');
    table.index('entity_type');
    table.index('entity_id');
    table.index('ip_address');
    table.index('is_sensitive');
    table.index('created_at');
    
    // Composite indexes for audit queries
    table.index(['entity_type', 'entity_id'], 'entity_idx');
    table.index(['user_id', 'created_at'], 'user_time_idx');
    table.index(['action', 'created_at'], 'action_time_idx');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.down = function(knex) {
  return knex.schema.dropTable('audit_trail');
};
