export default {
  data() {
    return {
      formData: {},
      errors: {},
      isSubmitting: false
    }
  },

  methods: {
    /**
     * Reset form data and errors
     */
    resetForm() {
      this.formData = {}
      this.errors = {}
      this.isSubmitting = false
    },

    /**
     * Set form errors
     * @param {Object} errors - Error object
     */
    setErrors(errors) {
      this.errors = errors
    },

    /**
     * Clear specific field error
     * @param {string} field - Field name
     */
    clearFieldError(field) {
      if (this.errors[field]) {
        this.$delete(this.errors, field)
      }
    },

    /**
     * Clear all errors
     */
    clearErrors() {
      this.errors = {}
    },

    /**
     * Handle form submission with loading state
     * @param {Function} submitFn - Submit function
     * @returns {Promise} Submit result
     */
    async handleSubmit(submitFn) {
      this.isSubmitting = true
      this.clearErrors()

      try {
        const result = await submitFn()
        return result
      } catch (error) {
        if (error.response?.data?.errors) {
          this.setErrors(error.response.data.errors)
        }
        throw error
      } finally {
        this.isSubmitting = false
      }
    }
  }
}