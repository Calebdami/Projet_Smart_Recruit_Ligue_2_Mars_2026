/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('interactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('application_id').nullable().references('id').inTable('applications').onDelete('CASCADE');
    table.uuid('candidate_id').nullable().references('id').inTable('candidates').onDelete('CASCADE');
    table.uuid('recruiter_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enu('type', [
      'note', 'email', 'phone_call', 'status_change',
      'interview_scheduled', 'interview_completed',
      'offer_made', 'rejection', 'reminder', 'system_log'
    ]).notNullable();
    table.string('title').notNullable();
    table.text('content').nullable();
    table.boolean('is_private').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('application_id');
    table.index('candidate_id');
    table.index('recruiter_id');
    table.index('type');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('interactions');
};
