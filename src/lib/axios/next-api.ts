import axios from 'axios'

export const nextApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    indexes: null,
  },
  timeout: 60000, // 60 seconds timeout for internal API calls (map endpoint batches ~23 IoT requests)
})

nextApi.interceptors.response.use((response) => response.data)
