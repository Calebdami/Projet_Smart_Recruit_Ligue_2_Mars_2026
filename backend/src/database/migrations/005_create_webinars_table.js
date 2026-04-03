/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function up(knex) {
    return knex.schema.createTable('webinars', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('host_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('title').notNullable();
        table.text('description').nullable();
        table.string('slug').unique().notNullable();
        table.timestamp('scheduled_at').notNullable();
        table.integer('duration_minutes').defaultTo(60); // Changé en integer pour stocker des minutes
        table.string('timezone').defaultTo('UTC');
        table.string('stream_link').nullable();
        table.string('recording_url').nullable();
        table.string('registration_link').nullable();
        table.enu('status', ['draft', 'scheduled', 'live', 'ended', 'cancelled']).defaultTo('draft');
        table.integer('max_attendees').nullable();
        table.integer('registered_count').defaultTo(0);
        table.integer('attended_count').defaultTo(0);
        table.boolean('is_public').defaultTo(true);
        table.boolean('requires_registration').defaultTo(true);
        table.boolean('send_reminders').defaultTo(true);
        table.string('thumbnail_url').nullable();
        table.jsonb('tags').defaultTo('[]'); 
        table.jsonb('settings').defaultTo('{}'); 
        table.text('agenda').nullable(); 
        table.jsonb('speakers').defaultTo('[]'); 
        table.string('language').defaultTo('en');
        table.jsonb('metadata').defaultTo('{}');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        
        // Indexes standards
        table.index('host_id');
        table.index('slug');
        table.index('status');
        table.index('scheduled_at');
        table.index('is_public');
        table.index('created_at');
        
        // GIN indexes pour les champs JSONB (Spécifique Postgres)
        table.index('tags', 'tags_gin', 'GIN');
        table.index('speakers', 'speakers_gin', 'GIN');
    }).then(() => {
        // Full-text search index pour Postgres
        return knex.raw(`
            CREATE INDEX webinars_search_idx ON webinars 
            USING GIN (to_tsvector('french', title || ' ' || COALESCE(description, '')));
        `);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function down(knex) {
    return knex.schema.dropTable('webinars');
}