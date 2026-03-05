export interface PaymentMethodStats {
  method: string
  amount: number
}

export interface OrderStats {
  successful: number
  cancelled: number
}

export interface CashReconciliation {
  systemRecorded: number
  actualHandover: number
  difference: number
}

export interface ShiftReport {
  shiftId: string
  employeeName: string
  startTime: string
  endTime: string
  totalRevenue: number
  paymentMethods: PaymentMethodStats[]
  orderStats: OrderStats
  cashReconciliation: CashReconciliation
  printedAt: string
}
