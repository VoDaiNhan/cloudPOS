import api from './api'

export interface ReturnOrderData {
  id: string
  returnNumber: string
  type: string
  originalOrderNumber?: string
  customerName?: string
  supplierName?: string
  refundAmount: number
  netAmount: number
  status: string
  reason?: string
  returnDate: string
  items: ReturnItemData[]
}

export interface ReturnItemData {
  id: string
  productName?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  reason?: string
  condition: string
}

interface BackendReturn {
  id: string
  returnNumber: string
  type: string
  originalOrderNumber?: string
  customerName?: string
  supplierName?: string
  subtotal: number
  refundAmount: number
  netAmount: number
  refundMethod?: string
  status: string
  reason?: string
  returnDate: string
  items: { id: string; productName?: string; quantity: number; unitPrice: number; totalPrice: number; reason?: string; condition: string }[]
}

function mapReturn(r: BackendReturn): ReturnOrderData {
  return {
    id: r.id,
    returnNumber: r.returnNumber,
    type: r.type,
    originalOrderNumber: r.originalOrderNumber,
    customerName: r.customerName,
    supplierName: r.supplierName,
    refundAmount: r.refundAmount,
    netAmount: r.netAmount,
    status: r.status,
    reason: r.reason,
    returnDate: new Date(r.returnDate).toLocaleDateString('vi-VN'),
    items: r.items.map(i => ({
      id: i.id,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
      reason: i.reason,
      condition: i.condition,
    })),
  }
}

export const returnService = {
  getAll: async (type?: string): Promise<ReturnOrderData[]> => {
    const params = type ? `?type=${type}` : ''
    const { data } = await api.get(`/returns${params}`)
    return (data as BackendReturn[]).map(mapReturn)
  },
}
