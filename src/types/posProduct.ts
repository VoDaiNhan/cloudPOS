export interface POSProduct {
  id: string
  name: string
  price: number
  image: string
  stock: number
  category: string
}

export type DiscountType = 'percent' | 'fixed'

export interface CartItem {
  product: POSProduct
  quantity: number
  discountValue: number      // raw value: e.g. 10 for 10% or 5000 for 5000đ
  discountType: DiscountType  // 'percent' or 'fixed'
}

export type PaymentMethod = 'cash' | 'transfer' | 'debt'
