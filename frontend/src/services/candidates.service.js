import api from './api'

export const candidateService = {
  getAll(params) {
    return api.get('/candidates', { params })
  },

  getById(id) {
    return api.get(`/candidates/${id}`)
  },

  create(data) {
    return api.post('/candidates', data)
  },

  update(id, data) {
    return api.patch(`/candidates/${id}`, data)
  },

  parseCV(id, formData) {
    return api.post(`/candidates/${id}/parse-cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  getMatchScore(id, jobId) {
    return api.get(`/candidates/${id}/match/${jobId}`)
  }
}
