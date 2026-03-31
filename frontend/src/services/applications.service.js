/**
 * Service Applications
 * Toutes les appels API liés aux candidatures
 */
import api from './api.js';

const ApplicationsService = {
  /**
   * Postuler à une offre (candidat)
   * @param {string} job_id
   * @param {string} cover_letter
   */
  apply(job_id, cover_letter = '') {
    return api.post('/applications', { job_id, cover_letter });
  },

  /**
   * Changer le statut d'une candidature (recruteur) — Drag & Drop
   * @param {string} id - ID de la candidature
   * @param {string} status - Nouveau statut
   * @param {string} rejection_reason - Raison du rejet (optionnel)
   */
  updateStatus(id, status, rejection_reason = '') {
    return api.patch(`/applications/${id}/status`, { status, rejection_reason });
  },

  /**
   * Récupérer toutes les candidatures d'une offre groupées par statut
   * @param {string} job_id - ID de l'offre
   */
  getByJob(job_id) {
    return api.get(`/applications/job/${job_id}`);
  },
};

export default ApplicationsService;
