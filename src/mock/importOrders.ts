import type { ImportItem } from '../types/importOrder'

export const mockSuppliers = [
  'Công ty TNHH Thực phẩm Sạch',
  'Nhà máy Sữa ABC',
  'Nông trại VietGAP',
  'Đại lý Gạo Miền Tây',
]

// Note: Using a minimal subset of properties for ImportItem to match ImportOrderPage's local type
export const mockDefaultImportItems: ImportItem[] = [
  {
    id: '1',
    name: 'Trà Đào Cam Sả',
    sku: 'SP003',
    unit: 'Thùng',
    unitOptions: ['Thùng', 'Vỉ', 'Hộp', 'Lon', 'Chai', 'Lốc', 'Cái'],
    unitRates: {
      Thùng: 12,
      Vỉ: 4,
      Hộp: 1,
    },
    quantity: 10,
    conversionRate: 12,
    conversionUnit: 'ly',
    unitPrice: 320000,
    expiryDate: '2024-12-31',
    batchNumber: 'BATCH-202',
  },
  {
    id: '2',
    name: 'Nước Suối (500ml)',
    sku: 'SP005',
    unit: 'Thùng',
    unitOptions: ['Thùng', 'Lốc', 'Chai', 'Vỉ', 'Hộp', 'Lon', 'Cái'],
    unitRates: {
      Thùng: 24,
      Lốc: 6,
      Chai: 1,
    },
    quantity: 5,
    conversionRate: 24,
    conversionUnit: 'chai',
    unitPrice: 100000,
    expiryDate: '2025-06-20',
    batchNumber: 'L-G25-01',
  },
]
