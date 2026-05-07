export interface CustomerGroup {
  id: string
  code: string
  name: string
  description?: string
  defaultDiscountPercent: number
  hiddenCommissionEnabled: boolean
  isActive: boolean
}

export interface CustomerGroupPayload {
  code: string
  name: string
  description?: string
  defaultDiscountPercent: number
  hiddenCommissionEnabled: boolean
  isActive: boolean
}
