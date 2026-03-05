export interface ReturnInvoiceItem {
  id: string
  name: string
  sku: string
  unit: string
  boughtQuantity: number
  returnQuantity: number
  unitPrice: number
  variantInfo?: string
}

export interface ReturnInvoice {
  id: string
  invoiceCode: string
  customerName: string
  customerPhone: string
  status: 'PAID' | 'UNPAID'
  items: ReturnInvoiceItem[]
}

export type RefundMethod = 'cash' | 'debt'
