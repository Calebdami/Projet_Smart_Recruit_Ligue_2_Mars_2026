/**
 * Migration : Création de la table applications
 * Lie un candidat (candidate_id) à une offre (job_id)
 * avec un statut qui évolue dans le pipeline de recrutement
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Clés étrangères
    table.uuid('candidate_id').notNullable().references('id').inTable('candidates').onDelete('CASCADE');
    table.uuid('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
    table.uuid('recruiter_id').nullable().references('id').inTable('users').onDelete('SET NULL');

    // Statut du pipeline (colonne critique pour le Drag & Drop)
    table.enu('status', ['new', 'reviewing', 'interview', 'offer', 'hired', 'rejected']).defaultTo('new');

    // Lettre de motivation
    table.text('cover_letter').nullable();

    // Notes du recruteur (tableau JSON)
    table.jsonb('notes').defaultTo('[]');

    // Raison du rejet
    table.text('rejection_reason').nullable();

    // Timestamps
    table.timestamp('applied_at').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Contrainte : un candidat ne peut postuler qu'une fois par offre
    table.unique(['candidate_id', 'job_id']);

    // Index pour accélérer les requêtes fréquentes
    table.index('candidate_id');
    table.index('job_id');
    table.index('status');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('applications');
};
