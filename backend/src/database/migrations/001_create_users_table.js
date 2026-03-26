/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.enu('role', ['admin', 'recruiter', 'candidate']).notNullable().defaultTo('candidate');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone').nullable();
    table.string('avatar_url').nullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('email_verified').defaultTo(false);
    table.string('email_verification_token').nullable();
    table.timestamp('email_verified_at').nullable();
    table.string('two_factor_secret').nullable();
    table.boolean('two_factor_enabled').defaultTo(false);
    table.string('password_reset_token').nullable();
    table.timestamp('password_reset_expires').nullable();
    table.timestamp('last_login_at').nullable();
    table.string('last_login_ip').nullable();
    table.jsonb('preferences').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('email');
    table.index('role');
    table.index('is_active');
    table.index('email_verified');
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
