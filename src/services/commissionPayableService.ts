import api from './api'

export interface CommissionPayableItem {
  id: string
  customerId: string
  customerName: string
  customerPhone?: string
  customerGroupId?: string
  customerGroupName?: string
  orderId: string
  orderNumber: string
  baseAmount: number
  commissionPercent: number
  commissionAmount: number
  paidAmount: number
  remainingAmount: number
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID'
  accruedAt: string
  paidAt?: string
  notes?: string
}

export interface CommissionPayableSummary {
  totalAccrued: number
  totalPaid: number
  totalRemaining: number
  unpaidCount: number
}

interface BackendCommissionPayableItem {
  id: string
  customerId: string
  customerName?: string
  customerPhone?: string
  customerGroupId?: string
  customerGroupName?: string
  orderId: string
  orderNumber?: string
  baseAmount: number
  commissionPercent: number
  commissionAmount: number
  paidAmount: number
  remainingAmount: number
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID'
  accruedAt: string
  paidAt?: string
  notes?: string
}

function mapItem(item: BackendCommissionPayableItem): CommissionPayableItem {
  return {
    id: item.id,
    customerId: item.customerId,
    customerName: item.customerName || '—',
    customerPhone: item.customerPhone,
    customerGroupId: item.customerGroupId,
    customerGroupName: item.customerGroupName,
    orderId: item.orderId,
    orderNumber: item.orderNumber || '—',
    baseAmount: item.baseAmount,
    commissionPercent: item.commissionPercent,
    commissionAmount: item.commissionAmount,
    paidAmount: item.paidAmount,
    remainingAmount: item.remainingAmount,
    status: item.status,
    accruedAt: new Date(item.accruedAt).toLocaleString('vi-VN'),
    paidAt: item.paidAt ? new Date(item.paidAt).toLocaleString('vi-VN') : undefined,
    notes: item.notes,
  }
}

export const commissionPayableService = {
  getAll: async (status?: string): Promise<CommissionPayableItem[]> => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    const query = params.toString()
    const { data } = await api.get(`/commission-payables${query ? `?${query}` : ''}`)
    return (data as BackendCommissionPayableItem[]).map(mapItem)
  },

  getSummary: async (): Promise<CommissionPayableSummary> => {
    const { data } = await api.get('/commission-payables/summary')
    return data as CommissionPayableSummary
  },

  pay: async (id: string, request: { amount: number; method?: string; note?: string }): Promise<CommissionPayableItem> => {
    const { data } = await api.post(`/commission-payables/${id}/pay`, request)
    return mapItem(data as BackendCommissionPayableItem)
  },
}
