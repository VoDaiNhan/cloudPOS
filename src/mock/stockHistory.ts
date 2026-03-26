import type { StockHistoryEntry } from '../types/stockHistory'
import { posProducts } from './pos'

const toSku = (index: number) => `SP${String(index + 1).padStart(3, '0')}`

const p1 = posProducts[0]
const p2 = posProducts[1] ?? posProducts[0]
const p3 = posProducts[2] ?? posProducts[0]

export const mockStockHistory: StockHistoryEntry[] = [
  {
    id: 'h1',
    date: '15/10/2023 14:30',
    type: 'AUDIT_ADJUSTMENT',
    referenceId: 'KK00852',
    productName: p1.name,
    sku: toSku(0),
    changeQuantity: -1,
    balanceAfter: Math.max(0, p1.stockInBaseUnit - 1),
    unit: p1.baseUnit,
    note: 'Điều chỉnh sau kiểm kho',
    performedBy: 'Nguyễn Văn A',
  },
  {
    id: 'h2',
    date: '14/10/2023 09:15',
    type: 'IMPORT',
    referenceId: 'PN00125',
    productName: p2.name,
    sku: toSku(1),
    changeQuantity: 10,
    balanceAfter: p2.stockInBaseUnit,
    unit: p2.baseUnit,
    note: 'Nhập hàng từ nhà cung cấp',
    performedBy: 'Trần Thị B',
  },
  {
    id: 'h3',
    date: '13/10/2023 16:45',
    type: 'CANCELLATION',
    referenceId: 'XH00045',
    productName: p3.name,
    sku: toSku(2),
    changeQuantity: -2,
    balanceAfter: Math.max(0, p3.stockInBaseUnit - 2),
    unit: p3.baseUnit,
    note: 'Hủy hàng hỏng bao bì',
    performedBy: 'Lê Văn C',
  },
  {
    id: 'h4',
    date: '12/10/2023 10:20',
    type: 'RETURN_FROM_CUSTOMER',
    referenceId: 'THKH-002',
    productName: p1.name,
    sku: toSku(0),
    changeQuantity: 1,
    balanceAfter: p1.stockInBaseUnit,
    unit: p1.baseUnit,
    note: 'Khách đổi trả hàng',
    performedBy: 'Nguyễn Văn A',
  },
  {
    id: 'h5',
    date: '11/10/2023 08:30',
    type: 'RETURN_TO_SUPPLIER',
    referenceId: 'THNCC-001',
    productName: p2.name,
    sku: toSku(1),
    changeQuantity: -1,
    balanceAfter: Math.max(0, p2.stockInBaseUnit - 1),
    unit: p2.baseUnit,
    note: 'Trả hàng nhà cung cấp',
    performedBy: 'Trần Thị B',
  },
]
