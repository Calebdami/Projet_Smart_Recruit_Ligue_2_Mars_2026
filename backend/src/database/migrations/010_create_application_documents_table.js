/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('application_documents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('application_id').notNullable().references('id').inTable('applications').onDelete('CASCADE');
    table.uuid('candidate_id').notNullable().references('id').inTable('candidates').onDelete('CASCADE');
    table.string('file_path').notNullable();
    table.string('original_name').notNullable();
    table.string('mime_type').notNullable();
    table.bigint('file_size').notNullable();
    table.string('file_hash').nullable();
    table.jsonb('scan_data').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('application_id');
    table.index('candidate_id');
    table.index('created_at');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('application_documents');
}
