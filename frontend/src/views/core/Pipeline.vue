<template>
  <div class="pipeline-view">
    <!-- Sélecteur d'offre -->
    <div v-if="!selectedJobId" class="pipeline-view__select">
      <h2>Sélectionner une offre</h2>
      <p>Entre un Job ID pour voir le pipeline de candidatures.</p>
      <div class="pipeline-view__form">
        <input
          v-model="jobIdInput"
          type="text"
          placeholder="Job ID (UUID)"
          class="pipeline-view__input"
        />
        <button
          class="pipeline-view__btn"
          @click="loadPipeline"
          :disabled="!jobIdInput"
        >
          Charger le pipeline
        </button>
      </div>
    </div>

    <!-- Board pipeline -->
    <div v-else>
      <button class="pipeline-view__back" @click="selectedJobId = null">
        ← Changer d'offre
      </button>
      <ApplicationPipeline :job-id="selectedJobId" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ApplicationPipeline from '../../components/core/ApplicationPipeline.vue';

const jobIdInput = ref('');
const selectedJobId = ref(null);

function loadPipeline() {
  if (jobIdInput.value.trim()) {
    selectedJobId.value = jobIdInput.value.trim();
  }
}
</script>

<style scoped>
.pipeline-view {
  padding: 32px;
}

.pipeline-view__select {
  max-width: 480px;
  margin: 80px auto;
  text-align: center;
}

.pipeline-view__select h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a202c;
}

.pipeline-view__select p {
  color: #718096;
  margin-bottom: 24px;
}

.pipeline-view__form {
  display: flex;
  gap: 8px;
}

.pipeline-view__input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.pipeline-view__input:focus {
  border-color: #3182ce;
}

.pipeline-view__btn {
  padding: 10px 20px;
  background: #3182ce;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.pipeline-view__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pipeline-view__back {
  background: none;
  border: none;
  color: #3182ce;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 0;
}
</style>
