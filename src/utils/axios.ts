import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import { message } from 'antd'
import { clearAuthCache } from '@/utils/auth'
import useUserStore from '@/stores/userStore'

// Create axios instance
const service = axios.create({
  baseURL: '/api',
  timeout: 10 * 1000
})

// Handle Error
const handleError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response?.status === 401 || error.response?.status === 504) {
    clearAuthCache()
    location.href = '/login'
  }
  message.error(error.message || 'error')
  return Promise.reject(error)
}

// Request interceptors configuration
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useUserStore.getState().token
  if (token) {
    (config as Recordable).headers['Authorization'] = `${token}`
  }
  (config as Recordable).headers['Content-Type'] = 'application/json'
  return config
}, handleError)

// Respose interceptors configuration
service.interceptors.response.use((response: AxiosResponse) => {
  const data = response.data

  if (data.code === 0) {
    return data.data
  } else {
    message.error(data.message)

    return Promise.reject('error')
  }
}, handleError)

export { service }
