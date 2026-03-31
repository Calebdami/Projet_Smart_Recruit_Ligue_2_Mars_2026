/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('webinars', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('host_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description').nullable();
    table.string('slug').unique().notNullable();
    table.timestamp('scheduled_at').notNullable();
    table.integer('duration_minutes').defaultTo(60);
    table.string('timezone').defaultTo('UTC');
    table.string('stream_link').nullable();
    table.string('recording_url').nullable();
    table.enu('status', ['draft', 'scheduled', 'live', 'ended', 'cancelled']).defaultTo('draft');
    table.integer('max_attendees').nullable();
    table.integer('registered_count').defaultTo(0);
    table.integer('attended_count').defaultTo(0);
    table.boolean('is_public').defaultTo(true);
    table.boolean('requires_registration').defaultTo(true);
    table.jsonb('tags').defaultTo('[]');
    table.jsonb('speakers').defaultTo('[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('host_id');
    table.index('slug');
    table.index('status');
    table.index('scheduled_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('webinars');
};
