<template>
  <div
    id="app"
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-accent-50/30 text-slate-900 transition-colors duration-300 dark:from-black dark:via-black dark:to-black dark:text-slate-100 mesh-bg"
  >
    <!-- Global Toast Notifications -->
    <NotificationToast />

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

    <component :is="layoutComponent" :key="layoutName">
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </component>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUI } from '@/composables/useUI'
import { useWebSocket } from '@/composables/useWebSocket'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import NotificationToast from '@/components/common/NotificationToast.vue'

const route = useRoute()
const ui = useUI()
const { connect } = useWebSocket()

onMounted(() => {
  connect()
})

const layouts = {
  default: DefaultLayout,
  MainLayout,
  AuthLayout,
  PublicLayout,
}

const layoutName = computed(() => route.meta.layout || 'default')

const layoutComponent = computed(() => {
  return layouts[layoutName.value] || layouts.default
})
</script>

<style>
.layout-fade-enter-active,
.layout-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.layout-fade-enter-from,
.layout-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

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

@media (max-width: 640px) {
  .svg-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

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
