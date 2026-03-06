import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { tokenStorage } from './tokenStorage'
import type { AuthResponseDTO } from '../types/authDTOs' 

// Динамически определяем URL API
const getApiUrl = () => {
  return '/api'
}

export const API_BASE = getApiUrl()

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const clearAuth = () => {
  tokenStorage.clear()
  window.location.href = '/login'
}

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : token && p.resolve(token)))
  failedQueue = []
}


const refreshToken = async () => {
  const refreshTokenValue = tokenStorage.getRefresh()
  const payload = refreshTokenValue ? { refreshToken: refreshTokenValue } : {}

  const res = await axios.post<AuthResponseDTO>(
    `${API_BASE}/auth/refresh`,    // ← теперь будет /api/auth/refresh
    payload,
    { withCredentials: true }
  )

  return res.data
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers ?? {}
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const tokens = await refreshToken()

        tokenStorage.setAccess(tokens.accessToken)
        if (tokens.refreshToken) tokenStorage.setRefresh(tokens.refreshToken)

        processQueue(null, tokens.accessToken)

        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`

        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        clearAuth()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)