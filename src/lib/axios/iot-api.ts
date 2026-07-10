'use server'

import axios from 'axios'

export const iotApi = axios.create({
  baseURL: process.env.IOT_API_URL,
  headers: {
    Accept: 'application/json',
    appKey: process.env.IOT_SECRET,
    'Content-Type': 'application/json',
  },
})

iotApi.interceptors.response.use((response) => response.data)
