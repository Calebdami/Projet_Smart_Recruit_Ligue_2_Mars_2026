import { ref, watch } from 'vue'

/**
 * Composable for localStorage with reactivity
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {[Ref, Function]} - [value, setValue]
 */
export default function useLocalStorage(key, defaultValue = null) {
  const value = ref(defaultValue)

  // Initialize from localStorage
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      value.value = JSON.parse(stored)
    }
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
  }

  // Watch for changes and update localStorage
  watch(value, (newValue) => {
    try {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error)
    }
  }, { deep: true })

  const setValue = (newValue) => {
    value.value = newValue
  }

  return [value, setValue]
}
