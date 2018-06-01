import axios from 'axios'

export default () => {
  return axios.create({
    // baseURL: 'http://localhost:8081'
    baseURL: 'http://35.195.207.52:80'
  })
}
