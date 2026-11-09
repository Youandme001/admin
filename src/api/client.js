import axios from 'axios'

export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:4000').replace(/\/$/, '')

const TOKEN_KEY = 'glowy_admin_token'

export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
}

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Expired or invalid session: back to the login page
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && tokenStore.get()) {
      tokenStore.clear()
      window.location.hash = '#/login'
    }
    return Promise.reject(error)
  },
)

export const errorMessage = (error, fallback = 'Une erreur est survenue') => error?.response?.data?.message || fallback

export default api
