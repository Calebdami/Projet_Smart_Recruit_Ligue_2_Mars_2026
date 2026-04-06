import { ref } from 'vue'

const STORAGE_KEY = 'smartrecruit-theme'

function readIsDark() {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

const isDark = ref(readIsDark())

export function initTheme() {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(STORAGE_KEY)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const useDark = stored === 'dark' || (!stored && prefersDark)
  document.documentElement.classList.toggle('dark', useDark)
  isDark.value = useDark
}

export function useTheme() {
  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    isDark.value = next
  }

  const setTheme = (mode) => {
    const dark = mode === 'dark'
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    isDark.value = dark
  }

  return { isDark, toggleTheme, setTheme }
}
