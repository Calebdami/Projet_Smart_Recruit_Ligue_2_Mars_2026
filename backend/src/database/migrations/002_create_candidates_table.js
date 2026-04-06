/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function up(knex) {
    return knex.schema.createTable('candidates', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('user_id').unique().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.text('bio').nullable();
        table.jsonb('skills').defaultTo('[]'); // Array of skills with levels
        table.string('linkedin_url').nullable();
        table.string('github_url').nullable();
        table.string('portfolio_url').nullable();
        table.string('resume_path').nullable();
        table.string('resume_original_name').nullable();
        table.string('resume_mime_type').nullable();
        table.bigint('resume_size').nullable();
        table.string('semantic_hash').nullable(); // Anti-duplicate hash
        table.string('location').nullable();
        table.string('country').nullable();
        table.string('experience_level').nullable(); // junior, mid, senior, executive
        table.integer('years_experience').nullable();
        table.decimal('expected_salary_min', 10, 2).nullable();
        table.decimal('expected_salary_max', 10, 2).nullable();
        table.string('currency').defaultTo('EUR');
        table.boolean('is_available').defaultTo(true);
        table.boolean('is_active').defaultTo(true);
        table.jsonb('education').defaultTo('[]'); // Array of education objects
        table.jsonb('experience').defaultTo('[]'); // Array of work experience
        table.jsonb('languages').defaultTo('[]'); // Array of language objects
        table.jsonb('certifications').defaultTo('[]'); // Array of certifications
        table.string('headline').nullable(); // Professional headline
        table.string('current_company').nullable();
        table.string('current_position').nullable();
        table.timestamp('profile_completion_at').nullable();
        table.integer('profile_completion_percentage').defaultTo(0);
        table.jsonb('metadata').defaultTo('{}'); // Additional fields
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        
        // Indexes
        table.index('user_id');
        table.index('semantic_hash');
        table.index('location');
        table.index('experience_level');
        table.index('is_available');
        table.index('is_active');
        table.index('created_at');
        
        // GIN indexes for JSONB fields (spécifique à PostgreSQL)
        table.index('skills', 'skills_gin', 'GIN');
        table.index('education', 'education_gin', 'GIN');
        table.index('experience', 'experience_gin', 'GIN');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function down(knex) {
    return knex.schema.dropTable('candidates');
}
