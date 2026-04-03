export default {
  data() {
    return {
      isLoading: false,
      loadingMessage: 'Loading...'
    }
  },

  methods: {
    /**
     * Set loading state
     * @param {boolean} loading - Loading state
     * @param {string} message - Loading message
     */
    setLoading(loading = true, message = 'Loading...') {
      this.isLoading = loading
      this.loadingMessage = message
    },

    /**
     * Show loading spinner
     * @param {string} message - Loading message
     */
    showLoading(message = 'Loading...') {
      this.setLoading(true, message)
    },

    /**
     * Hide loading spinner
     */
    hideLoading() {
      this.setLoading(false)
    },

    /**
     * Execute async operation with loading state
     * @param {Function} asyncFn - Async function to execute
     * @param {string} message - Loading message
     * @returns {Promise} Operation result
     */
    async withLoading(asyncFn, message = 'Loading...') {
      this.showLoading(message)

      try {
        const result = await asyncFn()
        return result
      } finally {
        this.hideLoading()
      }
    }
  }
}