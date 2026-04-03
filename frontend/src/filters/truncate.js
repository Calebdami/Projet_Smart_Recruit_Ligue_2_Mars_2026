/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} Truncated string
 */
export default function truncate(str, length = 50, suffix = '...') {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length - suffix.length) + suffix
}
