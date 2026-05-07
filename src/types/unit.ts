// Hệ thống đơn vị tính chuẩn cho POS

export type UnitCategory = 
  | 'piece' // Đơn chiếc (cái, chiếc, con, bộ)
  | 'weight' // Khối lượng (kg, g, tấn)
  | 'volume' // Thể tích (lít, ml)
  | 'length' // Chiều dài (m, cm, km)
  | 'area' // Diện tích (m², cm²)
  | 'package' // Đóng gói (thùng, hộp, gói)
  | 'food' // Đồ ăn (phần, suất, dĩa)

export interface Unit {
  id: string
  name: string // Tên đơn vị (kg, cái, thùng...)
  shortName?: string
  category: UnitCategory
  isBase: boolean // Đơn vị cơ bản (nhỏ nhất)
  conversionRate?: number // Tỷ lệ quy đổi so với đơn vị cơ bản
  description?: string
}

export interface UnitConversion {
  id: string
  productId?: string // Nếu null = áp dụng chung
  fromUnit: string // ID đơn vị lớn
  toUnit: string // ID đơn vị nhỏ (base)
  rate: number // 1 fromUnit = rate toUnit
  fromUnitId?: string
  toUnitId?: string
  conversionRate?: number
  description?: string
  isDefault?: boolean
}

export interface ConversionTemplate {
  id: string
  name: string
  description?: string
  conversions: { fromUnit: string; toUnit: string; rate: number }[]
}

// Ví dụ: 1 thùng = 24 lon
// fromUnit: "thung", toUnit: "lon", rate: 24
