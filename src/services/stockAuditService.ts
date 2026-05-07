import api from './api'
import type { StockAuditItem } from '../types/stockAudit'

interface BackendAuditSession {
  id: string
  code?: string
  status: string
  totalProducts: number
  startedAt: string
  completedAt?: string
  items: BackendAuditItem[]
}

interface BackendAuditItem {
  id: string
  productId: string
  productName?: string
  systemCount?: number
  actualCount?: number
  difference?: number
  reason?: string
}

export interface AuditSession {
  id: string
  code: string
  status: string
  dateTime: string
  auditor: string
  totalProducts: number
}

function mapAuditItem(item: BackendAuditItem): StockAuditItem {
  return {
    id: item.id,
    name: item.productName || '',
    sku: item.productId.slice(0, 8).toUpperCase(),
    systemCount: item.systemCount ?? 0,
    actualCount: item.actualCount ?? 0,
    difference: item.difference ?? 0,
    reason: (item.reason as StockAuditItem['reason']) || 'khac',
  }
}

function mapSession(s: BackendAuditSession): AuditSession {
  return {
    id: s.id,
    code: s.code || s.id.slice(0, 8),
    status: s.status === 'completed' ? 'balanced' : s.status,
    dateTime: new Date(s.startedAt).toLocaleString('vi-VN'),
    auditor: 'Admin',
    totalProducts: s.totalProducts,
  }
}

export const stockAuditService = {
  getAll: async (): Promise<AuditSession[]> => {
    const { data } = await api.get('/stock-audits')
    return (data as BackendAuditSession[]).map(mapSession)
  },

  getById: async (id: string): Promise<{ session: AuditSession; items: StockAuditItem[] }> => {
    const { data } = await api.get(`/stock-audits/${id}`)
    const s = data as BackendAuditSession
    return { session: mapSession(s), items: s.items.map(mapAuditItem) }
  },
}
