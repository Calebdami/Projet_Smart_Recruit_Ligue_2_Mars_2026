/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.up = function(knex) {
  return knex.schema.createTable('applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('candidate_id').notNullable().references('id').inTable('candidates').onDelete('CASCADE');
    table.uuid('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
    table.uuid('recruiter_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.enu('status', ['new', 'reviewing', 'screening', 'interview', 'technical_test', 'offer', 'rejected', 'hired', 'withdrawn']).defaultTo('new');
    table.enu('source', ['direct', 'linkedin', 'indeed', 'referral', 'webinar', 'other']).defaultTo('direct');
    table.decimal('ai_score', 5, 2).nullable(); // AI matching score (0-100)
    table.decimal('recruiter_score', 5, 2).nullable(); // Manual recruiter score (0-100)
    table.text('cover_letter').nullable();
    table.string('resume_version').nullable(); // Track which resume was used
    table.jsonb('screening_answers').defaultTo('{}'); // Answers to screening questions
    table.jsonb('interview_feedback').defaultTo('{}'); // Feedback from interviews
    table.jsonb('notes').defaultTo('[]'); // Array of notes objects
    table.text('rejection_reason').nullable();
    table.string('rejection_category').nullable(); // skills, experience, culture_fit, other
    table.decimal('salary_offered', 10, 2).nullable();
    table.string('salary_currency').nullable();
    table.timestamp('applied_at').defaultTo(knex.fn.now());
    table.timestamp('first_contact_at').nullable();
    table.timestamp('last_contact_at').nullable();
    table.timestamp('interview_date').nullable();
    table.timestamp('offer_date').nullable();
    table.timestamp('rejection_date').nullable();
    table.timestamp('hired_date').nullable();
    table.timestamp('withdrawn_date').nullable();
    table.string('next_step').nullable(); // What should happen next
    table.boolean('is_priority').defaultTo(false);
    table.boolean('is_archived').defaultTo(false);
    table.jsonb('metadata').defaultTo('{}'); // Additional fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Unique constraint to prevent duplicate applications
    table.unique(['candidate_id', 'job_id']);
    
    // Indexes
    table.index('candidate_id');
    table.index('job_id');
    table.index('recruiter_id');
    table.index('status');
    table.index('source');
    table.index('ai_score');
    table.index('recruiter_score');
    table.index('applied_at');
    table.index('is_priority');
    table.index('is_archived');
    table.index('created_at');
    
    // Composite indexes for common queries
    table.index(['job_id', 'status'], 'job_status_idx');
    table.index(['candidate_id', 'status'], 'candidate_status_idx');
    table.index(['status', 'applied_at'], 'status_applied_idx');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.down = function(knex) {
  return knex.schema.dropTable('applications');
};
