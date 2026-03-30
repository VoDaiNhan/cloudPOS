import type { Batch, ReturnOrder, WarehouseLocation, BatchPickingStrategy } from '../types/batch'

// Warehouse locations for segregation
export const warehouseLocations: WarehouseLocation[] = [
  {
    id: 'wh-main',
    name: 'Kho chính',
    type: 'main',
    description: 'Kho hàng bán chính',
    isActive: true,
  },
  {
    id: 'wh-damaged',
    name: 'Kho hàng hỏng',
    type: 'damaged',
    description: 'Kho lưu trữ hàng bị hỏng, chờ xử lý',
    isActive: true,
  },
  {
    id: 'wh-expired',
    name: 'Kho hàng hết hạn',
    type: 'expired',
    description: 'Kho lưu trữ hàng hết hạn, chờ hủy',
    isActive: true,
  },
  {
    id: 'wh-quarantine',
    name: 'Kho cách ly',
    type: 'quarantine',
    description: 'Kho tạm giữ hàng chờ kiểm tra chất lượng',
    isActive: true,
  },
  {
    id: 'wh-return',
    name: 'Kho hàng trả',
    type: 'return',
    description: 'Kho hàng khách trả lại',
    isActive: true,
  },
]

// Picking strategies
export const pickingStrategies: BatchPickingStrategy[] = [
  {
    type: 'FEFO',
    description: 'First-Expired-First-Out: Ưu tiên lô hết hạn sớm nhất (khuyến nghị cho hàng có hạn sử dụng)',
  },
  {
    type: 'FIFO',
    description: 'First-In-First-Out: Ưu tiên lô nhập trước',
  },
  {
    type: 'MANUAL',
    description: 'Chọn thủ công: Nhân viên tự chọn lô',
  },
]

// Sample batches
export const batches: Batch[] = [
  // Coca Cola - Multiple batches
  {
    id: 'batch-coca-1',
    batchNumber: 'CC2024030001',
    productId: 'prod-coca',
    productName: 'Coca Cola',
    importDate: '2024-03-01',
    importOrderId: 'IMP-2024-001',
    supplierId: 'sup-001',
    supplierName: 'Nhà phân phối Coca Cola VN',
    manufacturingDate: '2024-02-15',
    expiryDate: '2024-09-30', // Hết hạn sau 7 tháng
    shelfLifeDays: 210,
    initialQuantity: 500,
    currentQuantity: 320,
    reservedQuantity: 20,
    availableQuantity: 300,
    importPrice: 8000,
    unitId: 'unit-4',
    unitName: 'Lon',
    status: 'active',
    isBlocked: false,
    gtin: '08934567890123',
    gs1Barcode: '(01)08934567890123(10)CC2024030001(17)240930',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'batch-coca-2',
    batchNumber: 'CC2024031501',
    productId: 'prod-coca',
    productName: 'Coca Cola',
    importDate: '2024-03-15',
    importOrderId: 'IMP-2024-005',
    supplierId: 'sup-001',
    supplierName: 'Nhà phân phối Coca Cola VN',
    manufacturingDate: '2024-03-01',
    expiryDate: '2024-08-15', // Hết hạn sớm hơn lô trước!
    shelfLifeDays: 180,
    initialQuantity: 600,
    currentQuantity: 580,
    reservedQuantity: 0,
    availableQuantity: 580,
    importPrice: 7800,
    unitId: 'unit-4',
    unitName: 'Lon',
    status: 'near_expiry',
    isBlocked: false,
    gtin: '08934567890123',
    gs1Barcode: '(01)08934567890123(10)CC2024031501(17)240815',
    notes: 'Lô này hết hạn sớm hơn, cần ưu tiên bán',
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T09:00:00Z',
  },
  
  // Sữa - Near expiry
  {
    id: 'batch-milk-1',
    batchNumber: 'MILK2024020501',
    productId: 'prod-milk',
    productName: 'Sữa tươi Vinamilk',
    importDate: '2024-02-05',
    importOrderId: 'IMP-2024-002',
    supplierId: 'sup-002',
    supplierName: 'Vinamilk',
    manufacturingDate: '2024-02-01',
    expiryDate: '2024-04-15', // Sắp hết hạn
    shelfLifeDays: 60,
    initialQuantity: 200,
    currentQuantity: 85,
    reservedQuantity: 5,
    availableQuantity: 80,
    importPrice: 25000,
    unitId: 'unit-5',
    unitName: 'Hộp',
    status: 'near_expiry',
    isBlocked: false,
    gtin: '08934567890456',
    gs1Barcode: '(01)08934567890456(10)MILK2024020501(17)240415',
    notes: 'Cần khuyến mãi để bán hết trước hạn',
    createdAt: '2024-02-05T08:00:00Z',
    updatedAt: '2024-03-20T14:00:00Z',
  },
  
  // Thuốc - Expired (blocked)
  {
    id: 'batch-medicine-1',
    batchNumber: 'MED2023120101',
    productId: 'prod-medicine',
    productName: 'Paracetamol 500mg',
    importDate: '2023-12-01',
    importOrderId: 'IMP-2023-050',
    supplierId: 'sup-003',
    supplierName: 'Công ty Dược phẩm ABC',
    manufacturingDate: '2023-11-15',
    expiryDate: '2024-03-01', // Đã hết hạn
    shelfLifeDays: 90,
    initialQuantity: 100,
    currentQuantity: 25,
    reservedQuantity: 0,
    availableQuantity: 0,
    importPrice: 15000,
    unitId: 'unit-14',
    unitName: 'Hộp',
    status: 'expired',
    isBlocked: true,
    blockReason: 'Hết hạn sử dụng - Chờ hủy',
    gtin: '08934567890789',
    gs1Barcode: '(01)08934567890789(10)MED2023120101(17)240301',
    notes: 'Đã chuyển sang kho hàng hết hạn',
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-03-02T10:00:00Z',
  },
  
  // Gạo - Good stock
  {
    id: 'batch-rice-1',
    batchNumber: 'RICE2024030101',
    productId: 'prod-rice',
    productName: 'Gạo ST25',
    importDate: '2024-03-01',
    importOrderId: 'IMP-2024-003',
    supplierId: 'sup-004',
    supplierName: 'Công ty Lương thực XYZ',
    manufacturingDate: '2024-02-20',
    expiryDate: '2025-03-01', // Hạn dài
    shelfLifeDays: 365,
    initialQuantity: 1000,
    currentQuantity: 750,
    reservedQuantity: 50,
    availableQuantity: 700,
    importPrice: 25000,
    unitId: 'unit-9',
    unitName: 'Kg',
    status: 'active',
    isBlocked: false,
    gtin: '08934567891234',
    gs1Barcode: '(01)08934567891234(10)RICE2024030101(17)250301',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-15T16:00:00Z',
  },
  
  // Snack - Damaged batch
  {
    id: 'batch-snack-1',
    batchNumber: 'SNACK2024031001',
    productId: 'prod-snack',
    productName: 'Snack Oishi',
    importDate: '2024-03-10',
    importOrderId: 'IMP-2024-004',
    supplierId: 'sup-005',
    supplierName: 'Oishi Vietnam',
    manufacturingDate: '2024-03-05',
    expiryDate: '2024-09-05',
    shelfLifeDays: 180,
    initialQuantity: 500,
    currentQuantity: 50,
    reservedQuantity: 0,
    availableQuantity: 0,
    importPrice: 3000,
    unitId: 'unit-13',
    unitName: 'Gói',
    status: 'damaged',
    isBlocked: true,
    blockReason: 'Bao bì bị rách trong quá trình vận chuyển',
    gtin: '08934567892345',
    gs1Barcode: '(01)08934567892345(10)SNACK2024031001(17)240905',
    notes: 'Đã chuyển sang kho hàng hỏng, chờ trả nhà cung cấp',
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-11T09:00:00Z',
  },
]

// Sample return orders
export const returnOrders: ReturnOrder[] = [
  {
    id: 'return-001',
    returnNumber: 'RET-2024-001',
    type: 'customer_return',
    originalOrderId: 'ORD-2024-100',
    originalInvoiceId: 'INV-2024-100',
    items: [
      {
        id: 'ret-item-001',
        productId: 'prod-milk',
        productName: 'Sữa tươi Vinamilk',
        batchId: 'batch-milk-1',
        batchNumber: 'MILK2024020501',
        quantity: 5,
        unitPrice: 30000,
        totalAmount: 150000,
        condition: 'good',
        action: 'restock',
        notes: 'Khách mua nhầm, hàng còn nguyên vẹn',
      },
    ],
    status: 'completed',
    destinationWarehouse: 'main',
    totalAmount: 150000,
    refundAmount: 150000,
    reason: 'Khách hàng mua nhầm sản phẩm',
    returnDate: '2024-03-20',
    approvedBy: 'admin',
    approvedAt: '2024-03-20T10:00:00Z',
    createdBy: 'cashier-01',
    createdAt: '2024-03-20T09:30:00Z',
  },
  {
    id: 'return-002',
    returnNumber: 'RET-2024-002',
    type: 'damage',
    items: [
      {
        id: 'ret-item-002',
        productId: 'prod-snack',
        productName: 'Snack Oishi',
        batchId: 'batch-snack-1',
        batchNumber: 'SNACK2024031001',
        quantity: 50,
        unitPrice: 3000,
        totalAmount: 150000,
        condition: 'damaged',
        action: 'return_to_supplier',
        notes: 'Bao bì rách do vận chuyển',
      },
    ],
    status: 'pending',
    destinationWarehouse: 'damaged',
    totalAmount: 150000,
    refundAmount: 0,
    reason: 'Hàng bị hỏng trong quá trình vận chuyển',
    returnDate: '2024-03-11',
    createdBy: 'warehouse-01',
    createdAt: '2024-03-11T09:00:00Z',
  },
  {
    id: 'return-003',
    returnNumber: 'RET-2024-003',
    type: 'expiry',
    items: [
      {
        id: 'ret-item-003',
        productId: 'prod-medicine',
        productName: 'Paracetamol 500mg',
        batchId: 'batch-medicine-1',
        batchNumber: 'MED2023120101',
        quantity: 25,
        unitPrice: 15000,
        totalAmount: 375000,
        condition: 'expired',
        action: 'dispose',
        notes: 'Hết hạn sử dụng, cần hủy theo quy định',
      },
    ],
    status: 'approved',
    destinationWarehouse: 'expired',
    totalAmount: 375000,
    refundAmount: 0,
    reason: 'Hàng hết hạn sử dụng',
    returnDate: '2024-03-02',
    approvedBy: 'manager',
    approvedAt: '2024-03-02T11:00:00Z',
    createdBy: 'warehouse-01',
    createdAt: '2024-03-02T10:00:00Z',
  },
]

// Helper functions
export const getBatchesByProduct = (productId: string): Batch[] => {
  return batches.filter((batch) => batch.productId === productId)
}

export const getBatchById = (batchId: string): Batch | undefined => {
  return batches.find((batch) => batch.id === batchId)
}

export const getActiveBatches = (): Batch[] => {
  return batches.filter((batch) => batch.status === 'active' && !batch.isBlocked)
}

export const getNearExpiryBatches = (): Batch[] => {
  return batches.filter((batch) => batch.status === 'near_expiry' && !batch.isBlocked)
}

export const getExpiredBatches = (): Batch[] => {
  return batches.filter((batch) => batch.status === 'expired')
}

export const getReturnOrderById = (returnId: string): ReturnOrder | undefined => {
  return returnOrders.find((order) => order.id === returnId)
}
