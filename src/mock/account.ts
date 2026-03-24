import type { StoreInfo, ServicePlan, BillingRecord } from '../types/account'

export const mockStoreInfo: StoreInfo = {
  name: 'CloudPOS Fashion - Chi nhánh Quận 1',
  slug: 'cloudpos-f-q1',
  address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
  phone: '0901 234 567',
  email: 'contact@fashion.vn',
  businessType: 'Thời trang & Phụ kiện',
}

export const mockServicePlan: ServicePlan = {
  name: 'Gói Chuyên Nghiệp',
  status: 'active',
  expiryDate: '24/12/2024',
  branches: { used: 3, total: 5 },
  staffAccounts: { used: 12, total: 20 },
  storage: { usedGb: 4.2, totalGb: 10 },
}

export const mockBillingRecords: BillingRecord[] = [
  {
    id: '1',
    date: '24/12/2023',
    invoiceId: 'INV-2023-0892',
    planName: 'Gói Chuyên Nghiệp (1 năm)',
    amount: 5880000,
    status: 'success',
  },
  {
    id: '2',
    date: '15/06/2023',
    invoiceId: 'INV-2023-0421',
    planName: 'Gói Chuyên Nghiệp (6 tháng)',
    amount: 3200000,
    status: 'success',
  },
  {
    id: '3',
    date: '05/06/2024',
    invoiceId: 'INV-2024-0115',
    planName: 'Nâng cấp Chi nhánh (+2)',
    amount: 1200000,
    status: 'pending',
  },
]
