import Api from '@/services/Api'

export default {
  fetchShoots (params) {
    return Api().get('/shoots', {
      params: params
    })
  }
}
