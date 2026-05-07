import api from './api'

export interface StockHistoryEntry {
  id: string
  date: string
  type: 'IMPORT' | 'EXPORT' | 'AUDIT_ADJUSTMENT' | 'CANCELLATION' | 'RETURN_TO_SUPPLIER' | 'RETURN_FROM_CUSTOMER'
  referenceId: string
  productName: string
  sku: string
  changeQuantity: number
  balanceAfter: number
  unit: string
  performedBy: string
}

interface BackendStockHistory {
  id: string
  productId: string
  productName?: string
  type: string
  referenceId?: string
  changeQuantity?: number
  balanceAfter?: number
  unit?: string
  note?: string
  createdAt: string
}

const typeMap: Record<string, StockHistoryEntry['type']> = {
  import: 'IMPORT',
  export: 'EXPORT',
  audit: 'AUDIT_ADJUSTMENT',
  cancellation: 'CANCELLATION',
  return_supplier: 'RETURN_TO_SUPPLIER',
  return_customer: 'RETURN_FROM_CUSTOMER',
}

function mapEntry(e: BackendStockHistory): StockHistoryEntry {
  return {
    id: e.id,
    date: new Date(e.createdAt).toLocaleString('vi-VN'),
    type: typeMap[e.type] || 'IMPORT',
    referenceId: e.referenceId || '—',
    productName: e.productName || '',
    sku: e.productId.slice(0, 8).toUpperCase(),
    changeQuantity: e.changeQuantity ?? 0,
    balanceAfter: e.balanceAfter ?? 0,
    unit: e.unit || 'Cái',
    performedBy: e.note || 'Admin',
  }
}

export const stockHistoryService = {
  getAll: async (type?: string): Promise<StockHistoryEntry[]> => {
    const params = type ? `?type=${type}` : ''
    const { data } = await api.get(`/stock-history${params}`)
    return (data as BackendStockHistory[]).map(mapEntry)
  },
}
