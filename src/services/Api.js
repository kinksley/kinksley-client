import axios from 'axios'

export default () => {
  return axios.create({
    // baseURL: 'http://localhost:8081'
    baseURL: 'https://kinksley-2cf8b.appspot.com'
  })
}
