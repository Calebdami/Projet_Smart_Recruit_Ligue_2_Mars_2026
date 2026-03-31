/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('webinar_registrations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('webinar_id').notNullable().references('id').inTable('webinars').onDelete('CASCADE');
    table.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('candidate_id').nullable().references('id').inTable('candidates').onDelete('CASCADE');
    table.string('email').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone').nullable();
    table.enu('status', ['registered', 'confirmed', 'attended', 'no_show', 'cancelled']).defaultTo('registered');
    table.timestamp('registered_at').defaultTo(knex.fn.now());
    table.timestamp('attended_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['webinar_id', 'email']);
    table.index('webinar_id');
    table.index('user_id');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('webinar_registrations');
};
