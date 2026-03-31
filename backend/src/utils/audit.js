import { db } from '../config/database.js';

/**
 * Enregistre une action dans la table audit_trail
 * @param {Object} params
 * @param {string} params.action - L'action effectuée (create, update, delete, login...)
 * @param {string} params.entity_type - Le type d'entité concernée (user, application...)
 * @param {string} params.entity_id - L'id de l'entité concernée
 * @param {string} params.user_id - L'id de l'utilisateur qui a effectué l'action
 * @param {string} [params.ip_address] - L'adresse IP
 * @param {string} [params.user_agent] - Le user agent
 * @param {Object} [params.old_values] - Les anciennes valeurs (pour les updates)
 * @param {Object} [params.new_values] - Les nouvelles valeurs (pour les updates)
 */
const auditLog = async ({
  action,
  entity_type,
  entity_id,
  user_id,
  ip_address = null,
  user_agent = null,
  old_values = null,
  new_values = null,
}) => {
  try {
    await db('audit_trail').insert({
      action,
      entity_type,
      entity_id,
      user_id,
      ip_address,
      user_agent,
      old_values: old_values ? JSON.stringify(old_values) : null,
      new_values: new_values ? JSON.stringify(new_values) : null,
      created_at: new Date(),
    });
  } catch (error) {
    // On ne bloque jamais l'action principale si l'audit échoue
    console.error('Audit log failed (non-blocking):', error.message);
  }
};

export { auditLog };
