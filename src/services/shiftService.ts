import api from './api'
import axios from 'axios'

export interface ShiftReport {
  shiftId: string
  employeeName: string
  startTime: string
  endTime: string
  totalRevenue: number
  paymentMethods: { method: string; amount: number }[]
  orderStats: { successful: number; cancelled: number }
  cashReconciliation: { systemRecorded: number; actualHandover: number; difference: number }
}

export interface BackendShift {
  id: string
  shiftCode: string
  userName?: string
  status: string
  openingAmount: number
  closingAmount?: number
  systemAmount?: number
  difference?: number
  totalRevenue: number
  totalOrders: number
  cancelledOrders: number
  paymentMethods: { method: string; amount: number }[]
  cashReconciliation?: { systemRecorded: number; actualHandover: number; difference: number }
  openedAt: string
  closedAt?: string
}

function mapShiftReport(s: BackendShift): ShiftReport {
  return {
    shiftId: s.shiftCode,
    employeeName: s.userName || 'Admin',
    startTime: new Date(s.openedAt).toLocaleString('vi-VN'),
    endTime: s.closedAt ? new Date(s.closedAt).toLocaleString('vi-VN') : '—',
    totalRevenue: s.totalRevenue,
    paymentMethods: s.paymentMethods || [],
    orderStats: { successful: s.totalOrders - s.cancelledOrders, cancelled: s.cancelledOrders },
    cashReconciliation: s.cashReconciliation || {
      systemRecorded: s.systemAmount ?? s.totalRevenue,
      actualHandover: s.closingAmount ?? 0,
      difference: s.difference ?? 0,
    },
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    return message || fallback
  }

  return error instanceof Error ? error.message : fallback
}

export const shiftService = {
  open: async (openingAmount: number, notes?: string): Promise<BackendShift> => {
    try {
      const { data } = await api.post('/shifts/open', { openingAmount, notes })
      return data as BackendShift
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Không thể mở ca. Vui lòng thử lại.'))
    }
  },

  close: async (id: string, closingAmount: number, notes?: string): Promise<BackendShift> => {
    try {
      const { data } = await api.put(`/shifts/${id}/close`, { closingAmount, notes })
      return data as BackendShift
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Không thể đóng ca. Vui lòng thử lại.'))
    }
  },

  getReport: async (id: string): Promise<ShiftReport> => {
    try {
      const { data } = await api.get(`/shifts/${id}/report`)
      return mapShiftReport(data as BackendShift)
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Không thể tải báo cáo ca.'))
    }
  },

  getCurrent: async (): Promise<BackendShift | null> => {
    try {
      const { data } = await api.get('/shifts/current')
      if (data && typeof data === 'object' && 'data' in data) {
        return (data as { data?: BackendShift | null }).data || null
      }
      return data as BackendShift
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Không thể tải ca hiện tại.'))
    }
  },
}
