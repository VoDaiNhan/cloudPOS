export type TransactionType = 'IN' | 'OUT'
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED'
export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CARD'

export interface CashbookTransaction {
  id: string
  code: string
  type: TransactionType
  time: string // e.g., '14:20 25/10/2023'
  amount: number
  method: PaymentMethod
  creator: string
  status: TransactionStatus
  description?: string
}

export interface CashbookSummary {
  totalIncome: number
  incomeChangePercent: number
  totalExpense: number
  expenseChangePercent: number
  cashBalance: number
}
