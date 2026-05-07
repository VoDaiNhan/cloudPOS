import api from './api'

interface BackendDebt {
  id: string
  debtorType: string
  debtorId: string
  debtorName?: string
  totalDebt: number
  paidAmount: number
  remainingAmount: number
  dueDate?: string
  status: string
  createdAt: string
}

interface BackendDebtSummary {
  totalDebt: number
  paidAmount: number
  remainingAmount: number
  count: number
}

export interface DebtItem {
  id: string
  avatarLetters: string
  customerName?: string
  supplierName?: string
  customerPhone?: string
  supplierPhone?: string
  customerId?: string
  supplierId?: string
  totalDebt: number
  dueDate: string
  status: string
  daysOverdue?: number
}

export interface DebtSummary {
  totalReceivable: number
  totalPayable: number
  overdueAmount: number
  overdueCount: number
  receivableChangePercent: number
  payableChangePercent: number
  liquidityRatio: string
}

function getStatus(d: BackendDebt): string {
  if (d.remainingAmount <= 0) return 'PAID'
  if (d.dueDate) {
    const due = new Date(d.dueDate)
    const now = new Date()
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return 'OVERDUE'
    if (diffDays <= 7) return 'DUE_SOON'
  }
  return 'ON_TIME'
}

function mapDebt(d: BackendDebt): DebtItem {
  const initials = (d.debtorName || '??').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const daysOverdue = d.dueDate ? Math.max(0, Math.ceil((Date.now() - new Date(d.dueDate).getTime()) / 86400000)) : undefined

  return {
    id: d.id,
    avatarLetters: initials,
    ...(d.debtorType === 'customer'
      ? { customerName: d.debtorName, customerId: d.debtorId.slice(0, 8) }
      : { supplierName: d.debtorName, supplierId: d.debtorId.slice(0, 8) }),
    totalDebt: d.remainingAmount,
    dueDate: d.dueDate ? new Date(d.dueDate).toLocaleDateString('vi-VN') : '—',
    status: getStatus(d),
    daysOverdue: daysOverdue && daysOverdue > 0 ? daysOverdue : undefined,
  }
}

export const debtService = {
  getAll: async (debtorType?: string): Promise<DebtItem[]> => {
    const params = debtorType ? `?debtorType=${debtorType}` : ''
    const { data } = await api.get(`/debts${params}`)
    return (data as BackendDebt[]).map(mapDebt)
  },

  getSummary: async (): Promise<DebtSummary> => {
    const { data } = await api.get('/debts/summary')
    const s = data as BackendDebtSummary
    return {
      totalReceivable: s.totalDebt,
      totalPayable: s.remainingAmount,
      overdueAmount: s.remainingAmount,
      overdueCount: s.count,
      receivableChangePercent: 0,
      payableChangePercent: 0,
      liquidityRatio: s.totalDebt > 0 ? (s.paidAmount / s.totalDebt).toFixed(2) : '0.00',
    }
  },
}
