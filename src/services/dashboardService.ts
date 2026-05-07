import api from './api'
import type {
  BackendDashboardStats,
  BackendChartPoint,
  BackendTopProduct,
  BackendLowStockAlert,
} from '../utils/apiMappers'

export const dashboardService = {
  getStats: async (): Promise<BackendDashboardStats> => {
    const { data } = await api.get('/dashboard/stats')
    return data
  },

  getChart: async (days = 7): Promise<BackendChartPoint[]> => {
    const { data } = await api.get(`/dashboard/chart?days=${days}`)
    return data
  },

  getTopProducts: async (limit = 10): Promise<BackendTopProduct[]> => {
    const { data } = await api.get(`/dashboard/top-products?limit=${limit}`)
    return data
  },

  getAlerts: async (): Promise<BackendLowStockAlert[]> => {
    const { data } = await api.get('/dashboard/alerts')
    return data
  },
}
