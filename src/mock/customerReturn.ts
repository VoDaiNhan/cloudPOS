import type { ReturnInvoice } from '../types/customerReturn'

export const mockReturnInvoice: ReturnInvoice = {
  id: 'HD-20231024-001',
  invoiceCode: 'HD-20231024-001',
  customerName: 'Nguyễn Văn An',
  customerPhone: '0987.654.321',
  status: 'PAID',
  items: [
    {
      id: 'item-1',
      name: 'iPhone 15 Pro Max 256GB',
      sku: 'IP15PM256',
      unit: 'Cái',
      boughtQuantity: 1,
      returnQuantity: 0,
      unitPrice: 34990000,
      variantInfo: 'IMEI: 357123456789012'
    },
    {
      id: 'item-2',
      name: 'Ốp lưng Silicon Case',
      sku: 'OPCASE01',
      unit: 'Cái',
      boughtQuantity: 2,
      returnQuantity: 1,
      unitPrice: 1250000,
      variantInfo: 'Màu xanh dương'
    },
    {
      id: 'item-3',
      name: 'Cáp sạc USB-C to Lightning',
      sku: 'CBLUSBCTO',
      unit: 'Sợi',
      boughtQuantity: 3,
      returnQuantity: 0,
      unitPrice: 890000,
      variantInfo: 'Độ dài 2m'
    }
  ]
}
