import api from './api'

export interface BatchItem {
  id: string
  productId: string
  productName: string
  batchNumber: string
  importDate: string
  supplierName?: string
  expiryDate?: string
  daysUntilExpiry?: number
  initialQuantity: number
  currentQuantity: number
  availableQuantity: number
  importPrice: number
  unitName?: string
  status: string
  isBlocked: boolean
  blockReason?: string
}

interface BackendBatch {
  id: string
  productId: string
  productName?: string
  batchNumber: string
  importDate: string
  supplierName?: string
  expiryDate?: string
  daysUntilExpiry?: number
  initialQuantity: number
  currentQuantity: number
  availableQuantity: number
  importPrice: number
  unitName?: string
  status: string
  isBlocked: boolean
  blockReason?: string
}

function mapBatch(b: BackendBatch): BatchItem {
  return {
    id: b.id,
    productId: b.productId,
    productName: b.productName || '',
    batchNumber: b.batchNumber,
    importDate: new Date(b.importDate).toLocaleDateString('vi-VN'),
    supplierName: b.supplierName,
    expiryDate: b.expiryDate ? new Date(b.expiryDate).toLocaleDateString('vi-VN') : undefined,
    daysUntilExpiry: b.daysUntilExpiry,
    initialQuantity: b.initialQuantity,
    currentQuantity: b.currentQuantity,
    availableQuantity: b.availableQuantity,
    importPrice: b.importPrice,
    unitName: b.unitName,
    status: b.status,
    isBlocked: b.isBlocked,
    blockReason: b.blockReason,
  }
}

export const batchService = {
  getAll: async (productId?: string, status?: string): Promise<BatchItem[]> => {
    const params = new URLSearchParams()
    if (productId) params.set('productId', productId)
    if (status) params.set('status', status)
    const qs = params.toString() ? `?${params.toString()}` : ''
    const { data } = await api.get(`/batches${qs}`)
    return (data as BackendBatch[]).map(mapBatch)
  },

  getExpiring: async (days = 30): Promise<BatchItem[]> => {
    const { data } = await api.get(`/batches/expiring?withinDays=${days}`)
    return (data as BackendBatch[]).map(mapBatch)
  },

  getExpired: async (): Promise<BatchItem[]> => {
    const { data } = await api.get('/batches/expired')
    return (data as BackendBatch[]).map(mapBatch)
  },

  block: async (id: string, reason: string): Promise<BatchItem> => {
    const { data } = await api.post(`/batches/${id}/block`, { blockReason: reason })
    return mapBatch(data as BackendBatch)
  },
}
