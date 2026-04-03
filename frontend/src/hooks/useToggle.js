import { ref } from 'vue'

/**
 * Composable for toggle functionality
 * @param {boolean} initialValue - Initial toggle state
 * @returns {[Ref, Function, Function, Function]} - [value, toggle, setTrue, setFalse]
 */
export default function useToggle(initialValue = false) {
  const value = ref(initialValue)

  const toggle = () => {
    value.value = !value.value
  }

  const setTrue = () => {
    value.value = true
  }

  const setFalse = () => {
    value.value = false
  }

  return [value, toggle, setTrue, setFalse]
}
