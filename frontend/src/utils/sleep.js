/**
 * Sleep for a specified amount of time
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the sleep time
 */
export default function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}