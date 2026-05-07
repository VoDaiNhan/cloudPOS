import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const storeId = localStorage.getItem('store_id')
    if (storeId) {
      config.headers['X-Store-Id'] = storeId
    }

    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('store_id')
      localStorage.removeItem('user')

      if (!['/', '/login', '/register'].includes(window.location.pathname)) {
        window.history.replaceState(null, '', '/')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    }
    return Promise.reject(error)
  },
)

export default api
