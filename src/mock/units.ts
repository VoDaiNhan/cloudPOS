import type { Unit, UnitConversion, ConversionTemplate } from '../types/unit'

// ============================================
// HỆ THỐNG ĐƠN VỊ CHUẨN
// ============================================

export const units: Unit[] = [
  // ── ĐƠN CHIẾC ──────────────────────────────
  {
    id: 'unit-1',
    name: 'Cái',
    shortName: 'Cái',
    category: 'piece',
    isBase: true,
    description: 'Đơn vị đếm cơ bản',
  },
  {
    id: 'unit-2',
    name: 'Chiếc',
    shortName: 'Chiếc',
    category: 'piece',
    isBase: true,
    description: 'Dùng cho đồ có hình dạng',
  },
  {
    id: 'unit-3',
    name: 'Bộ',
    shortName: 'Bộ',
    category: 'piece',
    isBase: false,
    conversionRate: 1,
    description: 'Tập hợp nhiều món',
  },

  // ── ĐÓNG GÓI ──────────────────────────────
  {
    id: 'unit-4',
    name: 'Lon',
    shortName: 'L',
    category: 'package',
    isBase: true,
  },
  {
    id: 'unit-5',
    name: 'Chai',
    shortName: 'Ch',
    category: 'package',
    isBase: true,
  },
  {
    id: 'unit-6',
    name: 'Thùng',
    shortName: 'Th',
    category: 'package',
    isBase: false,
  },
  {
    id: 'unit-7',
    name: 'Lốc',
    shortName: 'Lốc',
    category: 'package',
    isBase: false,
  },
  {
    id: 'unit-8',
    name: 'Gói',
    shortName: 'Gói',
    category: 'package',
    isBase: true,
  },
  {
    id: 'unit-9',
    name: 'Kg',
    shortName: 'Kg',
    category: 'weight',
    isBase: true,
  },
  {
    id: 'unit-10',
    name: 'Gam',
    shortName: 'G',
    category: 'weight',
    isBase: false,
    conversionRate: 0.001,
  },
  {
    id: 'unit-11',
    name: 'Bao',
    shortName: 'Bao',
    category: 'package',
    isBase: false,
  },
  {
    id: 'unit-12',
    name: 'Hộp',
    shortName: 'Hộp',
    category: 'package',
    isBase: true,
  },
  {
    id: 'unit-13',
    name: 'Vỉ',
    shortName: 'Vỉ',
    category: 'package',
    isBase: false,
  },
  {
    id: 'unit-14',
    name: 'Quả',
    shortName: 'Q',
    category: 'piece',
    isBase: true,
  },
  {
    id: 'unit-15',
    name: 'Bao 50kg',
    shortName: 'Bao',
    category: 'package',
    isBase: false,
  },
]

// ============================================
// QUY ĐỔI ĐƠN VỊ MẪU
// ============================================

export const unitConversions: UnitConversion[] = [
  // Coca Cola
  {
    id: 'conv-1',
    productId: 'prod-coca',
    fromUnitId: 'unit-6', // Thùng
    toUnitId: 'unit-4', // Lon
    conversionRate: 24,
    fromUnit: 'unit-6',
    toUnit: 'unit-4',
    rate: 24,
    isDefault: true,
  },
  {
    id: 'conv-2',
    productId: 'prod-coca',
    fromUnitId: 'unit-7', // Lốc
    toUnitId: 'unit-4', // Lon
    conversionRate: 6,
    fromUnit: 'unit-7',
    toUnit: 'unit-4',
    rate: 6,
  },
  // Pepsi
  {
    id: 'conv-3',
    productId: 'prod-pepsi',
    fromUnitId: 'unit-6', // Thùng
    toUnitId: 'unit-5', // Chai
    conversionRate: 20,
    fromUnit: 'unit-6',
    toUnit: 'unit-5',
    rate: 20,
    isDefault: true,
  },
  // Gạo
  {
    id: 'conv-4',
    productId: 'prod-rice',
    fromUnitId: 'unit-15', // Bao 50kg
    toUnitId: 'unit-9', // Kg
    conversionRate: 50,
    fromUnit: 'unit-15',
    toUnit: 'unit-9',
    rate: 50,
    isDefault: true,
  },
]

// ============================================
// MẪU QUY ĐỔI NHANH
// ============================================

export const conversionTemplates: ConversionTemplate[] = [
  {
    id: 'temp-drink',
    name: 'Đồ uống đóng lon',
    description: 'Thùng 24 lon, Lốc 6 lon',
    conversions: [
      { fromUnit: 'Thùng', toUnit: 'Lon', rate: 24 },
      { fromUnit: 'Lốc', toUnit: 'Lon', rate: 6 },
    ],
  },
  {
    id: 'temp-bottle',
    name: 'Đồ uống đóng chai',
    description: 'Thùng 24 chai, Thùng 12 chai',
    conversions: [
      { fromUnit: 'Thùng', toUnit: 'Chai', rate: 24 },
    ],
  },
  {
    id: 'temp-rice',
    name: 'Nông sản (Gạo)',
    description: 'Bao 50kg, Bao 25kg, Bao 10kg',
    conversions: [
      { fromUnit: 'Bao', toUnit: 'Kg', rate: 50 },
    ],
  },
  {
    id: 'temp-egg',
    name: 'Trứng',
    description: 'Vỉ 30 quả, Vỉ 10 quả',
    conversions: [
      { fromUnit: 'Vỉ', toUnit: 'Quả', rate: 30 },
      { fromUnit: 'Hộp', toUnit: 'Quả', rate: 10 },
    ],
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export const convertQuantity = (
  quantity: number,
  fromUnitId: string,
  toUnitId: string,
  productId?: string
): number => {
  if (fromUnitId === toUnitId) return quantity

  // Find conversion for this specific product
  const conversion = unitConversions.find(
    (c) => 
      c.productId === productId && 
      (((c.fromUnitId ?? c.fromUnit) === fromUnitId && (c.toUnitId ?? c.toUnit) === toUnitId) ||
       ((c.fromUnitId ?? c.fromUnit) === toUnitId && (c.toUnitId ?? c.toUnit) === fromUnitId))
  )

  if (conversion) {
    const rate = conversion.conversionRate ?? conversion.rate
    if ((conversion.fromUnitId ?? conversion.fromUnit) === fromUnitId) {
      return quantity * rate
    } else {
      return quantity / rate
    }
  }

  // Fallback to standard units if applicable (categories match)
  const fromUnit = units.find(u => u.id === fromUnitId)
  const toUnit = units.find(u => u.id === toUnitId)

  if (fromUnit && toUnit && fromUnit.category === toUnit.category) {
    const fromRate = fromUnit.conversionRate || 1
    const toRate = toUnit.conversionRate || 1
    return (quantity * fromRate) / toRate
  }

  return quantity
}

export const getUnitName = (id: string) => {
  return units.find((u) => u.id === id)?.name || id
}
