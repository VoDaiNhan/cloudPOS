import api from './api'

export interface StockCancellationData {
  id: string
  code?: string
  reason?: string
  notes?: string
  totalValue: number
  createdAt: string
  items: StockCancellationItemData[]
}

export interface StockCancellationItemData {
  id: string
  productId: string
  productName?: string
  quantity: number
  unitPrice: number
  totalAmount: number
  reason?: string
}

interface BackendCancellation {
  id: string
  code?: string
  reason?: string
  notes?: string
  totalValue: number
  createdAt: string
  items: { id: string; productId: string; productName?: string; quantity: number; unitPrice: number; totalAmount: number; reason?: string }[]
}

export const stockCancellationService = {
  getAll: async (reason?: string): Promise<StockCancellationData[]> => {
    const params = reason ? `?reason=${reason}` : ''
    const { data } = await api.get(`/stock-cancellations${params}`)
    return (data as BackendCancellation[]).map(c => ({
      id: c.id,
      code: c.code,
      reason: c.reason,
      notes: c.notes,
      totalValue: c.totalValue,
      createdAt: new Date(c.createdAt).toLocaleDateString('vi-VN'),
      items: c.items.map(i => ({
        id: i.id,
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalAmount: i.totalAmount,
        reason: i.reason,
      })),
    }))
  },

  create: async (request: {
    reason?: string
    notes?: string
    items: { productId: string; quantity: number; unitPrice: number; reason?: string }[]
  }): Promise<StockCancellationData> => {
    const { data } = await api.post('/stock-cancellations', request)
    return data as StockCancellationData
  },
}
