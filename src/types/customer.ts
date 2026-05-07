export interface PurchaseHistory {
  id: string
  code: string
  date: string
  itemCount: number
  total: number
  paymentStatus: 'paid' | 'partial' | 'unpaid'
}

export interface Customer {
  id: string
  code: string
  name: string
  phone: string
  email?: string
  address: string
  birthday?: string
  totalSpent: number
  debt: number
  lastPurchase: string
  status: 'active' | 'inactive'
  memberType: 'vip' | 'regular'
  customerGroupId?: string
  customerGroupName?: string
  defaultDiscountPercent?: number
  customDiscountPercent?: number
  usesGroupDefaultDiscount?: boolean
  effectiveDiscountPercent?: number
  hiddenCommissionEnabled?: boolean
  avatarColor: string
  purchases?: PurchaseHistory[]
}
