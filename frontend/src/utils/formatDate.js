/**
 * Format a date to a readable string
 * @param {Date|string|number} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'iso')
 * @returns {string} Formatted date string
 */
export default function formatDate(date, format = 'short') {
  if (!date) return ''

  const d = new Date(date)

  if (isNaN(d.getTime())) return ''

  const options = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    iso: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }
  }

  if (format === 'iso') {
    return d.toISOString().split('T')[0]
  }

  return d.toLocaleDateString('en-US', options[format])
}