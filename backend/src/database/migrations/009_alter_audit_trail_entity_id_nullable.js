/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function up(knex) {
    return knex.schema.alterTable('audit_trail', (table) => {
        table.uuid('entity_id').nullable().alter();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function down(knex) {
    return knex.schema.alterTable('audit_trail', (table) => {
        table.uuid('entity_id').notNullable().alter();
    });
}
