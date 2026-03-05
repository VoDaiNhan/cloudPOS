import type { RecentAuditSession, StockAuditItem } from '../types/stockAudit'

export const mockRecentAuditSessions: RecentAuditSession[] = [
  {
    id: 'KK00852',
    code: 'KK00852',
    status: 'balanced',
    dateTime: '15/10/2023 14:30',
    auditor: 'Trần Thị B',
    totalProducts: 128,
  },
  {
    id: 'KK00849',
    code: 'KK00849',
    status: 'balanced',
    dateTime: '12/10/2023 09:15',
    auditor: 'Nguyễn Văn A',
    totalProducts: 450,
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

export const initialStockAuditItems: StockAuditItem[] = [
  {
    id: '1',
    sku: 'IP15PM-256-BLU',
    name: 'iPhone 15 Pro Max 256GB',
    systemCount: 12,
    actualCount: 11,
    difference: -1,
    reason: 'that-thoat',
  },
  {
    id: '2',
    sku: 'CASE-MS-001',
    name: 'Ốp lưng Silicon MagSafe',
    systemCount: 45,
    actualCount: 45,
    difference: 0,
    reason: 'khac',
  },
]
