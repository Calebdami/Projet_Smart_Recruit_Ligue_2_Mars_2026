<template>
  <!-- Carte candidat draggable -->
  <div
    class="app-card"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="app-card__header">
      <span class="app-card__name">{{ application.first_name }} {{ application.last_name }}</span>
    </div>
    <div class="app-card__info">
      <span>{{ application.email }}</span>
      <span v-if="application.phone">{{ application.phone }}</span>
    </div>
    <div class="app-card__footer">
      <span class="app-card__date">{{ formatDate(application.applied_at) }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  application: { type: Object, required: true },
});

const emit = defineEmits(['dragstart']);

/**
 * Démarre le drag en passant les données de la carte
 */
function onDragStart(event) {
  event.dataTransfer.setData('application', JSON.stringify(props.application));
  event.dataTransfer.effectAllowed = 'move';
  emit('dragstart', props.application);
}

/**
 * Formate une date ISO en format lisible
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}
</script>

<style scoped>
.app-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: grab;
  transition: box-shadow 0.2s;
}

.app-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.app-card:active {
  cursor: grabbing;
}

.app-card__header {
  margin-bottom: 6px;
}

.app-card__name {
  font-weight: 600;
  font-size: 14px;
  color: #1a202c;
}

.app-card__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: #718096;
  margin-bottom: 8px;
}

.app-card__footer {
  font-size: 11px;
  color: #a0aec0;
}
</style>
