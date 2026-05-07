import api from './api'
import type { CashbookTransaction, CashbookSummary, PaymentMethod, TransactionStatus } from '../types/cashbook'

interface BackendTransaction {
  id: string
  code?: string
  type: string
  amount: number
  method: string
  status: string
  description?: string
  createdByName?: string
  transactionTime: string
}

interface BackendSummary {
  totalIn: number
  totalOut: number
  balance: number
}

function mapTransaction(t: BackendTransaction): CashbookTransaction {
  return {
    id: t.id,
    code: t.code || '',
    type: t.type === 'IN' ? 'IN' : 'OUT',
    amount: t.amount,
    method: (t.method || 'CASH') as PaymentMethod,
    status: (t.status || 'COMPLETED') as TransactionStatus,
    description: t.description || '',
    creator: t.createdByName || 'Admin',
    time: new Date(t.transactionTime).toLocaleString('vi-VN'),
  }
}

function mapSummary(s: BackendSummary): CashbookSummary {
  return {
    totalIncome: s.totalIn,
    totalExpense: s.totalOut,
    cashBalance: s.balance,
    incomeChangePercent: 0,
    expenseChangePercent: 0,
  }
}

export const cashbookService = {
  getAll: async (from?: string, to?: string, type?: string): Promise<CashbookTransaction[]> => {
    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    if (type) params.append('type', type)
    const { data } = await api.get(`/cashbook?${params}`)
    return (data as BackendTransaction[]).map(mapTransaction)
  },

  getSummary: async (): Promise<CashbookSummary> => {
    const { data } = await api.get('/cashbook/summary')
    return mapSummary(data)
  },
}
