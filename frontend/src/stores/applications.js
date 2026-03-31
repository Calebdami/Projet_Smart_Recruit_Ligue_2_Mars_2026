/**
 * Store Pinia — Applications
 * Gère l'état du board de candidatures
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import ApplicationsService from '../services/applications.service.js';

export const useApplicationsStore = defineStore('applications', () => {
  // Le board groupé par statut (format retourné par l'API)
  const board = ref({
    new: [],
    reviewing: [],
    interview: [],
    offer: [],
    hired: [],
    rejected: [],
  });

  const loading = ref(false);
  const error = ref(null);
  const currentJobId = ref(null);

  /**
   * Charger les candidatures d'une offre
   */
  async function fetchBoard(job_id) {
    loading.value = true;
    error.value = null;
    currentJobId.value = job_id;

    try {
      const { data } = await ApplicationsService.getByJob(job_id);
      board.value = data.data.board;
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement';
    } finally {
      loading.value = false;
    }
  }

  /**
   * Mettre à jour le statut localement (optimistic update)
   * puis envoyer au backend
   */
  async function moveApplication(application, fromStatus, toStatus) {
    // Mise à jour optimiste : on bouge la carte immédiatement
    board.value[fromStatus] = board.value[fromStatus].filter(
      (a) => a.id !== application.id
    );
    board.value[toStatus].push({ ...application, status: toStatus });

    try {
      await ApplicationsService.updateStatus(application.id, toStatus);
    } catch (err) {
      // En cas d'erreur, on annule le mouvement
      board.value[toStatus] = board.value[toStatus].filter(
        (a) => a.id !== application.id
      );
      board.value[fromStatus].push(application);
      error.value = 'Impossible de mettre à jour le statut';
    }
  }

  return { board, loading, error, currentJobId, fetchBoard, moveApplication };
});
