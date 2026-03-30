import type { Unit, UnitConversion } from '../types/unit'

// ============================================
// HỆ THỐNG ĐỢN VỊ CHUẨN
// ============================================

export const standardUnits: Unit[] = [
  // ── ĐƠN CHIẾC ──────────────────────────────
  {
    id: 'cai',
    name: 'Cái',
    category: 'piece',
    isBase: true,
    description: 'Đơn vị đếm cơ bản',
  },
  {
    id: 'chiec',
    name: 'Chiếc',
    category: 'piece',
    isBase: true,
    description: 'Dùng cho đồ có hình dạng (giày, áo, xe)',
  },
  {
    id: 'con',
    name: 'Con',
    category: 'piece',
    isBase: true,
    description: 'Dùng cho động vật, đồ vật nhỏ',
  },
  {
    id: 'bo',
    name: 'Bộ',
    category: 'piece',
    isBase: false,
    description: 'Tập hợp nhiều món (bộ bàn ghế, bộ đồ ăn)',
  },
  {
    id: 'cap',
    name: 'Cặp',
    category: 'piece',
    isBase: false,
    conversionRate: 2,
    description: '1 cặp = 2 chiếc',
  },
  {
    id: 'ta',
    name: 'Tá',
    category: 'piece',
    isBase: false,
    conversionRate: 12,
    description: '1 tá = 12 cái',
  },

  // ── KHỐI LƯỢNG ──────────────────────────────
  {
    id: 'g',
    name: 'Gram (g)',
    category: 'weight',
    isBase: true,
    description: 'Đơn vị khối lượng cơ bản',
  },
  {
    id: 'kg',
    name: 'Kilogram (kg)',
    category: 'weight',
    isBase: false,
    conversionRate: 1000,
    description: '1 kg = 1000 g',
  },
  {
    id: 'tan',
    name: 'Tấn',
    category: 'weight',
    isBase: false,
    conversionRate: 1000000,
    description: '1 tấn = 1000 kg = 1,000,000 g',
  },
  {
    id: 'yen',
    name: 'Yến',
    category: 'weight',
    isBase: false,
    conversionRate: 10,
    description: '1 yến = 10 g (dùng trong vàng bạc)',
  },
  {
    id: 'luong',
    name: 'Lượng',
    category: 'weight',
    isBase: false,
    conversionRate: 37.5,
    description: '1 lượng = 37.5 g (dùng trong vàng)',
  },

  // ── THỂ TÍCH ──────────────────────────────
  {
    id: 'ml',
    name: 'Mililít (ml)',
    category: 'volume',
    isBase: true,
    description: 'Đơn vị thể tích cơ bản',
  },
  {
    id: 'lit',
    name: 'Lít (l)',
    category: 'volume',
    isBase: false,
    conversionRate: 1000,
    description: '1 lít = 1000 ml',
  },
  {
    id: 'm3',
    name: 'Mét khối (m³)',
    category: 'volume',
    isBase: false,
    conversionRate: 1000000,
    description: '1 m³ = 1000 lít',
  },

  // ── CHIỀU DÀI ──────────────────────────────
  {
    id: 'cm',
    name: 'Centimet (cm)',
    category: 'length',
    isBase: true,
    description: 'Đơn vị chiều dài cơ bản',
  },
  {
    id: 'm',
    name: 'Mét (m)',
    category: 'length',
    isBase: false,
    conversionRate: 100,
    description: '1 m = 100 cm',
  },
  {
    id: 'km',
    name: 'Kilomet (km)',
    category: 'length',
    isBase: false,
    conversionRate: 100000,
    description: '1 km = 1000 m',
  },

  // ── DIỆN TÍCH ──────────────────────────────
  {
    id: 'cm2',
    name: 'Centimet vuông (cm²)',
    category: 'area',
    isBase: true,
    description: 'Đơn vị diện tích cơ bản',
  },
  {
    id: 'm2',
    name: 'Mét vuông (m²)',
    category: 'area',
    isBase: false,
    conversionRate: 10000,
    description: '1 m² = 10,000 cm²',
  },

  // ── ĐÓNG GÓI ──────────────────────────────
  {
    id: 'goi',
    name: 'Gói',
    category: 'package',
    isBase: true,
    description: 'Đơn vị đóng gói nhỏ',
  },
  {
    id: 'hop',
    name: 'Hộp',
    category: 'package',
    isBase: true,
    description: 'Đơn vị đóng gói trung bình',
  },
  {
    id: 'thung',
    name: 'Thùng',
    category: 'package',
    isBase: false,
    description: 'Đơn vị đóng gói lớn',
  },
  {
    id: 'bao',
    name: 'Bao',
    category: 'package',
    isBase: false,
    description: 'Đơn vị đóng gói lớn (gạo, xi măng)',
  },
  {
    id: 'lon',
    name: 'Lon',
    category: 'package',
    isBase: true,
    description: 'Đồ uống đóng lon',
  },
  {
    id: 'loc',
    name: 'Lốc',
    category: 'package',
    isBase: false,
    description: 'Đơn vị trung bình (thường 6 lon)',
  },
  {
    id: 'chai',
    name: 'Chai',
    category: 'package',
    isBase: true,
    description: 'Đồ uống đóng chai',
  },

  // ── ĐỒ ĂN ──────────────────────────────
  {
    id: 'phan',
    name: 'Phần',
    category: 'food',
    isBase: true,
    description: 'Suất ăn cho 1 người',
  },
  {
    id: 'suat',
    name: 'Suất',
    category: 'food',
    isBase: true,
    description: 'Suất ăn (tương đương phần)',
  },
  {
    id: 'dia',
    name: 'Dĩa',
    category: 'food',
    isBase: true,
    description: 'Món ăn tính theo dĩa',
  },
  {
    id: 'bat',
    name: 'Bát',
    category: 'food',
    isBase: true,
    description: 'Món ăn tính theo bát (phở, cơm)',
  },
  {
    id: 'ly',
    name: 'Ly',
    category: 'food',
    isBase: true,
    description: 'Đồ uống tính theo ly',
  },
  {
    id: 'to',
    name: 'Tô',
    category: 'food',
    isBase: true,
    description: 'Món ăn tính theo tô (lớn hơn bát)',
  },
]

// ============================================
// QUY ĐỔI ĐƠN VỊ MẪU
// ============================================

export const sampleConversions: UnitConversion[] = [
  // Nước ngọt
  {
    id: 'conv-001',
    productId: null, // Áp dụng chung
    fromUnit: 'thung',
    toUnit: 'lon',
    rate: 24,
    description: '1 thùng = 24 lon (nước ngọt)',
  },
  {
    id: 'conv-001-1',
    productId: null,
    fromUnit: 'loc',
    toUnit: 'lon',
    rate: 6,
    description: '1 lốc = 6 lon (nước ngọt)',
  },
  {
    id: 'conv-002',
    productId: null,
    fromUnit: 'thung',
    toUnit: 'chai',
    rate: 12,
    description: '1 thùng = 12 chai (nước suối)',
  },
  
  // Gạo
  {
    id: 'conv-003',
    productId: null,
    fromUnit: 'bao',
    toUnit: 'kg',
    rate: 50,
    description: '1 bao = 50 kg (gạo)',
  },
  
  // Trứng
  {
    id: 'conv-004',
    productId: null,
    fromUnit: 'hop',
    toUnit: 'qua',
    rate: 10,
    description: '1 hộp = 10 quả (trứng)',
  },
  {
    id: 'conv-005',
    productId: null,
    fromUnit: 'thung',
    toUnit: 'qua',
    rate: 360,
    description: '1 thùng = 360 quả (trứng)',
  },
  
  // Bia
  {
    id: 'conv-006',
    productId: null,
    fromUnit: 'thung',
    toUnit: 'chai',
    rate: 24,
    description: '1 thùng = 24 chai (bia)',
  },
  
  // Sữa
  {
    id: 'conv-007',
    productId: null,
    fromUnit: 'thung',
    toUnit: 'hop',
    rate: 48,
    description: '1 thùng = 48 hộp (sữa)',
  },
  
  // Bánh snack
  {
    id: 'conv-008',
    productId: null,
    fromUnit: 'thung',
    toUnit: 'goi',
    rate: 30,
    description: '1 thùng = 30 gói (snack)',
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getUnitsByCategory = (category: string) => {
  return standardUnits.filter(u => u.category === category)
}

export const getBaseUnit = (category: string) => {
  return standardUnits.find(u => u.category === category && u.isBase)
}

export const getLargerUnits = (category: string) => {
  return standardUnits.filter(u => u.category === category && !u.isBase)
}

export const convertUnit = (
  value: number,
  fromUnitId: string,
  toUnitId: string,
  customConversion?: UnitConversion
): number => {
  // Nếu cùng đơn vị
  if (fromUnitId === toUnitId) return value

  const fromUnit = standardUnits.find(u => u.id === fromUnitId)
  const toUnit = standardUnits.find(u => u.id === toUnitId)

  if (!fromUnit || !toUnit) return value

  // Kiểm tra custom conversion trước
  if (customConversion) {
    if (customConversion.fromUnit === fromUnitId && customConversion.toUnit === toUnitId) {
      return value * customConversion.rate
    }
    if (customConversion.fromUnit === toUnitId && customConversion.toUnit === fromUnitId) {
      return value / customConversion.rate
    }
  }

  // Nếu khác category thì không quy đổi được
  if (fromUnit.category !== toUnit.category) return value

  // Quy đổi thông qua đơn vị cơ bản
  const fromRate = fromUnit.conversionRate || 1
  const toRate = toUnit.conversionRate || 1

  return (value * fromRate) / toRate
}

export const getConversionRate = (fromUnitId: string, toUnitId: string): number => {
  return convertUnit(1, fromUnitId, toUnitId)
}

export const formatUnitDisplay = (value: number, unitId: string): string => {
  const unit = standardUnits.find(u => u.id === unitId)
  if (!unit) return `${value}`
  
  return `${value.toLocaleString('vi-VN')} ${unit.name}`
}
