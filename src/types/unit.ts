// Unit of measurement types

export interface Unit {
  id: string
  name: string // Tên đơn vị: Thùng, Lon, Chai, Kg, Gói, etc.
  shortName: string // Tên viết tắt: thùng, lon, chai, kg, gói
  isBaseUnit: boolean // Đơn vị cơ bản (nhỏ nhất) hay không
  description?: string
}

export interface UnitConversion {
  id: string
  productId: string // Sản phẩm áp dụng
  fromUnitId: string // Đơn vị lớn (ví dụ: thùng)
  toUnitId: string // Đơn vị nhỏ (ví dụ: lon)
  conversionRate: number // Tỷ lệ quy đổi (ví dụ: 1 thùng = 24 lon)
  isDefault: boolean // Quy đổi mặc định cho sản phẩm này
  createdAt: string
  updatedAt: string
}

export interface ProductUnit {
  productId: string
  baseUnitId: string // Đơn vị cơ bản để tính tồn kho
  baseUnitName: string
  allowedUnits: Unit[] // Các đơn vị được phép sử dụng
  conversions: UnitConversion[] // Các quy đổi đã cấu hình
}

export interface UnitConversionInput {
  fromUnit: Unit
  toUnit: Unit
  rate: number
}

// For import/export operations
export interface QuantityWithUnit {
  quantity: number
  unitId: string
  unitName: string
  // Calculated fields
  baseQuantity?: number // Số lượng quy đổi về đơn vị cơ bản
  conversionRate?: number
}

// Preset conversion templates (for common products)
export interface ConversionTemplate {
  id: string
  name: string // Ví dụ: "Nước ngọt đóng thùng"
  description: string
  conversions: {
    fromUnit: string
    toUnit: string
    rate: number
  }[]
}
