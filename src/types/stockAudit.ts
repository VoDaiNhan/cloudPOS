export interface StockAuditItem {
  id: string
  sku: string
  name: string
  systemCount: number
  actualCount: number
  difference: number
  reason: 'hu-hong' | 'that-thoat' | 'khac'
}

export interface RecentAuditSession {
  id: string
  code: string
  status: 'balanced' | 'cancelled'
  dateTime: string
  auditor: string
  totalProducts: number
}
