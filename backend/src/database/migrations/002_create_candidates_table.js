/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('candidates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').unique().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable();
    table.string('phone').nullable();
    table.text('bio').nullable();
    table.jsonb('skills').defaultTo('[]');
    table.string('linkedin_url').nullable();
    table.string('github_url').nullable();
    table.string('portfolio_url').nullable();
    table.string('resume_path').nullable();
    table.string('location').nullable();
    table.string('experience_level').nullable();
    table.integer('years_experience').nullable();
    table.boolean('is_available').defaultTo(true);
    table.boolean('is_active').defaultTo(true);
    table.jsonb('education').defaultTo('[]');
    table.jsonb('experience').defaultTo('[]');
    table.jsonb('languages').defaultTo('[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('is_available');
    table.index('is_active');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('candidates');
};
