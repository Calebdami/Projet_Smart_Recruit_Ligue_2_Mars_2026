import { formatDate } from '@/utils'

/**
 * Format date filter
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type
 * @returns {string} Formatted date
 */
export default function date(date, format = 'short') {
  return formatDate(date, format)
}
