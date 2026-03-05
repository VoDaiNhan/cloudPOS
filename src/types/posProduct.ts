export interface POSProduct {
  id: string
  name: string
  price: number
  image: string
  stock: number
  category: string
}

export interface CartItem {
  product: POSProduct
  quantity: number
  discount: number
}

export type PaymentMethod = 'cash' | 'transfer' | 'debt'
