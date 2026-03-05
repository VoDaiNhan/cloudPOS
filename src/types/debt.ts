export type DebtStatus = 'OVERDUE' | 'DUE_SOON' | 'ON_TIME' | 'PAID'

export interface DebtSummary {
  totalReceivable: number
  receivableChangePercent: number
  totalPayable: number
  payableChangePercent: number
  overdueAmount: number
  overdueCount: number
  liquidityRatio: number
}

export interface CustomerDebt {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  avatarLetters: string
  totalDebt: number
  dueDate: string
  status: DebtStatus
  daysOverdue?: number
}

export interface SupplierDebt {
  id: string
  supplierId: string
  supplierName: string
  supplierPhone: string
  avatarLetters: string
  totalDebt: number
  dueDate: string
  status: DebtStatus
  daysOverdue?: number
}
