import type { ReturnInvoice } from '../types/customerReturn'
import { posProducts } from './pos'

const toSku = (index: number) => `SP${String(index + 1).padStart(3, '0')}`

export const mockReturnInvoice: ReturnInvoice = {
  id: 'HD-20231024-001',
  invoiceCode: 'HD-20231024-001',
  customerName: 'Nguyễn Văn An',
  customerPhone: '0987.654.321',
  status: 'PAID',
  items: posProducts.slice(0, 3).map((product, index) => ({
    id: `item-${index + 1}`,
    name: product.name,
    sku: toSku(index),
    unit: product.baseUnit,
    boughtQuantity: Math.max(1, index + 1),
    returnQuantity: index === 1 ? 1 : 0,
    unitPrice: product.price,
    variantInfo: `Lo san pham ${index + 1}`,
  })),
}
