/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('jobs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.text('requirements').nullable();
    table.jsonb('skills_required').defaultTo('[]');
    table.string('department').nullable();
    table.string('location').nullable();
    table.boolean('remote_allowed').defaultTo(false);
    table.string('employment_type').nullable();
    table.string('experience_level').nullable();
    table.decimal('salary_min', 10, 2).nullable();
    table.decimal('salary_max', 10, 2).nullable();
    table.string('currency').defaultTo('EUR');
    table.enu('status', ['draft', 'open', 'closed', 'paused', 'archived']).defaultTo('draft');
    table.timestamp('published_at').nullable();
    table.timestamp('deadline_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('created_by');
    table.index('status');
    table.index('location');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('jobs');
};
