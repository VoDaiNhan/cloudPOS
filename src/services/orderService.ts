import api from './api'

export interface OrderItem {
  productId: string
  productName?: string
  unitName?: string
  quantity: number
  unitPrice: number
  discountValue: number
  discountType: string
  totalPrice: number
}

export interface CreateOrderPayload {
  customerId?: string
  discountAmount: number
  taxAmount: number
  paidAmount: number
  paymentMethod: string
  notes?: string
  items: Omit<OrderItem, 'totalPrice'>[]
}

export interface OrderResult {
  id: string
  orderCode: string
  orderNumber: string
  orderDate: string
  customerId?: string
  customerName?: string
  customerPhone?: string
  totalAmount: number
  displayTotalAmount?: number
  commissionDiscountAmount?: number
  hasHiddenCommission?: boolean
  paidAmount: number
  status: string
  items: OrderItem[]
}

interface BackendOrder {
  id: string
  orderNumber: string
  customerId?: string
  customerName?: string
  customerPhone?: string
  totalAmount: number
  displayTotalAmount?: number
  commissionDiscountAmount?: number
  hasHiddenCommission?: boolean
  paidAmount: number
  status: string
  createdAt: string
  items?: {
    id: string
    productId: string
    productName?: string
    unitName?: string
    quantity: number
    unitPrice: number
    discountValue: number
    discountType: string
    totalAmount: number
  }[]
}

function mapOrder(o: BackendOrder): OrderResult {
  return {
    id: o.id,
    orderCode: o.orderNumber,
    orderNumber: o.orderNumber,
    orderDate: o.createdAt,
    customerId: o.customerId,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    totalAmount: o.totalAmount,
    displayTotalAmount: o.displayTotalAmount,
    commissionDiscountAmount: o.commissionDiscountAmount,
    hasHiddenCommission: o.hasHiddenCommission,
    paidAmount: o.paidAmount,
    status: o.status,
    items: (o.items || []).map(i => ({
      productId: i.productId,
      productName: i.productName,
      unitName: i.unitName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      discountValue: i.discountValue,
      discountType: i.discountType,
      totalPrice: i.totalAmount,
    })),
  }
}

export const orderService = {
  create: async (order: CreateOrderPayload): Promise<OrderResult> => {
    const { data } = await api.post('/orders', order)
    return mapOrder(data as BackendOrder)
  },

  getAll: async (): Promise<OrderResult[]> => {
    const { data } = await api.get('/orders')
    return (data as BackendOrder[]).map(mapOrder)
  },
}
