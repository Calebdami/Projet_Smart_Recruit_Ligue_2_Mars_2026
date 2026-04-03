/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function up(knex) {
    return knex.schema.createTable('webinar_registrations', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('webinar_id').notNullable().references('id').inTable('webinars').onDelete('CASCADE');
        table.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE');
        table.uuid('candidate_id').nullable().references('id').inTable('candidates').onDelete('CASCADE');
        table.string('email').notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('phone').nullable();
        table.string('company').nullable();
        table.string('position').nullable();
        table.enu('status', ['registered', 'confirmed', 'attended', 'no_show', 'cancelled']).defaultTo('registered');
        table.string('registration_source').defaultTo('direct'); // direct, email, social, referral
        table.jsonb('custom_fields').defaultTo('{}'); // Additional registration fields
        table.timestamp('registered_at').defaultTo(knex.fn.now());
        table.timestamp('confirmed_at').nullable();
        table.timestamp('attended_at').nullable();
        table.timestamp('cancelled_at').nullable();
        table.string('cancellation_reason').nullable();
        table.boolean('send_reminders').defaultTo(true);
        table.integer('reminder_sent_count').defaultTo(0);
        table.timestamp('last_reminder_sent_at').nullable();
        table.string('calendar_invite_url').nullable(); // Link to calendar invitation
        table.jsonb('metadata').defaultTo('{}'); // Additional fields
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        
        // Contrainte d'unicité pour empêcher les inscriptions en double (un email par webinaire)
        table.unique(['webinar_id', 'email']);
        
        // Indexes
        table.index('webinar_id');
        table.index('user_id');
        table.index('candidate_id');
        table.index('email');
        table.index('status');
        table.index('registered_at');
        table.index('attended_at');
        table.index('created_at');
        
        // Index composites pour les requêtes de filtrage courantes
        table.index(['webinar_id', 'status'], 'webinar_status_idx');
        table.index(['status', 'registered_at'], 'status_registered_idx');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function down(knex) {
    return knex.schema.dropTable('webinar_registrations');
}