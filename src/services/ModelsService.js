import Api from '@/services/Api'

export default {
  fetchModels (params) {
    return Api().get('/models', {
      params: params
    })
  }
}
