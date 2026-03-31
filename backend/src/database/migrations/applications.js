/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Clés étrangères
    table.uuid('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
    table.uuid('candidate_id').notNullable().references('id').inTable('candidates').onDelete('CASCADE');

    // Statut du pipeline (Drag & Drop)
    table.enu('status', [
      'New',
      'Interview',
      'Technical_Test',
      'Hired',
      'Rejected'
    ]).notNullable().defaultTo('New');

    // Contenu
    table.text('cover_letter').nullable();
    table.text('notes').nullable();         // Notes du recruteur
    table.integer('score').nullable();      // Score IA (rempli par Binôme C)
    table.jsonb('answers').defaultTo('[]'); // Réponses aux screening_questions du job

    // Timestamps
    table.timestamp('applied_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Contrainte : un candidat ne peut postuler qu'une fois par job
    table.unique(['job_id', 'candidate_id']);

    // Index
    table.index('job_id');
    table.index('candidate_id');
    table.index('status');
    table.index('applied_at');
    table.index('score');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('applications');
};