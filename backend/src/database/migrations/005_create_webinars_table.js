/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.up = function(knex) {
  return knex.schema.createTable('webinars', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('host_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description').nullable();
    table.string('slug').unique().notNullable();
    table.timestamp('scheduled_at').notNullable();
    table.timestamp('duration_minutes').defaultTo(60);
    table.string('timezone').defaultTo('UTC');
    table.string('stream_link').nullable(); // Live streaming URL
    table.string('recording_url').nullable(); // Recording URL after event
    table.string('registration_link').nullable(); // External registration link
    table.enu('status', ['draft', 'scheduled', 'live', 'ended', 'cancelled']).defaultTo('draft');
    table.integer('max_attendees').nullable();
    table.integer('registered_count').defaultTo(0);
    table.integer('attended_count').defaultTo(0);
    table.boolean('is_public').defaultTo(true);
    table.boolean('requires_registration').defaultTo(true);
    table.boolean('send_reminders').defaultTo(true);
    table.string('thumbnail_url').nullable();
    table.jsonb('tags').defaultTo('[]'); // Array of tags
    table.jsonb('settings').defaultTo('{}'); // Webinar-specific settings
    table.text('agenda').nullable(); // JSON agenda with timestamps
    table.jsonb('speakers').defaultTo('[]'); // Array of speaker objects
    table.string('language').defaultTo('en');
    table.jsonb('metadata').defaultTo('{}'); // Additional fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('host_id');
    table.index('slug');
    table.index('status');
    table.index('scheduled_at');
    table.index('is_public');
    table.index('created_at');
    
    // GIN indexes for JSONB fields
    table.index('tags', 'tags_gin', { type: 'GIN' });
    table.index('speakers', 'speakers_gin', { type: 'GIN' });
    
    // Full-text search index
    table.index(['title', 'description'], 'webinars_search_idx', { type: 'FULLTEXT' });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.down = function(knex) {
  return knex.schema.dropTable('webinars');
};
