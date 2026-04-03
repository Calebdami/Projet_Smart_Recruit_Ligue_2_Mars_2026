<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <component :is="layoutComponent">
      <router-view />
    </component>
    
    <!-- Global Notifications -->
    <Notifications
      :notifications="ui.notifications"
      @remove="ui.removeNotification"
    />
    
    <!-- Global Confirmation Modal -->
    <ConfirmModal
      :show="ui.confirmModal.show"
      :type="ui.confirmModal.type"
      :title="ui.confirmModal.title"
      :message="ui.confirmModal.message"
      :confirmText="ui.confirmModal.confirmText"
      :cancelText="ui.confirmModal.cancelText"
      :loadingText="ui.confirmModal.loadingText"
      :showCancel="ui.confirmModal.showCancel"
      :loading="ui.confirmModal.loading"
      @confirm="ui.handleConfirm"
      @cancel="ui.handleCancel"
    />
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useUI } from '@/composables/useUI'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Notifications from '@/components/common/Notifications.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const route = useRoute()
const ui = useUI()

const layouts = {
  default: DefaultLayout,
  MainLayout,
  AuthLayout
}

const layoutComponent = computed(() => {
  const layoutName = route.meta.layout || 'default'
  return layouts[layoutName] || layouts.default
})
</script>

<style>
/* Base styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9fafb;
}

/* SVG utility classes */
.svg-icon {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  vertical-align: middle;
}

.svg-icon-sm {
  width: 0.875rem;
  height: 0.875rem;
}

.svg-icon-lg {
  width: 1.25rem;
  height: 1.25rem;
}

.svg-icon-xl {
  width: 1.5rem;
  height: 1.5rem;
}

/* Button styles */
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

.btn-danger {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}

.btn-warning {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500;
}

/* Responsive utilities */
@media (max-width: 640px) {
  .svg-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

/* Animation utilities */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
