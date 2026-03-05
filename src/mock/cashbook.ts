import type { CashbookTransaction, CashbookSummary } from '../types/cashbook'

export const mockCashbookSummary: CashbookSummary = {
  totalIncome: 150240000,
  incomeChangePercent: 12.5,
  totalExpense: 84500000,
  expenseChangePercent: -3.2,
  cashBalance: 65740000,
}

export const mockCashbookTransactions: CashbookTransaction[] = [
  {
    id: 't1',
    code: 'PT00842',
    type: 'IN',
    time: '14:20 25/10/2023',
    amount: 1250000,
    method: 'CASH',
    creator: 'Admin User',
    status: 'COMPLETED',
  },
  {
    id: 't2',
    code: 'PC00125',
    type: 'OUT',
    time: '10:45 25/10/2023',
    amount: 4500000,
    method: 'TRANSFER',
    creator: 'Nguyễn Văn A',
    status: 'COMPLETED',
  },
  {
    id: 't3',
    code: 'PT00841',
    type: 'IN',
    time: '09:15 25/10/2023',
    amount: 800000,
    method: 'CASH',
    creator: 'Admin User',
    status: 'PENDING',
  },
  {
    id: 't4',
    code: 'PC00124',
    type: 'OUT',
    time: '17:30 24/10/2023',
    amount: 15000000,
    method: 'TRANSFER',
    creator: 'Admin User',
    status: 'COMPLETED',
  },
]
