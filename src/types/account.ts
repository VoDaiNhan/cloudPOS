export interface StoreInfo {
  name: string
  slug: string
  address: string
  phone: string
  email: string
  businessType: string
}

export type ServicePlanName = 'Gói Cơ Bản' | 'Gói Chuyên Nghiệp' | 'Gói Doanh Nghiệp'

export interface ServicePlan {
  name: ServicePlanName
  status: 'active' | 'expired' | 'trial'
  expiryDate: string
  branches: { used: number; total: number }
  staffAccounts: { used: number; total: number }
  storage: { usedGb: number; totalGb: number }
}

export type BillingStatus = 'success' | 'pending' | 'failed'

export interface BillingRecord {
  id: string
  date: string
  invoiceId: string
  planName: string
  amount: number
  status: BillingStatus
}
