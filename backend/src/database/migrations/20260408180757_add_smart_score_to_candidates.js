/**
 * Restored migration file.
 * This file was missing but recorded in knex_migrations.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('candidates', 'smart_score');
  if (!hasColumn) {
    await knex.schema.alterTable('candidates', (table) => {
      table.decimal('smart_score', 5, 2).nullable().defaultTo(0);
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('candidates', 'smart_score');
  if (hasColumn) {
    await knex.schema.alterTable('candidates', (table) => {
      table.dropColumn('smart_score');
    });
  }
}
