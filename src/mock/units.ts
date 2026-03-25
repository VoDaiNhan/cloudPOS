import type { Unit, UnitConversion, ConversionTemplate } from '../types/unit'

// Common units
export const units: Unit[] = [
  // Đơn vị đếm
  { id: 'unit-1', name: 'Cái', shortName: 'cái', isBaseUnit: true, description: 'Đơn vị đếm cơ bản' },
  { id: 'unit-2', name: 'Chiếc', shortName: 'chiếc', isBaseUnit: true, description: 'Đơn vị đếm' },
  { id: 'unit-3', name: 'Bộ', shortName: 'bộ', isBaseUnit: false, description: 'Tập hợp nhiều món' },
  
  // Đơn vị đóng gói đồ uống
  { id: 'unit-4', name: 'Lon', shortName: 'lon', isBaseUnit: true, description: 'Lon đồ uống' },
  { id: 'unit-5', name: 'Chai', shortName: 'chai', isBaseUnit: true, description: 'Chai đồ uống' },
  { id: 'unit-6', name: 'Thùng', shortName: 'thùng', isBaseUnit: false, description: 'Thùng chứa nhiều lon/chai' },
  { id: 'unit-7', name: 'Lốc', shortName: 'lốc', isBaseUnit: false, description: 'Lốc 6 hoặc 12 lon/chai' },
  
  // Đơn vị khối lượng
  { id: 'unit-8', name: 'Gram', shortName: 'g', isBaseUnit: true, description: 'Đơn vị khối lượng nhỏ' },
  { id: 'unit-9', name: 'Kilogram', shortName: 'kg', isBaseUnit: false, description: 'Đơn vị khối lượng' },
  { id: 'unit-10', name: 'Tấn', shortName: 'tấn', isBaseUnit: false, description: 'Đơn vị khối lượng lớn' },
  
  // Đơn vị thể tích
  { id: 'unit-11', name: 'Mililít', shortName: 'ml', isBaseUnit: true, description: 'Đơn vị thể tích nhỏ' },
  { id: 'unit-12', name: 'Lít', shortName: 'l', isBaseUnit: false, description: 'Đơn vị thể tích' },
  
  // Đơn vị đóng gói
  { id: 'unit-13', name: 'Gói', shortName: 'gói', isBaseUnit: true, description: 'Gói nhỏ' },
  { id: 'unit-14', name: 'Hộp', shortName: 'hộp', isBaseUnit: false, description: 'Hộp chứa nhiều gói' },
  { id: 'unit-15', name: 'Bao', shortName: 'bao', isBaseUnit: false, description: 'Bao lớn' },
]

// Sample unit conversions for products
export const unitConversions: UnitConversion[] = [
  // Coca Cola - Thùng to Lon
  {
    id: 'conv-1',
    productId: 'prod-coca',
    fromUnitId: 'unit-6', // Thùng
    toUnitId: 'unit-4', // Lon
    conversionRate: 24, // 1 thùng = 24 lon
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Coca Cola - Lốc to Lon
  {
    id: 'conv-2',
    productId: 'prod-coca',
    fromUnitId: 'unit-7', // Lốc
    toUnitId: 'unit-4', // Lon
    conversionRate: 6, // 1 lốc = 6 lon
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // Pepsi - Thùng to Chai
  {
    id: 'conv-3',
    productId: 'prod-pepsi',
    fromUnitId: 'unit-6', // Thùng
    toUnitId: 'unit-5', // Chai
    conversionRate: 20, // 1 thùng = 20 chai
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // Gạo - Bao to Kg
  {
    id: 'conv-4',
    productId: 'prod-rice',
    fromUnitId: 'unit-15', // Bao
    toUnitId: 'unit-9', // Kg
    conversionRate: 50, // 1 bao = 50 kg
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // Kg to Gram
  {
    id: 'conv-5',
    productId: 'prod-rice',
    fromUnitId: 'unit-9', // Kg
    toUnitId: 'unit-8', // Gram
    conversionRate: 1000, // 1 kg = 1000 g
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  
  // Snack - Hộp to Gói
  {
    id: 'conv-6',
    productId: 'prod-snack',
    fromUnitId: 'unit-14', // Hộp
    toUnitId: 'unit-13', // Gói
    conversionRate: 12, // 1 hộp = 12 gói
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Conversion templates for quick setup
export const conversionTemplates: ConversionTemplate[] = [
  {
    id: 'template-1',
    name: 'Nước ngọt đóng lon (24 lon/thùng)',
    description: 'Áp dụng cho Coca, Pepsi, Sting, etc.',
    conversions: [
      { fromUnit: 'Thùng', toUnit: 'Lon', rate: 24 },
      { fromUnit: 'Lốc', toUnit: 'Lon', rate: 6 },
    ],
  },
  {
    id: 'template-2',
    name: 'Nước ngọt chai lớn (20 chai/thùng)',
    description: 'Áp dụng cho chai 1.5L, 2L',
    conversions: [
      { fromUnit: 'Thùng', toUnit: 'Chai', rate: 20 },
      { fromUnit: 'Lốc', toUnit: 'Chai', rate: 4 },
    ],
  },
  {
    id: 'template-3',
    name: 'Bia lon (24 lon/thùng)',
    description: 'Áp dụng cho bia Tiger, Heineken, Sài Gòn',
    conversions: [
      { fromUnit: 'Thùng', toUnit: 'Lon', rate: 24 },
      { fromUnit: 'Lốc', toUnit: 'Lon', rate: 6 },
    ],
  },
  {
    id: 'template-4',
    name: 'Bia chai (20 chai/thùng)',
    description: 'Áp dụng cho bia chai 330ml, 450ml',
    conversions: [
      { fromUnit: 'Thùng', toUnit: 'Chai', rate: 20 },
    ],
  },
  {
    id: 'template-5',
    name: 'Gạo (50kg/bao)',
    description: 'Bao gạo tiêu chuẩn',
    conversions: [
      { fromUnit: 'Bao', toUnit: 'Kg', rate: 50 },
      { fromUnit: 'Kg', toUnit: 'Gram', rate: 1000 },
    ],
  },
  {
    id: 'template-6',
    name: 'Snack (12 gói/hộp)',
    description: 'Hộp snack tiêu chuẩn',
    conversions: [
      { fromUnit: 'Hộp', toUnit: 'Gói', rate: 12 },
    ],
  },
  {
    id: 'template-7',
    name: 'Mì gói (30 gói/thùng)',
    description: 'Thùng mì ăn liền',
    conversions: [
      { fromUnit: 'Thùng', toUnit: 'Gói', rate: 30 },
    ],
  },
]

// Helper function to get unit by id
export const getUnitById = (id: string): Unit | undefined => {
  return units.find(u => u.id === id)
}

// Helper function to get conversions for a product
export const getProductConversions = (productId: string): UnitConversion[] => {
  return unitConversions.filter(c => c.productId === productId)
}

// Helper function to convert quantity between units
export const convertQuantity = (
  quantity: number,
  fromUnitId: string,
  toUnitId: string,
  productId: string
): number | null => {
  // If same unit, return as is
  if (fromUnitId === toUnitId) return quantity

  // Find direct conversion
  const directConversion = unitConversions.find(
    c => c.productId === productId && c.fromUnitId === fromUnitId && c.toUnitId === toUnitId
  )
  
  if (directConversion) {
    return quantity * directConversion.conversionRate
  }

  // Find reverse conversion
  const reverseConversion = unitConversions.find(
    c => c.productId === productId && c.fromUnitId === toUnitId && c.toUnitId === fromUnitId
  )
  
  if (reverseConversion) {
    return quantity / reverseConversion.conversionRate
  }

  // No conversion found
  return null
}
