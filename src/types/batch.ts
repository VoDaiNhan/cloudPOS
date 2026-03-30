// Batch/Lot Management Types

export type BatchStatus = 'active' | 'near_expiry' | 'expired' | 'recalled' | 'damaged' | 'returned'

export interface Batch {
  id: string
  batchNumber: string // Số lô (do nhà sản cấp cấp hoặc tự tạo)
  productId: string
  productName: string
  
  // Import information
  importDate: string // Ngày nhập kho
  importOrderId?: string // ID phiếu nhập
  supplierId?: string
  supplierName?: string
  
  // Expiry information
  manufacturingDate?: string // Ngày sản xuất
  expiryDate: string // Hạn sử dụng (bắt buộc)
  shelfLifeDays?: number // Số ngày hạn sử dụng
  
  // Quantity tracking
  initialQuantity: number // Số lượng nhập ban đầu
  currentQuantity: number // Số lượng hiện tại
  reservedQuantity: number // Số lượng đã đặt (chưa xuất)
  availableQuantity: number // Số lượng có thể bán = current - reserved
  
  // Pricing (giá nhập của lô này)
  importPrice: number
  unitId: string
  unitName: string
  
  // Status
  status: BatchStatus
  isBlocked: boolean // Chặn không cho bán (hết hạn, lỗi, thu hồi)
  blockReason?: string
  
  // GS1 Barcode information (nếu có)
  gtin?: string // Global Trade Item Number
  gs1Barcode?: string // Mã vạch GS1-128 đầy đủ
  
  // Metadata
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export interface BatchTransaction {
  id: string
  batchId: string
  batchNumber: string
  productId: string
  productName: string
  
  // Transaction info
  type: 'import' | 'sale' | 'return' | 'adjustment' | 'transfer' | 'damage' | 'expiry_writeoff'
  quantity: number // Số lượng (+ nhập, - xuất)
  
  // Related documents
  orderId?: string // ID đơn hàng (nếu là bán)
  invoiceId?: string // ID hóa đơn
  importOrderId?: string // ID phiếu nhập
  returnOrderId?: string // ID phiếu trả hàng
  
  // Before/After quantities
  quantityBefore: number
  quantityAfter: number
  
  // Metadata
  reason?: string
  notes?: string
  transactionDate: string
  createdBy?: string
}

export interface BatchAllocation {
  batchId: string
  batchNumber: string
  expiryDate: string
  quantity: number
  availableQuantity: number
  daysUntilExpiry: number
  priority: number // Thứ tự ưu tiên (FEFO)
}

export interface BatchPickingStrategy {
  type: 'FEFO' | 'FIFO' | 'MANUAL'
  description: string
}

// FEFO: First-Expired-First-Out (ưu tiên hết hạn sớm nhất)
// FIFO: First-In-First-Out (ưu tiên nhập trước)
// MANUAL: Chọn thủ công

export interface ExpiryAlert {
  id: string
  batchId: string
  batchNumber: string
  productId: string
  productName: string
  expiryDate: string
  daysUntilExpiry: number
  currentQuantity: number
  alertLevel: 'warning' | 'critical' | 'expired'
  suggestedAction: string
  createdAt: string
}

export interface BatchScanResult {
  success: boolean
  batch?: Batch
  product?: {
    id: string
    name: string
  }
  error?: string
  warnings?: string[]
  // Parsed from GS1 barcode
  parsedData?: {
    gtin?: string
    batchNumber?: string
    expiryDate?: string
    serialNumber?: string
  }
}

// Return/Damage Management
export interface ReturnOrder {
  id: string
  returnNumber: string
  type: 'customer_return' | 'supplier_return' | 'damage' | 'expiry'
  
  // Related order
  originalOrderId?: string
  originalInvoiceId?: string
  
  // Items
  items: ReturnOrderItem[]
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  destinationWarehouse: 'main' | 'damaged' | 'expired' | 'return_to_supplier'
  
  // Financial impact
  totalAmount: number
  refundAmount: number
  restockFee?: number
  
  // Metadata
  reason: string
  notes?: string
  returnDate: string
  approvedBy?: string
  approvedAt?: string
  createdBy: string
  createdAt: string
}

export interface ReturnOrderItem {
  id: string
  productId: string
  productName: string
  batchId?: string // Nếu biết lô cụ thể
  batchNumber?: string
  quantity: number
  unitPrice: number
  totalAmount: number
  condition: 'good' | 'damaged' | 'expired' | 'defective'
  action: 'restock' | 'dispose' | 'return_to_supplier' | 'repair'
  notes?: string
}

// Warehouse types for segregation
export type WarehouseType = 'main' | 'damaged' | 'expired' | 'quarantine' | 'return'

export interface WarehouseLocation {
  id: string
  name: string
  type: WarehouseType
  description: string
  isActive: boolean
}

// GS1 Barcode parsing
export interface GS1ApplicationIdentifier {
  ai: string // Application Identifier (01, 10, 17, etc.)
  name: string
  format: string
  value: string
}

export interface GS1BarcodeData {
  raw: string
  identifiers: GS1ApplicationIdentifier[]
  gtin?: string // AI 01
  batchNumber?: string // AI 10
  expiryDate?: string // AI 17
  serialNumber?: string // AI 21
  productionDate?: string // AI 11
}
