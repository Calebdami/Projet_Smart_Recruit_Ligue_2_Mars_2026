import { ref } from 'vue'

/**
 * Composable for debouncing values
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Ref} - Debounced value
 */
export default function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value)

  let timeoutId = null

  watch(value, () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debouncedValue.value = value
    }, delay)
  })

  return debouncedValue
}
