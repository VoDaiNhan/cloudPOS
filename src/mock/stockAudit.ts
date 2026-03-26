import type { RecentAuditSession, StockAuditItem } from '../types/stockAudit'
import { posProducts } from './pos'

const toSku = (index: number) => `SP${String(index + 1).padStart(3, '0')}`

export const mockRecentAuditSessions: RecentAuditSession[] = [
  {
    id: 'KK00852',
    code: 'KK00852',
    status: 'balanced',
    dateTime: '15/10/2023 14:30',
    auditor: 'Trần Thị B',
    totalProducts: posProducts.length,
  },
  {
    id: 'KK00849',
    code: 'KK00849',
    status: 'balanced',
    dateTime: '12/10/2023 09:15',
    auditor: 'Nguyễn Văn A',
    totalProducts: Math.max(8, Math.floor(posProducts.length / 2)),
  },
  {
    id: 'KK00845',
    code: 'KK00845',
    status: 'cancelled',
    dateTime: '10/10/2023 16:45',
    auditor: 'Lê Văn C',
    totalProducts: 0,
  },
]

export const initialStockAuditItems: StockAuditItem[] = posProducts.slice(0, 2).map((product, index) => {
  const systemCount = Math.max(1, product.stockInBaseUnit)
  const actualCount = index === 0 ? Math.max(0, systemCount - 1) : systemCount

  return {
    id: String(index + 1),
    sku: toSku(index),
    name: product.name,
    systemCount,
    actualCount,
    difference: actualCount - systemCount,
    reason: index === 0 ? 'that-thoat' : 'khac',
  }
})
