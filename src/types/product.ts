export interface UnitConversion {
  id: string
  unitName: string
  value: number // Conversion value relative to base unit
}

export interface Product {
  id: string
  code: string
  name: string
  barcode: string
  categoryName: string
  price: number
  costPrice?: number
  stock: number
  status: 'active' | 'inactive'
  image?: string
  baseUnit?: string
  conversions?: UnitConversion[]
  tax?: number
  is_sellable?: boolean // true = sản phẩm bán, false = nguyên liệu
}
