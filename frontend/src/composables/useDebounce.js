import { ref } from 'vue'

/**
 * Composable for debouncing functions
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Object} - Object with debouncedFunction property
 */
export function useDebounce(func, delay = 300) {
  const timeoutId = ref(null)

  const debouncedFunction = () => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }

    timeoutId.value = setTimeout(() => {
      func()
    }, delay)
  }

  return {
    debouncedFunction
  }
}
