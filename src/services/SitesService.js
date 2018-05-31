import Api from '@/services/Api'

export default {
  fetchSites (query) {
    return Api().get('/sites')
  }
}
