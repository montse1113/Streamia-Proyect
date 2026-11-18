import axios from 'axios'

// One client for the whole app
export const client = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
  headers: {
    Accept: 'application/json',
  },
})
