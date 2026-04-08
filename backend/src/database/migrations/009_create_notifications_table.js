/**
 * Migration : Création de la table notifications
 * Système de notifications centralisé pour tout le projet
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Destinataire de la notification
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    
    // Type de notification
    table.enu('type', [
      'application_received',    // Nouvelle candidature reçue
      'application_status',     // Changement de statut de candidature
      'job_published',          // Offre publiée
      'job_expired',            // Offre expirée
      'webinar_reminder',       // Rappel webinar
      'webinar_started',        // Webinar commencé
      'profile_viewed',         // Profil consulté
      'system_update',          // Mise à jour système
      'security_alert',         // Alertes sécurité
      'deadline_reminder',      // Rappel deadline
      'new_message',            // Nouveau message
      'task_assigned',          // Tâche assignée
      'achievement'             // Succès/achievement
    ]).notNullable();
    
    // Titre et contenu
    table.string('title').notNullable();
    table.text('message').notNullable();
    
    // Métadonnées JSON (données contextuelles)
    table.jsonb('data').defaultTo('{}');
    
    // Statut de lecture
    table.boolean('is_read').defaultTo(false);
    table.timestamp('read_at').nullable();
    
    // Priorité
    table.enu('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    
    // Canal de notification
    table.enu('channel', ['in_app', 'email', 'push', 'sms']).defaultTo('in_app');
    
    // Expiration (notifications temporaires)
    table.timestamp('expires_at').nullable();
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Index pour performances
    table.index('user_id');
    table.index('type');
    table.index('is_read');
    table.index('created_at');
    table.index('priority');
    
    // Index composite pour requêtes fréquentes
    table.index(['user_id', 'is_read', 'created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('notifications');
};
