<template>
  <div class="pipeline">
    <!-- Titre + bouton refresh -->
    <div class="pipeline__header">
      <h2 class="pipeline__title">Pipeline de recrutement</h2>
      <button class="pipeline__refresh" @click="fetchBoard" :disabled="store.loading">
        {{ store.loading ? 'Chargement...' : 'Actualiser' }}
      </button>
    </div>

    <!-- Message d'erreur -->
    <div v-if="store.error" class="pipeline__error">
      {{ store.error }}
    </div>

    <!-- Board Trello -->
    <div class="pipeline__board">
      <div
        v-for="status in statuses"
        :key="status.key"
        class="pipeline__column"
        @dragover.prevent
        @drop="onDrop($event, status.key)"
      >
        <!-- En-tête de colonne -->
        <div class="pipeline__column-header" :style="{ borderTopColor: status.color }">
          <span class="pipeline__column-title">{{ status.label }}</span>
          <span class="pipeline__column-count">{{ store.board[status.key]?.length || 0 }}</span>
        </div>

        <!-- Cartes candidats -->
        <div class="pipeline__column-body">
          <ApplicationCard
            v-for="application in store.board[status.key]"
            :key="application.id"
            :application="application"
            @dragstart="onDragStart($event, status.key)"
          />

          <!-- Colonne vide -->
          <div v-if="!store.board[status.key]?.length" class="pipeline__empty">
            Aucun candidat
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useApplicationsStore } from '../../stores/applications.js';
import ApplicationCard from './ApplicationCard.vue';

const props = defineProps({
  jobId: { type: String, required: true },
});

const store = useApplicationsStore();

// Colonne source du drag en cours
const dragFromStatus = ref(null);

// Définition des colonnes du board
const statuses = [
  { key: 'new',       label: 'Nouveau',    color: '#718096' },
  { key: 'reviewing', label: 'En revue',   color: '#3182ce' },
  { key: 'interview', label: 'Entretien',  color: '#d69e2e' },
  { key: 'offer',     label: 'Offre',      color: '#805ad5' },
  { key: 'hired',     label: 'Embauché',   color: '#38a169' },
  { key: 'rejected',  label: 'Rejeté',     color: '#e53e3e' },
];

/**
 * Charge le board au montage du composant
 */
onMounted(() => fetchBoard());

function fetchBoard() {
  store.fetchBoard(props.jobId);
}

/**
 * Mémorise la colonne source au début du drag
 */
function onDragStart(application, fromStatus) {
  dragFromStatus.value = fromStatus;
}

/**
 * Dépose la carte dans la nouvelle colonne
 */
function onDrop(event, toStatus) {
  const applicationData = event.dataTransfer.getData('application');
  if (!applicationData) return;

  const application = JSON.parse(applicationData);
  const fromStatus = dragFromStatus.value;

  // Ne rien faire si on dépose dans la même colonne
  if (fromStatus === toStatus) return;

  store.moveApplication(application, fromStatus, toStatus);
  dragFromStatus.value = null;
}
</script>

<style scoped>
.pipeline {
  padding: 24px;
}

.pipeline__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.pipeline__title {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
}

.pipeline__refresh {
  padding: 8px 16px;
  background: #3182ce;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.pipeline__refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pipeline__error {
  background: #fff5f5;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.pipeline__board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.pipeline__column {
  min-width: 220px;
  background: #f7fafc;
  border-radius: 8px;
  border: 2px dashed transparent;
  transition: border-color 0.2s;
}

.pipeline__column:hover {
  border-color: #cbd5e0;
}

.pipeline__column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-top: 3px solid #718096;
  border-radius: 8px 8px 0 0;
}

.pipeline__column-title {
  font-weight: 600;
  font-size: 13px;
  color: #2d3748;
}

.pipeline__column-count {
  background: #e2e8f0;
  color: #4a5568;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.pipeline__column-body {
  padding: 8px;
  min-height: 200px;
}

.pipeline__empty {
  text-align: center;
  color: #a0aec0;
  font-size: 13px;
  padding: 24px 0;
}
</style>
