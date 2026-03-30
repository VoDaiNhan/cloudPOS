import type {
  ReturnOrder,
  ReturnPolicy,
  ReturnReason,
  ReturnCondition,
  ReturnWarehouse,
} from '../types/returnExchange'
import type { ProductCategory } from '../types/foodReturnPolicy'

// Chính sách đổi trả mặc định
export const defaultReturnPolicy: ReturnPolicy = {
  id: 'policy-default',
  name: 'Chính sách đổi trả chuẩn',
  returnDays: 7,
  exchangeDays: 15,
  requireReceipt: true,
  allowPromotionItems: false,
  refundShippingFee: false,
  deductPoints: true,
  restockingFee: 0,
  inspectionFee: 0,
  requireApprovalAmount: 1000000,
  requireApprovalReasons: ['no_need', 'customer_request'],
  isActive: true,
}

// Lý do trả hàng
export const returnReasons: Array<{ value: ReturnReason; label: string; icon: string }> = [
  { value: 'technical_defect', label: 'Lỗi kỹ thuật', icon: 'build_circle' },
  { value: 'wrong_item', label: 'Giao sai hàng', icon: 'error' },
  { value: 'change_size_color', label: 'Đổi size/màu', icon: 'palette' },
  { value: 'no_need', label: 'Không còn nhu cầu', icon: 'cancel' },
  { value: 'shipping_damage', label: 'Hỏng do vận chuyển', icon: 'local_shipping' },
  { value: 'expired', label: 'Hết hạn', icon: 'event_busy' },
  { value: 'customer_request', label: 'Yêu cầu khách hàng', icon: 'person' },
  { value: 'other', label: 'Khác', icon: 'more_horiz' },
]

// Tình trạng hàng
export const returnConditions: Array<{
  value: ReturnCondition
  label: string
  description: string
  warehouse: ReturnWarehouse
  color: string
}> = [
  {
    value: 'good',
    label: 'Còn tốt',
    description: 'Hàng nguyên vẹn, có thể bán lại',
    warehouse: 'main',
    color: 'emerald',
  },
  {
    value: 'defective',
    label: 'Hàng lỗi',
    description: 'Không thể bán lại, chờ xử lý',
    warehouse: 'defective',
    color: 'rose',
  },
  {
    value: 'opened',
    label: 'Đã mở hộp',
    description: 'Có thể bán giảm giá',
    warehouse: 'clearance',
    color: 'amber',
  },
  {
    value: 'need_check',
    label: 'Cần kiểm tra',
    description: 'Chưa xác định được tình trạng',
    warehouse: 'quarantine',
    color: 'blue',
  },
]

// Đơn hàng F&B mẫu để test (có thực phẩm)
export const sampleOrders = [
  {
    id: 'order-fnb-001',
    orderNumber: 'HD-2024-001',
    orderDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
    servedDate: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 phút trước
    customerId: 'cust-001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    total: 157000,
    items: [
      {
        id: 'item-001',
        productId: 'pos1',
        productName: 'Cà phê Muối',
        productImage: '/images/pos/coffee.png',
        category: 'beverage' as ProductCategory,
        quantity: 2,
        price: 25000,
        discount: 0,
        total: 50000,
        barcode: '8934567890123',
        expiryDate: undefined, // Đồ uống pha chế không có hạn
        servedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: 'item-002',
        productId: 'pos2',
        productName: 'Trà Đào Cam Sả',
        productImage: '/images/pos/peach_tea.png',
        category: 'beverage' as ProductCategory,
        quantity: 1,
        price: 45000,
        discount: 0,
        total: 45000,
        barcode: '8934567890124',
        expiryDate: undefined,
        servedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: 'item-003',
        productId: 'pos11',
        productName: 'Sandwich Gà',
        productImage: '/images/pos/sandwich.png',
        category: 'food' as ProductCategory,
        quantity: 1,
        price: 45000,
        discount: 0,
        total: 45000,
        barcode: '8934567890125',
        expiryDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // Còn 6 giờ
        servedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: 'item-004',
        productId: 'pos10',
        productName: 'Nước Ngọt Soda Việt Quất 330ml',
        productImage: '/images/pos/blueberry_soda.png',
        category: 'packaged' as ProductCategory,
        quantity: 1,
        price: 12000,
        discount: 0,
        total: 12000,
        barcode: '8934567890126',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Còn 30 ngày
        servedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'order-fnb-002',
    orderNumber: 'HD-2024-002',
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
    servedDate: new Date(Date.now() - 115 * 60 * 1000).toISOString(), // 115 phút trước
    customerId: 'cust-002',
    customerName: 'Trần Thị B',
    customerPhone: '0912345678',
    total: 138000,
    items: [
      {
        id: 'item-005',
        productId: 'pos3',
        productName: 'Bánh Mì Bơ Tỏi',
        productImage: '/images/pos/bread.png',
        category: 'perishable' as ProductCategory,
        quantity: 2,
        price: 35000,
        discount: 0,
        total: 70000,
        barcode: '8934567890127',
        expiryDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // Còn 4 giờ
        servedAt: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
      },
      {
        id: 'item-006',
        productId: 'pos8',
        productName: 'Cà Phê Sữa Đá',
        productImage: '/images/pos/iced_coffee.png',
        category: 'beverage' as ProductCategory,
        quantity: 2,
        price: 22000,
        discount: 0,
        total: 44000,
        barcode: '8934567890128',
        expiryDate: undefined,
        servedAt: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
      },
      {
        id: 'item-007',
        productId: 'pos13',
        productName: 'Bánh Flan',
        productImage: '/images/pos/flan.png',
        category: 'perishable' as ProductCategory,
        quantity: 2,
        price: 18000,
        discount: 0,
        total: 36000,
        barcode: '8934567890129',
        expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // Còn 12 giờ
        servedAt: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'order-fnb-003',
    orderNumber: 'HD-2024-003',
    orderDate: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 phút trước
    servedDate: null, // Chưa phục vụ
    customerId: 'cust-003',
    customerName: 'Lê Văn C',
    customerPhone: '0923456789',
    total: 120000,
    items: [
      {
        id: 'item-008',
        productId: 'pos15',
        productName: 'Combo Sáng Năng Động',
        productImage: '/images/pos/combo_morning.png',
        category: 'food' as ProductCategory,
        quantity: 1,
        price: 55000,
        discount: 0,
        total: 55000,
        barcode: '8934567890130',
        expiryDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        servedAt: null,
      },
      {
        id: 'item-009',
        productId: 'pos16',
        productName: 'Combo Trà Chiều',
        productImage: '/images/pos/combo_afternoon.png',
        category: 'food' as ProductCategory,
        quantity: 1,
        price: 65000,
        discount: 0,
        total: 65000,
        barcode: '8934567890131',
        expiryDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        servedAt: null,
      },
    ],
  },
  {
    id: 'order-general-001',
    orderNumber: 'HD-2024-004',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày trước
    servedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customerId: 'cust-004',
    customerName: 'Phạm Thị D',
    customerPhone: '0934567890',
    total: 1500000,
    items: [
      {
        id: 'item-010',
        productId: 'prod-001',
        productName: 'Áo thun Nike',
        productImage: '/images/shirt.png',
        category: 'general' as ProductCategory,
        quantity: 2,
        price: 350000,
        discount: 0,
        total: 700000,
        barcode: '8934567890132',
        expiryDate: undefined,
        servedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'item-011',
        productId: 'prod-002',
        productName: 'Quần Jean Levi\'s',
        productImage: '/images/jeans.png',
        category: 'general' as ProductCategory,
        quantity: 1,
        price: 800000,
        discount: 0,
        total: 800000,
        barcode: '8934567890133',
        expiryDate: undefined,
        servedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'order-mixed-001',
    orderNumber: 'HD-2024-005',
    orderDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 phút trước
    servedDate: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    customerId: 'cust-005',
    customerName: 'Hoàng Văn E',
    customerPhone: '0945678901',
    total: 485000,
    items: [
      {
        id: 'item-012',
        productId: 'pos1',
        productName: 'Cà phê Muối',
        productImage: '/images/pos/coffee.png',
        category: 'beverage' as ProductCategory,
        quantity: 1,
        price: 25000,
        discount: 0,
        total: 25000,
        barcode: '8934567890134',
        expiryDate: undefined,
        servedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      },
      {
        id: 'item-013',
        productId: 'prod-003',
        productName: 'Tai nghe Bluetooth',
        productImage: '/images/headphone.png',
        category: 'general' as ProductCategory,
        quantity: 1,
        price: 450000,
        discount: 0,
        total: 450000,
        barcode: '8934567890135',
        expiryDate: undefined,
        servedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      },
      {
        id: 'item-014',
        productId: 'pos6',
        productName: 'Bánh Quy Bơ',
        productImage: '/images/pos/cookies.png',
        category: 'packaged' as ProductCategory,
        quantity: 2,
        price: 15000,
        discount: 0,
        total: 30000,
        barcode: '8934567890136',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // Còn 60 ngày
        servedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      },
    ],
  },
]

// Phiếu trả hàng mẫu
export const sampleReturnOrders: ReturnOrder[] = [
  {
    id: 'return-001',
    returnNumber: 'RT-2024-001',
    type: 'return',
    originalOrderId: 'order-fnb-001',
    originalOrderNumber: 'HD-2024-001',
    originalOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    originalOrderTotal: 157000,
    customerId: 'cust-001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    items: [
      {
        id: 'ret-item-001',
        originalOrderItemId: 'item-001',
        productId: 'pos1',
        productName: 'Cà phê Muối',
        originalQuantity: 2,
        originalPrice: 25000,
        originalDiscount: 0,
        returnQuantity: 1,
        returnPrice: 25000,
        returnAmount: 25000,
        condition: 'defective',
        warehouse: 'defective',
        reason: 'technical_defect',
        reasonNote: 'Cà phê bị nguội, không đúng nhiệt độ',
      },
    ],
    subtotal: 25000,
    refundAmount: 25000,
    additionalCharge: 0,
    netAmount: -25000,
    refundMethod: 'cash',
    status: 'completed',
    requiresApproval: true,
    returnDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'staff-001',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Helper functions
export const getReturnReasonLabel = (reason: ReturnReason): string => {
  return returnReasons.find((r) => r.value === reason)?.label || reason
}

export const getReturnConditionInfo = (condition: ReturnCondition) => {
  return returnConditions.find((c) => c.value === condition)
}

export const calculateReturnDaysLeft = (orderDate: string, policyDays: number): number => {
  const order = new Date(orderDate)
  const today = new Date()
  const diffTime = today.getTime() - order.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, policyDays - diffDays)
}

export const canReturn = (orderDate: string, policyDays: number): boolean => {
  return calculateReturnDaysLeft(orderDate, policyDays) > 0
}
