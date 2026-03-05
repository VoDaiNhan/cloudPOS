import type { ShiftReport } from '../types/shiftReport'

export const mockShiftReport: ShiftReport = {
  shiftId: 'SHIFT-20231027-02',
  employeeName: 'Nguyễn Văn A',
  startTime: '27/10/2023 08:00',
  endTime: '27/10/2023 17:00',
  totalRevenue: 15250000,
  paymentMethods: [
    { method: 'Tiền mặt', amount: 8450000 },
    { method: 'QR Chuyển khoản', amount: 4800000 },
    { method: 'Thẻ (Visa/Master)', amount: 2000000 },
    { method: 'Công nợ', amount: 0 }
  ],
  orderStats: {
    successful: 42,
    cancelled: 3
  },
  cashReconciliation: {
    systemRecorded: 8450000,
    actualHandover: 8450000,
    difference: 0
  },
  printedAt: '27/10/2023 17:05'
}
