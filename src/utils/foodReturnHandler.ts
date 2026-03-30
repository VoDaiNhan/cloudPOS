// Food & Beverage Return Handler
// Logic xử lý đổi trả hàng ăn uống

import type {
  ProductCategory,
  FoodReturnRule,
  FoodReturnValidation,
  FoodDisposalMethod,
  ExpiryCheckResult,
  FoodWasteRecord,
} from '../types/foodReturnPolicy'

// ============================================
// CHÍNH SÁCH ĐỔI TRẢ THEO LOẠI HÀNG
// ============================================

export const foodReturnRules: Record<ProductCategory, FoodReturnRule> = {
  // Đồ ăn tươi sống, chế biến sẵn
  food: {
    category: 'food',
    allowReturnBeforeServed: true, // Cho phép trả trước khi giao
    allowReturnAfterServed: true, // Cho phép trả sau khi giao (nếu có vấn đề)
    maxReturnMinutesAfterServed: 10, // Chỉ trong 10 phút sau khi giao
    requirePhotoEvidence: true, // Bắt buộc chụp ảnh
    requireManagerApproval: true, // Cần quản lý duyệt
    allowPartialReturn: false, // Không cho trả một phần
    refundPercentage: 100, // Hoàn 100% nếu lỗi từ cửa hàng
    refundMethod: 'full',
    disposalMethod: 'destroy', // Tiêu hủy ngay
    requireDisposalPhoto: true,
    affectsInventory: true,
    recordAsWaste: true,
    recordAsCost: true,
  },

  // Đồ uống
  beverage: {
    category: 'beverage',
    allowReturnBeforeServed: true,
    allowReturnAfterServed: true,
    maxReturnMinutesAfterServed: 5, // 5 phút sau khi giao
    requirePhotoEvidence: true,
    requireManagerApproval: false, // Không cần duyệt nếu chưa động đến
    allowPartialReturn: false,
    refundPercentage: 100,
    refundMethod: 'full',
    disposalMethod: 'destroy',
    requireDisposalPhoto: false,
    affectsInventory: true,
    recordAsWaste: true,
    recordAsCost: true,
  },

  // Hàng dễ hỏng (bánh mì, sữa tươi, v.v.)
  perishable: {
    category: 'perishable',
    allowReturnBeforeServed: true,
    allowReturnAfterServed: true,
    maxReturnMinutesAfterServed: 30, // 30 phút
    requirePhotoEvidence: true,
    requireManagerApproval: true,
    allowPartialReturn: false,
    refundPercentage: 100,
    refundMethod: 'full',
    disposalMethod: 'destroy', // Hoặc staff_consumption nếu còn tốt
    requireDisposalPhoto: true,
    affectsInventory: true,
    recordAsWaste: true,
    recordAsCost: true,
  },

  // Hàng đóng gói (snack, nước ngọt đóng chai)
  packaged: {
    category: 'packaged',
    allowReturnBeforeServed: true,
    allowReturnAfterServed: true,
    maxReturnMinutesAfterServed: 60, // 1 giờ
    requirePhotoEvidence: false,
    requireManagerApproval: false,
    allowPartialReturn: false,
    refundPercentage: 100,
    refundMethod: 'full',
    disposalMethod: 'return_supplier', // Có thể trả NCC nếu còn nguyên seal
    requireDisposalPhoto: false,
    affectsInventory: true,
    recordAsWaste: false, // Không phải waste nếu trả được NCC
    recordAsCost: false,
  },

  // Hàng thông thường
  general: {
    category: 'general',
    allowReturnBeforeServed: true,
    allowReturnAfterServed: true,
    maxReturnMinutesAfterServed: 1440, // 24 giờ
    requirePhotoEvidence: false,
    requireManagerApproval: false,
    allowPartialReturn: false,
    refundPercentage: 100,
    refundMethod: 'full',
    disposalMethod: 'record_only',
    requireDisposalPhoto: false,
    affectsInventory: true,
    recordAsWaste: false,
    recordAsCost: false,
  },
}

// ============================================
// KIỂM TRA HẠN SỬ DỤNG
// ============================================

export const checkExpiry = (
  expiryDate: string,
  category: ProductCategory
): ExpiryCheckResult => {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - now.getTime()
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const isExpired = daysUntilExpiry < 0
  
  // Ngưỡng cảnh báo gần hết hạn theo loại hàng
  const nearExpiryThreshold = {
    food: 1, // 1 ngày
    beverage: 2, // 2 ngày
    perishable: 1, // 1 ngày
    packaged: 7, // 7 ngày
    general: 30, // 30 ngày
  }

  const isNearExpiry = daysUntilExpiry <= nearExpiryThreshold[category] && daysUntilExpiry > 0

  // Quyết định hành động
  let action: ExpiryCheckResult['action'] = 'sell_normal'
  let discountPercentage: number | undefined
  let canSell = true
  let canReturn = false

  if (isExpired) {
    action = 'destroy'
    canSell = false
    canReturn = true // Có thể trả NCC nếu trong chính sách
  } else if (isNearExpiry) {
    // Giảm giá theo số ngày còn lại
    if (daysUntilExpiry === 0) {
      // Hôm nay hết hạn
      action = 'sell_discount'
      discountPercentage = 50
      canSell = true
    } else if (daysUntilExpiry === 1) {
      action = 'sell_discount'
      discountPercentage = 30
      canSell = true
    } else if (daysUntilExpiry <= 3) {
      action = 'sell_discount'
      discountPercentage = 20
      canSell = true
    } else {
      action = 'sell_discount'
      discountPercentage = 10
      canSell = true
    }
  }

  return {
    isExpired,
    isNearExpiry,
    daysUntilExpiry,
    canSell,
    canReturn,
    action,
    discountPercentage,
  }
}

// ============================================
// VALIDATE VIỆC TRẢ HÀNG ĂN UỐNG
// ============================================

export const validateFoodReturn = (
  category: ProductCategory,
  orderDate: string,
  servedDate: string | null,
  returnReason: string,
  originalPrice: number,
  hasBeenConsumed: boolean = false,
  expiryDate?: string
): FoodReturnValidation => {
  const rule = foodReturnRules[category]
  const now = new Date()
  const warnings: string[] = []
  const actions: string[] = []

  // Kiểm tra hết hạn nếu có
  if (expiryDate) {
    const expiryCheck = checkExpiry(expiryDate, category)
    if (expiryCheck.isExpired) {
      warnings.push(`Sản phẩm đã hết hạn ${Math.abs(expiryCheck.daysUntilExpiry)} ngày`)
      actions.push('Tiêu hủy ngay lập tức')
      actions.push('Chụp ảnh bằng chứng')
      actions.push('Ghi nhận vào sổ hao hụt')
    }
  }

  // Trường hợp 1: Chưa phục vụ (khách hủy trước khi nhận)
  if (!servedDate) {
    if (!rule.allowReturnBeforeServed) {
      return {
        canReturn: false,
        reason: 'Không cho phép hủy món sau khi đã đặt',
        requiresApproval: true,
        refundAmount: 0,
        refundPercentage: 0,
        disposalMethod: 'record_only',
        warnings,
        actions: ['Liên hệ quản lý để xử lý đặc biệt'],
      }
    }

    // Cho phép hủy trước khi phục vụ
    actions.push('Hủy món trong hệ thống')
    actions.push('Hoàn tiền 100%')
    
    // Nếu đã chế biến rồi
    if (category === 'food' || category === 'beverage') {
      actions.push('Kiểm tra món đã chế biến chưa')
      actions.push('Nếu đã chế biến: ghi nhận hao hụt')
      actions.push('Nếu chưa: hủy order bình thường')
    }

    return {
      canReturn: true,
      reason: 'Hủy món trước khi phục vụ',
      requiresApproval: false,
      refundAmount: originalPrice,
      refundPercentage: 100,
      disposalMethod: category === 'food' || category === 'beverage' ? 'destroy' : 'record_only',
      warnings,
      actions,
    }
  }

  // Trường hợp 2: Đã phục vụ
  const served = new Date(servedDate)
  const minutesSinceServed = (now.getTime() - served.getTime()) / (1000 * 60)

  if (!rule.allowReturnAfterServed) {
    return {
      canReturn: false,
      reason: 'Không cho phép trả món sau khi đã phục vụ',
      requiresApproval: true,
      refundAmount: 0,
      refundPercentage: 0,
      disposalMethod: 'record_only',
      warnings: [...warnings, 'Loại hàng này không được trả sau khi phục vụ'],
      actions: ['Liên hệ quản lý để xử lý đặc biệt'],
    }
  }

  // Kiểm tra thời gian
  if (minutesSinceServed > rule.maxReturnMinutesAfterServed) {
    warnings.push(
      `Đã quá thời gian cho phép trả (${rule.maxReturnMinutesAfterServed} phút)`
    )
    return {
      canReturn: false,
      reason: `Quá thời gian cho phép trả (${Math.round(minutesSinceServed)} phút / ${rule.maxReturnMinutesAfterServed} phút)`,
      requiresApproval: true,
      refundAmount: 0,
      refundPercentage: 0,
      disposalMethod: 'record_only',
      warnings,
      actions: ['Cần quản lý phê duyệt đặc biệt'],
    }
  }

  // Kiểm tra đã tiêu thụ chưa
  if (hasBeenConsumed && !rule.allowPartialReturn) {
    warnings.push('Món đã được tiêu thụ một phần')
    
    // Chỉ hoàn nếu có vấn đề chất lượng
    const qualityIssues = ['quality_issue', 'foreign_object', 'preparation_error', 'expired']
    if (!qualityIssues.includes(returnReason)) {
      return {
        canReturn: false,
        reason: 'Không cho phép trả món đã tiêu thụ (trừ khi có vấn đề chất lượng)',
        requiresApproval: true,
        refundAmount: 0,
        refundPercentage: 0,
        disposalMethod: 'record_only',
        warnings,
        actions: ['Kiểm tra lý do trả hàng', 'Liên hệ quản lý nếu cần'],
      }
    }
  }

  // Tính % hoàn tiền
  let refundPercentage = rule.refundPercentage
  let refundMethod = rule.refundMethod

  // Điều chỉnh theo lý do
  const customerFaultReasons = ['customer_change_mind']
  if (customerFaultReasons.includes(returnReason)) {
    refundPercentage = 50 // Chỉ hoàn 50% nếu khách đổi ý
    refundMethod = 'voucher' // Hoàn bằng voucher
    warnings.push('Khách đổi ý: chỉ hoàn 50% bằng voucher')
  }

  // Xây dựng actions
  if (rule.requirePhotoEvidence) {
    actions.push('Chụp ảnh món hàng trước khi thu hồi')
  }

  if (rule.requireManagerApproval) {
    actions.push('Yêu cầu quản lý phê duyệt')
  }

  actions.push(`Hoàn tiền ${refundPercentage}% (${(originalPrice * refundPercentage) / 100}đ)`)

  // Xử lý món hàng
  switch (rule.disposalMethod) {
    case 'destroy':
      actions.push('Tiêu hủy món hàng ngay lập tức')
      if (rule.requireDisposalPhoto) {
        actions.push('Chụp ảnh quá trình tiêu hủy')
      }
      actions.push('Ghi nhận vào sổ hao hụt')
      break
    case 'staff_consumption':
      actions.push('Kiểm tra món còn an toàn thực phẩm không')
      actions.push('Nếu an toàn: nhân viên có thể tiêu thụ')
      actions.push('Nếu không: tiêu hủy')
      break
    case 'return_supplier':
      actions.push('Kiểm tra điều kiện trả nhà cung cấp')
      actions.push('Nếu đủ điều kiện: tạo phiếu trả NCC')
      actions.push('Nếu không: tiêu hủy')
      break
    case 'donate':
      actions.push('Kiểm tra món còn trong hạn và an toàn')
      actions.push('Liên hệ tổ chức từ thiện')
      break
    case 'record_only':
      actions.push('Chỉ ghi nhận trong hệ thống')
      break
  }

  if (rule.recordAsWaste) {
    actions.push('Cập nhật báo cáo hao hụt')
  }

  if (rule.recordAsCost) {
    actions.push('Ghi nhận chi phí hao hụt')
  }

  return {
    canReturn: true,
    reason: 'Đủ điều kiện trả hàng',
    requiresApproval: rule.requireManagerApproval,
    refundAmount: (originalPrice * refundPercentage) / 100,
    refundPercentage,
    disposalMethod: rule.disposalMethod,
    warnings,
    actions,
  }
}

// ============================================
// TẠO PHIẾU HAO HỤT
// ============================================

export const createWasteRecord = (
  productId: string,
  productName: string,
  category: ProductCategory,
  quantity: number,
  unit: string,
  originalValue: number,
  reason: FoodWasteRecord['reason'],
  reasonDetail: string,
  disposalMethod: FoodDisposalMethod,
  staffId: string,
  photos: string[] = [],
  notes: string = ''
): FoodWasteRecord => {
  return {
    id: `waste-${Date.now()}`,
    date: new Date().toISOString(),
    productId,
    productName,
    category,
    quantity,
    unit,
    originalValue,
    reason,
    reasonDetail,
    disposalMethod,
    disposalDate: new Date().toISOString(),
    disposalBy: staffId,
    photos,
    notes,
    createdBy: staffId,
    createdAt: new Date().toISOString(),
  }
}

// ============================================
// XỬ LÝ HÀNG HẾT HẠN HÀNG LOẠT
// ============================================

export const processExpiredItems = (
  items: Array<{
    id: string
    name: string
    category: ProductCategory
    expiryDate: string
    quantity: number
    unit: string
    costPrice: number
  }>,
  staffId: string
): {
  toDestroy: FoodWasteRecord[]
  toDiscount: Array<{ id: string; discountPercentage: number }>
  toReturnSupplier: string[]
  totalLoss: number
} => {
  const toDestroy: FoodWasteRecord[] = []
  const toDiscount: Array<{ id: string; discountPercentage: number }> = []
  const toReturnSupplier: string[] = []
  let totalLoss = 0

  items.forEach((item) => {
    const expiryCheck = checkExpiry(item.expiryDate, item.category)

    if (expiryCheck.action === 'destroy') {
      // Tiêu hủy
      const wasteRecord = createWasteRecord(
        item.id,
        item.name,
        item.category,
        item.quantity,
        item.unit,
        item.costPrice * item.quantity,
        'expired',
        `Hết hạn ngày ${new Date(item.expiryDate).toLocaleDateString('vi-VN')}`,
        'destroy',
        staffId,
        [],
        'Tự động phát hiện hết hạn'
      )
      toDestroy.push(wasteRecord)
      totalLoss += wasteRecord.originalValue
    } else if (expiryCheck.action === 'sell_discount' && expiryCheck.discountPercentage) {
      // Giảm giá
      toDiscount.push({
        id: item.id,
        discountPercentage: expiryCheck.discountPercentage,
      })
    } else if (expiryCheck.canReturn && item.category === 'packaged') {
      // Trả nhà cung cấp (chỉ hàng đóng gói)
      toReturnSupplier.push(item.id)
    }
  })

  return {
    toDestroy,
    toDiscount,
    toReturnSupplier,
    totalLoss,
  }
}
