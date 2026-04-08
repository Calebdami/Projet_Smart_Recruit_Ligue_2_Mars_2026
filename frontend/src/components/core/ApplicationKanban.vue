<template>
  <div class="kanban-container">
    <div class="kanban-header mb-6">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Pipeline de recrutement</h2>
      <div class="flex items-center gap-4">
        <div class="text-sm text-slate-600 dark:text-slate-400">
          {{ totalApplications }} candidatures
        </div>
        <button
          @click="refreshApplications"
          :disabled="loading"
          class="btn-secondary"
        >
          <RefreshCwIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Actualiser
        </button>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="kanban-board flex gap-6 overflow-x-auto pb-4">
      <div
        v-for="column in columns"
        :key="column.id"
        class="kanban-column flex-shrink-0 w-80"
      >
        <!-- Column Header -->
        <div class="kanban-column-header mb-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'w-3 h-3 rounded-full',
                  column.color
                ]"
              />
              <h3 class="font-medium text-slate-900 dark:text-white">
                {{ column.title }}
              </h3>
              <span class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">
                {{ getColumnApplications(column.id).length }}
              </span>
            </div>
          </div>
        </div>

        <!-- Drop Zone -->
        <div
          :id="`drop-zone-${column.id}`"
          class="kanban-drop-zone min-h-96 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 transition-colors"
          :class="{
            'border-brand-400 bg-brand-50 dark:bg-brand-900/20': isDraggingOver === column.id
          }"
          @dragover.prevent="onDragOver($event, column.id)"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop($event, column.id)"
        >
          <!-- Applications in this column -->
          <div class="space-y-3">
            <ApplicationCard
              v-for="application in getColumnApplications(column.id)"
              :key="application.id"
              :application="application"
              :is-dragging="draggedApplication === application.id"
              @dragstart="onDragStart($event, application)"
              @dragend="onDragEnd"
              @click="openApplicationModal(application)"
            />
          </div>

          <!-- Empty state -->
          <div
            v-if="getColumnApplications(column.id).length === 0"
            class="text-center py-8 text-slate-500 dark:text-slate-400"
          >
            <InboxIcon class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p class="text-sm">Aucune candidature</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Modal -->
    <ApplicationModal
      :show="showApplicationModal"
      :application="selectedApplication"
      @close="closeApplicationModal"
      @status-changed="onStatusChanged"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'
import ApplicationCard from './ApplicationCard.vue'
import ApplicationModal from './ApplicationModal.vue'
import { RefreshCwIcon, InboxIcon } from 'lucide-vue-next'

const applicationsStore = useApplicationsStore()
const toast = useToast()

// State
const loading = ref(false)
const draggedApplication = ref(null)
const isDraggingOver = ref(null)
const showApplicationModal = ref(false)
const selectedApplication = ref(null)

// Kanban columns configuration
const columns = [
  {
    id: 'new',
    title: 'Nouvelles',
    color: 'bg-blue-500'
  },
  {
    id: 'reviewing',
    title: 'En évaluation',
    color: 'bg-amber-500'
  },
  {
    id: 'interview',
    title: 'Entretiens',
    color: 'bg-violet-500'
  },
  {
    id: 'offer',
    title: 'Offres',
    color: 'bg-brand-500'
  },
  {
    id: 'hired',
    title: 'Embauchés',
    color: 'bg-emerald-500'
  },
  {
    id: 'rejected',
    title: 'Refusés',
    color: 'bg-rose-500'
  }
]

// Computed
const totalApplications = computed(() => applicationsStore.allApplications.length)

const getColumnApplications = (status) => {
  return applicationsStore.allApplications.filter(app => app.status === status)
}

// Methods
const refreshApplications = async () => {
  loading.value = true
  try {
    await applicationsStore.fetchApplications()
    toast.success('Applications actualisées')
  } catch (error) {
    toast.error('Erreur lors de l\'actualisation')
  } finally {
    loading.value = false
  }
}

const onDragStart = (event, application) => {
  draggedApplication.value = application.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/json', JSON.stringify(application))
}

const onDragEnd = () => {
  draggedApplication.value = null
  isDraggingOver.value = null
}

const onDragOver = (event, columnId) => {
  event.preventDefault()
  isDraggingOver.value = columnId
}

const onDragLeave = () => {
  isDraggingOver.value = null
}

const onDrop = async (event, newStatus) => {
  event.preventDefault()
  isDraggingOver.value = null

  try {
    const application = JSON.parse(event.dataTransfer.getData('application/json'))

    if (application.status === newStatus) {
      return // No change needed
    }

    // Update status via API
    await applicationsStore.dragDropStatus(application.id, newStatus)

    // Update local state
    application.status = newStatus

    // Show success toast
    const statusMessages = {
      'reviewing': 'Candidature en évaluation',
      'interview': 'Entretien programmé',
      'offer': 'Offre proposée',
      'hired': 'Candidat embauché',
      'rejected': 'Candidature refusée'
    }

    toast.success(statusMessages[newStatus] || `Statut mis à jour: ${newStatus}`)

  } catch (error) {
    console.error('Error updating application status:', error)
    toast.error('Erreur lors de la mise à jour du statut')
  } finally {
    draggedApplication.value = null
  }
}

const openApplicationModal = (application) => {
  selectedApplication.value = application
  showApplicationModal.value = true
}

const closeApplicationModal = () => {
  showApplicationModal.value = false
  selectedApplication.value = null
}

const onStatusChanged = async (applicationId, newStatus) => {
  // Refresh applications to get updated data
  await refreshApplications()
}

// Lifecycle
onMounted(async () => {
  await refreshApplications()
})
</script>

<style scoped>
.kanban-container {
  @apply w-full;
}

.kanban-board {
  @apply min-h-screen;
}

.kanban-column {
  @apply bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700;
}

.kanban-column-header {
  @apply p-4 border-b border-slate-200 dark:border-slate-700;
}

.kanban-drop-zone {
  @apply transition-all duration-200;
}

.kanban-drop-zone:hover {
  @apply border-slate-300 dark:border-slate-600;
}
</style>