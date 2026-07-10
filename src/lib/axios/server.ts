'use server'

import type { AxiosError, AxiosRequestConfig } from 'axios'

import axios from 'axios'

export const server = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
})

server.interceptors.response.use(
  (response) => response.data.data,
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      const networkError = new Error(
        'Network error: Unable to connect to the server'
      )
      networkError.name = 'NetworkError'
      return Promise.reject(networkError)
    }

    if (error?.response?.status === 401) {
      // remove cookie
    }

    return Promise.reject(error)
  }
)

export async function serverFetch(
  path: string,
  params?: Record<string, unknown>
) {
  const response = await server({
    method: 'GET',
    params,
    url: path,
  })

  return response
}

export async function serverFetchApiWithConfig<T>({
  config,
  method = 'GET',
  params,
  path,
}: {
  config: AxiosRequestConfig
  method?: 'DELETE' | 'GET' | 'POST' | 'PUT'
  params?: Record<string, unknown>
  path: string
}): Promise<T> {
  const response = await server({
    ...config,
    method,
    params,
    url: path,
  })

  return response as T
}

export async function serverLoginApi(body: Record<string, unknown>) {
  const response = await server({
    baseURL: process.env.SSO_URL_TOKEN,
    data: body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  return response
}

export async function serverPost<T>(
  path: string,
  body?: Record<string, unknown>
) {
  const response = await server({
    data: body,
    method: 'POST',
    url: path,
  })

  return response as T
}
