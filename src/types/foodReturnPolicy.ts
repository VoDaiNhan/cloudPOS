// Food & Beverage Return Policy Types
// Chính sách đổi trả đặc biệt cho hàng ăn uống

export type ProductCategory = 
  | 'food' // Đồ ăn
  | 'beverage' // Đồ uống
  | 'perishable' // Hàng dễ hỏng
  | 'packaged' // Hàng đóng gói
  | 'general' // Hàng thông thường

export type FoodReturnReason =
  | 'wrong_order' // Giao sai món
  | 'quality_issue' // Vấn đề chất lượng (mùi vị, độ tươi)
  | 'foreign_object' // Có dị vật
  | 'temperature_issue' // Nhiệt độ không đúng (nóng/lạnh)
  | 'expired' // Hết hạn
  | 'allergic_reaction' // Dị ứng
  | 'customer_change_mind' // Khách đổi ý (trong thời gian cho phép)
  | 'preparation_error' // Chế biến sai (quá mặn, quá cay, v.v.)

export type FoodDisposalMethod =
  | 'destroy' // Tiêu hủy ngay
  | 'return_supplier' // Trả nhà cung cấp (nếu lỗi từ NCC)
  | 'staff_consumption' // Nhân viên tiêu thụ (nếu còn an toàn)
  | 'donate' // Quyên góp (nếu còn tốt và trong hạn)
  | 'record_only' // Chỉ ghi nhận, không thu hồi vật lý

export interface FoodReturnRule {
  category: ProductCategory
  
  // Thời gian cho phép trả
  allowReturnBeforeServed: boolean // Cho phép trả trước khi phục vụ
  allowReturnAfterServed: boolean // Cho phép trả sau khi phục vụ
  maxReturnMinutesAfterServed: number // Số phút tối đa sau khi phục vụ
  
  // Điều kiện trả
  requirePhotoEvidence: boolean // Bắt buộc chụp ảnh bằng chứng
  requireManagerApproval: boolean // Cần quản lý phê duyệt
  allowPartialReturn: boolean // Cho phép trả một phần (VD: ăn 1/2 đĩa)
  
  // Hoàn tiền
  refundPercentage: number // % hoàn tiền (0-100)
  refundMethod: 'full' | 'partial' | 'voucher' | 'none'
  
  // Xử lý hàng
  disposalMethod: FoodDisposalMethod
  requireDisposalPhoto: boolean // Bắt buộc chụp ảnh khi tiêu hủy
  
  // Ghi nhận
  affectsInventory: boolean // Có ảnh hưởng đến tồn kho không
  recordAsWaste: boolean // Ghi nhận là hao hụt
  recordAsCost: boolean // Ghi nhận là chi phí
}

export interface FoodReturnValidation {
  canReturn: boolean
  reason: string
  requiresApproval: boolean
  refundAmount: number
  refundPercentage: number
  disposalMethod: FoodDisposalMethod
  warnings: string[]
  actions: string[] // Các bước cần thực hiện
}

export interface FoodWasteRecord {
  id: string
  date: string
  productId: string
  productName: string
  category: ProductCategory
  quantity: number
  unit: string
  originalValue: number // Giá trị gốc
  
  // Lý do hao hụt
  reason: 'return' | 'expired' | 'damaged' | 'overproduction' | 'quality_control'
  reasonDetail: string
  
  // Xử lý
  disposalMethod: FoodDisposalMethod
  disposalDate: string
  disposalBy: string
  
  // Bằng chứng
  photos: string[]
  notes: string
  
  // Trách nhiệm
  responsibleStaff?: string
  shift?: string
  
  createdBy: string
  createdAt: string
}

export interface ExpiryCheckResult {
  isExpired: boolean
  isNearExpiry: boolean
  daysUntilExpiry: number
  canSell: boolean
  canReturn: boolean
  action: 'sell_normal' | 'sell_discount' | 'remove_from_sale' | 'destroy'
  discountPercentage?: number
}
