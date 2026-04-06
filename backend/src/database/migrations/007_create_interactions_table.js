/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function up(knex) {
    return knex.schema.createTable('interactions', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('application_id').nullable().references('id').inTable('applications').onDelete('CASCADE');
        table.uuid('candidate_id').nullable().references('id').inTable('candidates').onDelete('CASCADE');
        table.uuid('recruiter_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.enu('type', [
            'note', 
            'email', 
            'phone_call', 
            'status_change', 
            'interview_scheduled', 
            'interview_completed',
            'offer_made',
            'rejection',
            'reminder',
            'system_log'
        ]).notNullable();
        table.string('title').notNullable();
        table.text('content').nullable();
        table.jsonb('metadata').defaultTo('{}'); // Additional interaction data
        table.string('direction').nullable(); // inbound, outbound, internal
        table.string('channel').nullable(); // email, phone, sms, in_app
        table.boolean('is_private').defaultTo(false); // Visible to candidate or not
        table.timestamp('scheduled_at').nullable(); // For scheduled interactions
        table.timestamp('completed_at').nullable(); // When interaction was completed
        table.string('status').nullable(); // pending, completed, cancelled
        table.jsonb('attachments').defaultTo('[]'); // Array of attachment objects
        table.uuid('parent_id').nullable().references('id').inTable('interactions').onDelete('SET NULL'); // For threaded conversations
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        
        // Indexes
        table.index('application_id');
        table.index('candidate_id');
        table.index('recruiter_id');
        table.index('type');
        table.index('scheduled_at');
        table.index('completed_at');
        table.index('is_private');
        table.index('created_at');
        
        // Composite indexes for common queries
        table.index(['candidate_id', 'created_at'], 'candidate_time_idx');
        table.index(['application_id', 'type'], 'application_type_idx');
        table.index(['recruiter_id', 'created_at'], 'recruiter_time_idx');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function down(knex) {
    return knex.schema.dropTable('interactions');
}
