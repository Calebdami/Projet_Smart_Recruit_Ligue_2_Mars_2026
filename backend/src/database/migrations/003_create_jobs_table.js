/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.up = function(knex) {
  return knex.schema.createTable('jobs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.text('requirements').nullable();
    table.jsonb('skills_required').defaultTo('[]'); // Array of required skills
    table.jsonb('skills_preferred').defaultTo('[]'); // Array of preferred skills
    table.string('department').nullable();
    table.string('location').nullable();
    table.string('country').nullable();
    table.boolean('remote_allowed').defaultTo(false);
    table.enu('remote_type', ['hybrid', 'full_remote', 'onsite']).nullable();
    table.string('employment_type').nullable(); // full_time, part_time, contract, internship
    table.string('experience_level').nullable(); // junior, mid, senior, executive
    table.decimal('salary_min', 10, 2).nullable();
    table.decimal('salary_max', 10, 2).nullable();
    table.string('currency').defaultTo('EUR');
    table.string('salary_period').defaultTo('yearly'); // hourly, monthly, yearly
    table.enu('status', ['draft', 'open', 'closed', 'paused', 'archived']).defaultTo('draft');
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_urgent').defaultTo(false);
    table.timestamp('published_at').nullable();
    table.timestamp('deadline_at').nullable();
    table.timestamp('closed_at').nullable();
    table.integer('applications_count').defaultTo(0);
    table.integer('views_count').defaultTo(0);
    table.string('reference_number').nullable();
    table.text('benefits').nullable();
    table.text('company_description').nullable();
    table.string('company_size').nullable();
    table.string('industry').nullable();
    table.jsonb('screening_questions').defaultTo('[]'); // Array of questions
    table.jsonb('metadata').defaultTo('{}'); // Additional fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('created_by');
    table.index('status');
    table.index('is_featured');
    table.index('is_urgent');
    table.index('published_at');
    table.index('deadline_at');
    table.index('location');
    table.index('experience_level');
    table.index('employment_type');
    table.index('created_at');
    
    // GIN indexes for JSONB fields
    table.index('skills_required', 'skills_required_gin', { type: 'GIN' });
    table.index('skills_preferred', 'skills_preferred_gin', { type: 'GIN' });
    table.index('screening_questions', 'screening_questions_gin', { type: 'GIN' });
    
    // Full-text search index
    table.index(['title', 'description'], 'jobs_search_idx', { type: 'FULLTEXT' });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.down = function(knex) {
  return knex.schema.dropTable('jobs');
};
