'use client'

import type { AxiosError } from 'axios'

import axios from 'axios'

import { ROUTES } from '~/constants/routes'
import { authClient } from '~/lib/auth/client'

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 7000,
  withCredentials: true,
})

client.interceptors.response.use(
  (response) => response.data.data,
  (error: AxiosError) => {
    // Handle network errors without retry
    if (error.code === 'ERR_NETWORK' || !error.response) {
      const networkError = new Error(
        'Network error: Unable to connect to the server'
      )
      networkError.name = 'NetworkError'
      return Promise.reject(networkError)
    }

    // Handle unauthorized errors - token expired or invalid
    if (error?.response?.status === 401) {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = ROUTES.LOGIN
          },
        },
      })
    }

    return Promise.reject(error)
  }
)

export async function clientFetch<T>(
  path: string,
  token: string,
  params?: Record<string, unknown>
): Promise<T> {
  const response = await client({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'GET',
    params,
    url: path,
  })

  return response as T
}
