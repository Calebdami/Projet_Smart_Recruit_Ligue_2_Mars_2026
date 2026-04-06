import { formatFileSize } from '@/utils'

/**
 * Format file size filter
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted file size
 */
export default function fileSize(bytes, decimals = 2) {
  return formatFileSize(bytes, decimals)
}
