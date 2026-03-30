# Hệ thống Quản lý Lô hàng & Hạn sử dụng

## Tổng quan

Hệ thống quản lý lô hàng (Batch Management) giải quyết bài toán quan trọng trong quản lý kho: **Làm sao biết sản phẩm bán ra thuộc lô nào?**

Đây là vấn đề cực kỳ quan trọng với các mặt hàng có hạn sử dụng như:
- Thuốc
- Sữa
- Thực phẩm
- Tạp hóa

## Vấn đề cần giải quyết

### 1. Truy xuất nguồn gốc
- Khi bán 1 sản phẩm, hệ thống phải biết nó thuộc lô nhập nào
- Không thể chỉ trừ tuần tự trên data vì thực tế hàng trên kệ không theo thứ tự nhập

### 2. Kiểm soát hạn sử dụng
- Tránh bán nhầm hàng hết hạn
- Ưu tiên bán hàng sắp hết hạn trước (FEFO)
- Cảnh báo hàng gần hết hạn

### 3. Xử lý hàng trả/hủy
- Không được sửa trực tiếp dữ liệu gốc
- Phải tạo giao dịch ngược lại (reverse transaction)
- Hàng hỏng/hết hạn phải vào kho riêng, không nhập lại kho chính

## Kiến trúc hệ thống

### 1. Cấu trúc dữ liệu

#### Batch (Lô hàng)
```typescript
interface Batch {
  id: string
  batchNumber: string          // Số lô
  productId: string
  
  // Thông tin nhập kho
  importDate: string           // Ngày nhập
  importOrderId?: string
  supplierId?: string
  
  // Thông tin hạn sử dụng
  manufacturingDate?: string   // Ngày sản xuất
  expiryDate: string          // Hạn sử dụng (bắt buộc)
  
  // Theo dõi số lượng
  initialQuantity: number      // Số lượng nhập ban đầu
  currentQuantity: number      // Số lượng hiện tại
  reservedQuantity: number     // Số lượng đã đặt
  availableQuantity: number    // Có thể bán = current - reserved
  
  // Giá nhập của lô này
  importPrice: number
  
  // Trạng thái
  status: 'active' | 'near_expiry' | 'expired' | 'recalled' | 'damaged' | 'returned'
  isBlocked: boolean          // Chặn không cho bán
  
  // Mã vạch GS1 (nếu có)
  gtin?: string               // Global Trade Item Number
  gs1Barcode?: string         // Mã vạch GS1-128 đầy đủ
}
```

#### BatchTransaction (Giao dịch lô)
```typescript
interface BatchTransaction {
  id: string
  batchId: string
  type: 'import' | 'sale' | 'return' | 'adjustment' | 'transfer' | 'damage' | 'expiry_writeoff'
  quantity: number            // + nhập, - xuất
  
  // Số lượng trước/sau
  quantityBefore: number
  quantityAfter: number
  
  // Liên kết đơn hàng
  orderId?: string
  returnOrderId?: string
  
  transactionDate: string
}
```

#### ReturnOrder (Phiếu trả hàng)
```typescript
interface ReturnOrder {
  id: string
  returnNumber: string
  type: 'customer_return' | 'supplier_return' | 'damage' | 'expiry'
  
  items: ReturnOrderItem[]
  
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  destinationWarehouse: 'main' | 'damaged' | 'expired' | 'return_to_supplier'
  
  totalAmount: number
  refundAmount: number
  
  reason: string
  returnDate: string
}
```

### 2. Chiến lược phân bổ lô (Batch Allocation)

#### FEFO (First-Expired-First-Out) - Khuyến nghị
- Ưu tiên lô hết hạn sớm nhất
- Phù hợp với hàng có hạn sử dụng
- Giảm thiểu tổn thất do hết hạn

#### FIFO (First-In-First-Out)
- Ưu tiên lô nhập trước
- Phù hợp với hàng không có hạn hoặc hạn dài

#### MANUAL (Thủ công)
- Nhân viên tự chọn lô
- Linh hoạt nhưng dễ sai sót

### 3. Hệ thống kho phân loại

#### Kho chính (Main Warehouse)
- Hàng bán bình thường
- Chất lượng tốt, còn hạn

#### Kho hàng hỏng (Damaged Warehouse)
- Hàng bị hỏng trong quá trình vận chuyển/bảo quản
- Chờ trả nhà cung cấp hoặc xử lý

#### Kho hàng hết hạn (Expired Warehouse)
- Hàng đã hết hạn sử dụng
- Chờ hủy theo quy định

#### Kho cách ly (Quarantine Warehouse)
- Hàng chờ kiểm tra chất lượng
- Chưa được phép bán

#### Kho hàng trả (Return Warehouse)
- Hàng khách trả lại
- Chờ kiểm tra và quyết định xử lý

## Quy trình hoạt động

### 1. Nhập hàng
```
1. Quét mã vạch GS1 hoặc nhập thông tin lô
2. Hệ thống tự động parse: GTIN, số lô, hạn sử dụng
3. Tạo Batch mới với thông tin đầy đủ
4. Tạo BatchTransaction type='import'
5. Cập nhật tồn kho
```

### 2. Bán hàng
```
1. Nhân viên chọn sản phẩm cần bán
2. Hệ thống hiển thị BatchSelector
3. Tự động phân bổ theo FEFO (hoặc FIFO/MANUAL)
4. Nhân viên xác nhận lô được chọn
5. Tạo BatchTransaction type='sale' cho từng lô
6. Trừ availableQuantity của các lô tương ứng
7. Lưu thông tin lô vào OrderItem
```

### 3. Trả hàng / Hủy hàng
```
1. Tạo ReturnOrder với type phù hợp
2. Chọn destinationWarehouse (damaged/expired/return)
3. Tạo BatchTransaction type='return' (số lượng âm)
4. KHÔNG sửa dữ liệu gốc của Batch
5. Tạo Batch mới ở kho đích (nếu cần)
6. Cập nhật doanh thu (trừ đi nếu là customer_return)
```

### 4. Cảnh báo hết hạn
```
1. Hệ thống tự động quét các Batch
2. Tính số ngày còn lại đến hạn sử dụng
3. Phân loại:
   - Expired: < 0 ngày (đã hết hạn)
   - Critical: 0-7 ngày
   - Warning: 8-30 ngày
4. Hiển thị cảnh báo trên dashboard
5. Gợi ý khuyến mãi/xử lý
```

## Mã vạch GS1-128

### Cấu trúc
```
(01)GTIN(10)BatchNumber(17)ExpiryDate(21)SerialNumber
```

### Application Identifiers (AI)
- `01`: GTIN (14 số) - Mã sản phẩm toàn cầu
- `10`: Batch/Lot Number - Số lô
- `17`: Expiry Date (YYMMDD) - Hạn sử dụng
- `21`: Serial Number - Số serial
- `11`: Production Date (YYMMDD) - Ngày sản xuất

### Ví dụ
```
(01)08934567890123(10)CC2024030001(17)240930
```
Nghĩa là:
- GTIN: 08934567890123
- Số lô: CC2024030001
- Hạn sử dụng: 30/09/2024

## Components

### 1. BatchScanner
Quét mã vạch GS1 hoặc nhập số lô thủ công

**Props:**
- `onScanSuccess`: Callback khi quét thành công
- `onScanError`: Callback khi có lỗi

**Features:**
- Parse mã vạch GS1-128
- Hỗ trợ nhập thủ công
- Hiển thị thông tin đã parse

### 2. BatchSelector
Chọn lô hàng khi bán

**Props:**
- `productId`: ID sản phẩm
- `batches`: Danh sách lô có sẵn
- `requestedQuantity`: Số lượng cần xuất
- `strategy`: 'FEFO' | 'FIFO' | 'MANUAL'
- `onSelect`: Callback khi chọn xong

**Features:**
- Tự động phân bổ theo chiến lược
- Hiển thị thông tin hạn sử dụng
- Cảnh báo lô gần hết hạn
- Kiểm tra đủ số lượng

### 3. ReturnOrderManager
Tạo phiếu trả hàng / hủy hàng

**Props:**
- `onSubmit`: Callback khi tạo phiếu
- `onCancel`: Callback khi hủy

**Features:**
- 4 loại phiếu: customer_return, supplier_return, damage, expiry
- Quản lý nhiều sản phẩm
- Tự động tính tổng tiền
- Chọn kho đích

## Utilities

### 1. gs1Parser.ts
Parse và validate mã vạch GS1

**Functions:**
- `parseGS1Barcode()`: Parse mã vạch
- `parseGS1Date()`: Chuyển YYMMDD sang ISO date
- `generateGS1Barcode()`: Tạo mã vạch từ data
- `validateGS1Barcode()`: Kiểm tra tính hợp lệ

### 2. batchAllocator.ts
Phân bổ lô hàng theo chiến lược

**Functions:**
- `allocateBatchesFEFO()`: Phân bổ theo FEFO
- `allocateBatchesFIFO()`: Phân bổ theo FIFO
- `calculateDaysUntilExpiry()`: Tính ngày còn lại
- `getNearExpiryBatches()`: Lấy lô gần hết hạn
- `getExpiredBatches()`: Lấy lô đã hết hạn

## Nguyên tắc quan trọng

### ✅ DO (Nên làm)
1. Luôn sử dụng FEFO cho hàng có hạn sử dụng
2. Tạo BatchTransaction cho mọi thay đổi số lượng
3. Phân kho riêng biệt cho từng loại hàng
4. Cảnh báo sớm hàng gần hết hạn
5. Lưu thông tin lô vào OrderItem khi bán

### ❌ DON'T (Không nên làm)
1. Không sửa trực tiếp dữ liệu Batch khi trả hàng
2. Không nhập hàng hỏng/hết hạn vào kho chính
3. Không bỏ qua kiểm tra hạn sử dụng
4. Không để nhân viên tự chọn lô nếu không cần thiết
5. Không trừ số lượng tuần tự mà không biết lô cụ thể

## Demo

Truy cập `/demo/batch-management` để xem demo đầy đủ:
- Quét mã vạch GS1
- Phân bổ lô hàng FEFO/FIFO
- Tạo phiếu trả hàng
- Xem hệ thống kho phân loại

## Tích hợp vào POS

### Khi bán hàng
```typescript
// 1. Thêm sản phẩm vào giỏ
const addToCart = (product: Product, quantity: number) => {
  // Hiển thị BatchSelector
  showBatchSelector(product.id, quantity)
}

// 2. Nhận kết quả từ BatchSelector
const handleBatchSelect = (allocations: BatchAllocation[]) => {
  // Lưu thông tin lô vào cart item
  const cartItem = {
    productId: product.id,
    quantity: totalQuantity,
    batches: allocations.map(a => ({
      batchId: a.batchId,
      batchNumber: a.batchNumber,
      quantity: a.quantity,
      expiryDate: a.expiryDate
    }))
  }
  
  addItemToCart(cartItem)
}

// 3. Khi thanh toán
const checkout = async () => {
  // Tạo BatchTransaction cho từng lô
  for (const item of cartItems) {
    for (const batch of item.batches) {
      await createBatchTransaction({
        batchId: batch.batchId,
        type: 'sale',
        quantity: -batch.quantity,
        orderId: order.id
      })
    }
  }
}
```

## Báo cáo & Thống kê

### 1. Báo cáo tồn kho theo lô
- Tổng số lô đang hoạt động
- Giá trị tồn kho theo lô
- Lô gần hết hạn
- Lô đã hết hạn

### 2. Báo cáo xuất nhập tồn theo lô
- Lịch sử giao dịch của từng lô
- Số lượng nhập/xuất/tồn
- Truy xuất nguồn gốc

### 3. Báo cáo tổn thất
- Giá trị hàng hết hạn
- Giá trị hàng hỏng
- Tỷ lệ tổn thất

## Kết luận

Hệ thống quản lý lô hàng giải quyết triệt để bài toán:
- ✅ Biết chính xác sản phẩm bán ra thuộc lô nào
- ✅ Kiểm soát hạn sử dụng hiệu quả
- ✅ Xử lý trả hàng/hủy hàng đúng quy trình
- ✅ Phân kho khoa học
- ✅ Truy xuất nguồn gốc đầy đủ

Đây là nền tảng quan trọng cho hệ thống POS chuyên nghiệp, đặc biệt với các ngành hàng có hạn sử dụng.
