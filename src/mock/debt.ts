import type { DebtSummary, CustomerDebt, SupplierDebt } from '../types/debt'

export const mockDebtSummary: DebtSummary = {
  totalReceivable: 150000000,
  receivableChangePercent: 5.2,
  totalPayable: 85500000,
  payableChangePercent: -2.1,
  overdueAmount: 12400000,
  overdueCount: 8,
  liquidityRatio: 1.75
}

export const mockCustomerDebts: CustomerDebt[] = [
  {
    id: 'cd1',
    customerId: 'KH00293',
    customerName: 'Nguyễn Văn Lộc',
    customerPhone: '090 123 4567',
    avatarLetters: 'NL',
    totalDebt: 12500000,
    dueDate: '15/10/2023',
    status: 'OVERDUE',
    daysOverdue: 5
  },
  {
    id: 'cd2',
    customerId: 'KH00156',
    customerName: 'Trần Thị Lan Anh',
    customerPhone: '098 765 4321',
    avatarLetters: 'TA',
    totalDebt: 5200000,
    dueDate: '22/10/2023',
    status: 'DUE_SOON'
  },
  {
    id: 'cd3',
    customerId: 'KH00412',
    customerName: 'Hoàng Mạnh Minh',
    customerPhone: '091 222 3333',
    avatarLetters: 'HM',
    totalDebt: 8900000,
    dueDate: '30/11/2023',
    status: 'ON_TIME'
  },
  {
    id: 'cd4',
    customerId: 'KH00882',
    customerName: 'Phạm Thu Thảo',
    customerPhone: '093 444 5555',
    avatarLetters: 'PT',
    totalDebt: 21500000,
    dueDate: '05/12/2023',
    status: 'ON_TIME'
  }
]

export const mockSupplierDebts: SupplierDebt[] = [
  {
    id: 'sd1',
    supplierId: 'NCC001',
    supplierName: 'NCC Do Uong CloudPOS',
    supplierPhone: '1900 1568',
    avatarLetters: 'DU',
    totalDebt: 45000000,
    dueDate: '10/11/2023',
    status: 'ON_TIME'
  },
  {
    id: 'sd2',
    supplierId: 'NCC002',
    supplierName: 'NCC Thuc An CloudPOS',
    supplierPhone: '1900 5555',
    avatarLetters: 'TA',
    totalDebt: 15500000,
    dueDate: '20/10/2023',
    status: 'OVERDUE',
    daysOverdue: 2
  }
]
