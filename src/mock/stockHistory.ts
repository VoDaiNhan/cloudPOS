import type { StockHistoryEntry } from '../types/stockHistory'

export const mockStockHistory: StockHistoryEntry[] = [
  {
    id: 'h1',
    date: '15/10/2023 14:30',
    type: 'AUDIT_ADJUSTMENT',
    referenceId: 'KK00852',
    productName: 'iPhone 15 Pro Max 256GB',
    sku: 'IP15PM-256-BLU',
    changeQuantity: -1,
    balanceAfter: 11,
    unit: 'máy',
    note: 'Thất thoát sau kiểm kho',
    performedBy: 'Nguyễn Văn A'
  },
  {
    id: 'h2',
    date: '14/10/2023 09:15',
    type: 'IMPORT',
    referenceId: 'PN00125',
    productName: 'iPhone 15 Pro Max 256GB',
    sku: 'IP15PM-256-BLU',
    changeQuantity: 10,
    balanceAfter: 12,
    unit: 'máy',
    note: 'Nhập hàng từ NCC Apple VN',
    performedBy: 'Trần Thị B'
  },
  {
    id: 'h3',
    date: '13/10/2023 16:45',
    type: 'CANCELLATION',
    referenceId: 'XH00045',
    productName: 'Ốp lưng Silicon MagSafe',
    sku: 'CASE-MS-001',
    changeQuantity: -5,
    balanceAfter: 45,
    unit: 'chiếc',
    note: 'Hủy hàng do rách bao bì',
    performedBy: 'Lê Văn C'
  },
  {
    id: 'h4',
    date: '12/10/2023 10:20',
    type: 'RETURN_FROM_CUSTOMER',
    referenceId: 'THKH-002',
    productName: 'Apple Watch Series 9',
    sku: 'AW9-S-45',
    changeQuantity: 1,
    balanceAfter: 25,
    unit: 'chiếc',
    note: 'Khách đổi trả hàng lỗi',
    performedBy: 'Nguyễn Văn A'
  },
  {
    id: 'h5',
    date: '11/10/2023 08:30',
    type: 'RETURN_TO_SUPPLIER',
    referenceId: 'THNCC-001',
    productName: 'Sony WH-1000XM5',
    sku: 'SN-XM5-W',
    changeQuantity: -2,
    balanceAfter: 18,
    unit: 'tai nghe',
    note: 'Trả hàng NCC do lỗi kỹ thuật',
    performedBy: 'Trần Thị B'
  }
]
