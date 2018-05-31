import Api from '@/services/Api'

export default {
  fetchTags (query) {
    return Api().get('/tags')
  }
}
