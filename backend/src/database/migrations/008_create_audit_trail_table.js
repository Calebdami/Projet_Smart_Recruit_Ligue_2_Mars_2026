/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('audit_trail', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.string('action').notNullable();
    table.string('entity_type').notNullable();
    table.uuid('entity_id').notNullable();
    table.text('old_values').nullable();
    table.text('new_values').nullable();
    table.string('ip_address').nullable();
    table.string('user_agent').nullable();
    table.boolean('is_sensitive').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('action');
    table.index('entity_type');
    table.index('entity_id');
    table.index('created_at');
    table.index(['entity_type', 'entity_id'], 'entity_idx');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('audit_trail');
};
