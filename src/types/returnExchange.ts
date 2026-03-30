// Return & Exchange Management Types

export type ReturnType = 'cancel' | 'return' | 'exchange'

export type ReturnReason =
  | 'technical_defect' // Lỗi kỹ thuật
  | 'wrong_item' // Giao sai hàng
  | 'change_size_color' // Đổi size/màu
  | 'no_need' // Không còn nhu cầu
  | 'shipping_damage' // Hỏng do vận chuyển
  | 'expired' // Hết hạn
  | 'customer_request' // Yêu cầu khách hàng
  | 'other' // Khác

export type ReturnCondition =
  | 'good' // Hàng còn tốt - bán lại được
  | 'defective' // Hàng lỗi - không bán được
  | 'opened' // Đã mở hộp - bán giảm giá
  | 'need_check' // Cần kiểm tra

export type ReturnWarehouse =
  | 'main' // Kho bán lại
  | 'defective' // Kho lỗi
  | 'clearance' // Kho hàng trưng bày/giảm giá
  | 'quarantine' // Kho chờ kiểm tra

export type RefundMethod =
  | 'cash' // Tiền mặt
  | 'bank_transfer' // Chuyển khoản
  | 'card' // Thẻ
  | 'ewallet' // Ví điện tử
  | 'store_credit' // Tích điểm/voucher

export interface ReturnOrderItem {
  id: string
  originalOrderItemId: string // ID món hàng trong đơn gốc
  productId: string
  productName: string
  productImage?: string
  batchNumber?: string
  
  // Thông tin đơn gốc
  originalQuantity: number // Số lượng đã mua
  originalPrice: number // Giá đã mua
  originalDiscount: number // Giảm giá đã áp dụng
  
  // Thông tin trả
  returnQuantity: number // Số lượng trả
  returnPrice: number // Giá trả (có thể khác giá mua nếu có chính sách)
  returnAmount: number // Tổng tiền trả = returnQuantity * returnPrice
  
  // Trạng thái hàng trả
  condition: ReturnCondition
  warehouse: ReturnWarehouse
  reason: ReturnReason
  reasonNote?: string
  
  // Đổi hàng (nếu có)
  exchangeProductId?: string
  exchangeProductName?: string
  exchangeQuantity?: number
  exchangePrice?: number
  exchangeAmount?: number
}

export interface ReturnOrder {
  id: string
  returnNumber: string // Mã phiếu trả: RT-2024-001
  type: ReturnType
  
  // Liên kết đơn gốc
  originalOrderId: string
  originalOrderNumber: string
  originalOrderDate: string
  originalOrderTotal: number
  
  // Khách hàng
  customerId?: string
  customerName?: string
  customerPhone?: string
  
  // Danh sách món trả
  items: ReturnOrderItem[]
  
  // Tính toán tài chính
  subtotal: number // Tổng giá trị hàng trả
  refundAmount: number // Số tiền hoàn lại
  additionalCharge: number // Số tiền thu thêm (nếu đổi hàng đắt hơn)
  netAmount: number // Số tiền ròng (âm = hoàn, dương = thu)
  
  // Phương thức hoàn tiền
  refundMethod: RefundMethod
  refundReference?: string // Mã tham chiếu (số tài khoản, mã giao dịch)
  
  // Điểm thưởng
  pointsToDeduct?: number // Điểm bị trừ lại (nếu có)
  
  // Trạng thái
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  
  // Phê duyệt
  requiresApproval: boolean
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
  
  // Metadata
  notes?: string
  attachments?: string[] // Ảnh hàng lỗi, v.v.
  returnDate: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ReturnPolicy {
  id: string
  name: string
  
  // Thời hạn
  returnDays: number // Số ngày được phép trả
  exchangeDays: number // Số ngày được phép đổi
  
  // Điều kiện
  requireReceipt: boolean // Bắt buộc có hóa đơn
  allowPromotionItems: boolean // Cho phép trả hàng khuyến mãi
  refundShippingFee: boolean // Hoàn phí ship
  deductPoints: boolean // Trừ điểm tích lũy
  
  // Phí
  restockingFee: number // Phí nhập kho lại (%)
  inspectionFee: number // Phí kiểm tra
  
  // Phê duyệt
  requireApprovalAmount: number // Giá trị cần phê duyệt
  requireApprovalReasons: ReturnReason[] // Lý do cần phê duyệt
  
  isActive: boolean
}

export interface ReturnStatistics {
  totalReturns: number
  totalRefundAmount: number
  returnRate: number // % đơn bị trả
  
  byReason: Record<ReturnReason, number>
  byCondition: Record<ReturnCondition, number>
  byProduct: Array<{
    productId: string
    productName: string
    returnCount: number
    returnAmount: number
  }>
  
  topReturnReasons: Array<{
    reason: ReturnReason
    count: number
    percentage: number
  }>
}

// Validation result
export interface ReturnValidation {
  valid: boolean
  errors: string[]
  warnings: string[]
  canProceed: boolean
}

// Search filters
export interface ReturnSearchFilters {
  type?: ReturnType
  status?: ReturnOrder['status']
  dateFrom?: string
  dateTo?: string
  customerId?: string
  productId?: string
  reason?: ReturnReason
  minAmount?: number
  maxAmount?: number
}
