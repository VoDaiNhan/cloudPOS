import api from './api'

export interface ImportOrderListItem {
  id: string
  importNumber: string
  supplierName?: string
  totalAmount: number
  paidAmount: number
  debtAmount: number
  status: string
  createdAt: string
}

export interface ImportOrderDetail {
  id: string
  importNumber: string
  supplierId?: string
  supplierName?: string
  totalAmount: number
  paidAmount: number
  debtAmount: number
  status: string
  notes?: string
  items: ImportOrderItem[]
}

export interface ImportOrderItem {
  id: string
  productId: string
  productName?: string
  unitId?: string
  quantity: number
  unitPrice: number
  totalAmount: number
  conversionRate: number
  conversionUnit?: string
  expiryDate?: string
  batchNumber?: string
}

interface BackendImportOrder {
  id: string
  importNumber: string
  supplierId?: string
  supplierName?: string
  totalAmount: number
  paidAmount: number
  debtAmount: number
  status: string
  notes?: string
  createdAt: string
  items: { id: string; productId: string; productName?: string; unitId?: string; quantity: number; unitPrice: number; totalAmount: number; conversionRate: number; conversionUnit?: string; expiryDate?: string; batchNumber?: string }[]
}

export const importOrderService = {
  getAll: async (search?: string, status?: string): Promise<ImportOrderListItem[]> => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const qs = params.toString() ? `?${params.toString()}` : ''
    const { data } = await api.get(`/import-orders${qs}`)
    return (data as BackendImportOrder[]).map(o => ({
      id: o.id,
      importNumber: o.importNumber,
      supplierName: o.supplierName,
      totalAmount: o.totalAmount,
      paidAmount: o.paidAmount,
      debtAmount: o.debtAmount,
      status: o.status,
      createdAt: new Date(o.createdAt).toLocaleDateString('vi-VN'),
    }))
  },

  getById: async (id: string): Promise<ImportOrderDetail> => {
    const { data } = await api.get(`/import-orders/${id}`)
    const o = data as BackendImportOrder
    return {
      id: o.id,
      importNumber: o.importNumber,
      supplierId: o.supplierId,
      supplierName: o.supplierName,
      totalAmount: o.totalAmount,
      paidAmount: o.paidAmount,
      debtAmount: o.debtAmount,
      status: o.status,
      notes: o.notes,
      items: o.items.map(i => ({
        id: i.id,
        productId: i.productId,
        productName: i.productName,
        unitId: i.unitId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalAmount: i.totalAmount,
        conversionRate: i.conversionRate,
        conversionUnit: i.conversionUnit,
        expiryDate: i.expiryDate,
        batchNumber: i.batchNumber,
      }))
    }
  },

  create: async (request: {
    supplierId?: string
    paidAmount: number
    notes?: string
    items: { productId: string; unitId?: string; quantity: number; unitPrice: number; conversionRate?: number; conversionUnit?: string; expiryDate?: string; batchNumber?: string }[]
  }): Promise<ImportOrderDetail> => {
    const { data } = await api.post('/import-orders', request)
    return data as ImportOrderDetail
  },

  confirm: async (id: string): Promise<void> => {
    await api.put(`/import-orders/${id}/confirm`)
  },
}
