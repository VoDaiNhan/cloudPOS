// Ví dụ thực tế về xử lý đổi trả hàng ăn uống

import {
  validateFoodReturn,
  checkExpiry,
  processExpiredItems,
  createWasteRecord,
} from '../utils/foodReturnHandler'
import type { ProductCategory } from '../types/foodReturnPolicy'

// ============================================
// CASE 1: Khách trả món ăn vì chất lượng kém
// ============================================
export const case1_QualityIssue = () => {
  console.log('=== CASE 1: Khách trả phở vì nguội ===')
  
  const validation = validateFoodReturn(
    'food', // Loại: đồ ăn
    '2024-03-30T12:00:00Z', // Thời gian đặt
    '2024-03-30T12:15:00Z', // Thời gian giao
    'temperature_issue', // Lý do: nhiệt độ không đúng
    85000, // Giá gốc
    false, // Chưa ăn
    undefined // Không có hạn sử dụng (món tươi)
  )

  console.log('Kết quả:', validation)
  /*
  Kết quả:
  - Cho phép trả: true
  - Hoàn tiền: 100% (85,000đ)
  - Cần phê duyệt: true (quản lý)
  - Xử lý: Tiêu hủy ngay
  - Actions:
    + Chụp ảnh món hàng
    + Yêu cầu quản lý phê duyệt
    + Tiêu hủy món hàng
    + Chụp ảnh tiêu hủy
    + Ghi nhận hao hụt
  */
}

// ============================================
// CASE 2: Khách đổi ý sau khi đã order
// ============================================
export const case2_CustomerChangeMind = () => {
  console.log('=== CASE 2: Khách đổi ý không muốn uống cà phê nữa ===')
  
  const validation = validateFoodReturn(
    'beverage', // Loại: đồ uống
    '2024-03-30T14:00:00Z', // Thời gian đặt
    '2024-03-30T14:05:00Z', // Thời gian giao
    'customer_change_mind', // Lý do: khách đổi ý
    45000, // Giá gốc
    false, // Chưa uống
    undefined
  )

  console.log('Kết quả:', validation)
  /*
  Kết quả:
  - Cho phép trả: true
  - Hoàn tiền: 50% (22,500đ) - vì lỗi từ khách
  - Hoàn bằng: voucher (không hoàn tiền mặt)
  - Cần phê duyệt: false
  - Xử lý: Tiêu hủy
  - Warning: "Khách đổi ý: chỉ hoàn 50% bằng voucher"
  */
}

// ============================================
// CASE 3: Trả món quá thời gian cho phép
// ============================================
export const case3_TooLate = () => {
  console.log('=== CASE 3: Khách trả bánh mì sau 1 giờ ===')
  
  const orderTime = new Date('2024-03-30T08:00:00Z')
  const servedTime = new Date('2024-03-30T08:05:00Z')
  // Giả sử bây giờ là 09:10 (sau 65 phút)
  
  const validation = validateFoodReturn(
    'perishable', // Loại: hàng dễ hỏng
    orderTime.toISOString(),
    servedTime.toISOString(),
    'quality_issue',
    25000,
    false,
    undefined
  )

  console.log('Kết quả:', validation)
  /*
  Kết quả:
  - Cho phép trả: false
  - Lý do: Quá thời gian cho phép (65 phút / 30 phút)
  - Cần phê duyệt đặc biệt từ quản lý
  */
}

// ============================================
// CASE 4: Hàng đóng gói hết hạn
// ============================================
export const case4_ExpiredPackaged = () => {
  console.log('=== CASE 4: Phát hiện nước ngọt hết hạn ===')
  
  const expiryCheck = checkExpiry(
    '2024-03-25T00:00:00Z', // Hết hạn 5 ngày trước
    'packaged'
  )

  console.log('Kiểm tra hạn:', expiryCheck)
  /*
  Kết quả:
  - Đã hết hạn: true
  - Số ngày quá hạn: -5
  - Có thể bán: false
  - Có thể trả NCC: true
  - Hành động: destroy
  */

  // Tạo phiếu hao hụt
  const wasteRecord = createWasteRecord(
    'prod-cola-001',
    'Coca Cola 330ml',
    'packaged',
    24, // 24 lon
    'lon',
    240000, // 10k/lon x 24
    'expired',
    'Hết hạn ngày 25/03/2024',
    'return_supplier', // Trả nhà cung cấp
    'staff-001',
    ['photo1.jpg', 'photo2.jpg'],
    'Phát hiện khi kiểm kho định kỳ'
  )

  console.log('Phiếu hao hụt:', wasteRecord)
}

// ============================================
// CASE 5: Hàng gần hết hạn - giảm giá
// ============================================
export const case5_NearExpiry = () => {
  console.log('=== CASE 5: Bánh mì còn 1 ngày hết hạn ===')
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const expiryCheck = checkExpiry(
    tomorrow.toISOString(),
    'perishable'
  )

  console.log('Kiểm tra hạn:', expiryCheck)
  /*
  Kết quả:
  - Gần hết hạn: true
  - Còn 1 ngày
  - Có thể bán: true
  - Hành động: sell_discount
  - Giảm giá: 30%
  */
}

// ============================================
// CASE 6: Xử lý hàng hết hạn hàng loạt
// ============================================
export const case6_BatchExpiry = () => {
  console.log('=== CASE 6: Kiểm tra hàng hết hạn cuối ngày ===')
  
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const items = [
    {
      id: 'prod-001',
      name: 'Bánh mì thịt',
      category: 'perishable' as ProductCategory,
      expiryDate: yesterday.toISOString(), // Hết hạn hôm qua
      quantity: 5,
      unit: 'cái',
      costPrice: 15000,
    },
    {
      id: 'prod-002',
      name: 'Sữa tươi',
      category: 'perishable' as ProductCategory,
      expiryDate: tomorrow.toISOString(), // Hết hạn ngày mai
      quantity: 10,
      unit: 'hộp',
      costPrice: 12000,
    },
    {
      id: 'prod-003',
      name: 'Snack khoai tây',
      category: 'packaged' as ProductCategory,
      expiryDate: nextWeek.toISOString(), // Hết hạn tuần sau
      quantity: 20,
      unit: 'gói',
      costPrice: 8000,
    },
  ]

  const result = processExpiredItems(items, 'staff-001')

  console.log('Kết quả xử lý:')
  console.log('- Cần tiêu hủy:', result.toDestroy.length, 'mặt hàng')
  console.log('- Cần giảm giá:', result.toDiscount.length, 'mặt hàng')
  console.log('- Trả NCC:', result.toReturnSupplier.length, 'mặt hàng')
  console.log('- Tổng thiệt hại:', result.totalLoss.toLocaleString('vi-VN'), 'đ')
  
  /*
  Kết quả:
  - Bánh mì (hết hạn): Tiêu hủy → Thiệt hại 75,000đ
  - Sữa tươi (còn 1 ngày): Giảm giá 30%
  - Snack (còn 7 ngày): Giảm giá 10%
  */
}

// ============================================
// CASE 7: Món ăn có dị vật
// ============================================
export const case7_ForeignObject = () => {
  console.log('=== CASE 7: Khách phát hiện tóc trong món ăn ===')
  
  const validation = validateFoodReturn(
    'food',
    '2024-03-30T12:00:00Z',
    '2024-03-30T12:10:00Z',
    'foreign_object', // Có dị vật
    120000,
    true, // Đã ăn một phần
    undefined
  )

  console.log('Kết quả:', validation)
  /*
  Kết quả:
  - Cho phép trả: true (vì lỗi chất lượng nghiêm trọng)
  - Hoàn tiền: 100%
  - Cần phê duyệt: true
  - Bắt buộc chụp ảnh bằng chứng
  - Xử lý: Tiêu hủy ngay
  - Ghi nhận: Hao hụt + Chi phí
  - Warning: "Món đã được tiêu thụ một phần"
  */
}

// ============================================
// CASE 8: Hủy món trước khi chế biến
// ============================================
export const case8_CancelBeforeCooking = () => {
  console.log('=== CASE 8: Khách hủy món ngay sau khi order ===')
  
  const validation = validateFoodReturn(
    'food',
    '2024-03-30T12:00:00Z',
    null, // Chưa phục vụ
    'customer_change_mind',
    95000,
    false,
    undefined
  )

  console.log('Kết quả:', validation)
  /*
  Kết quả:
  - Cho phép hủy: true
  - Hoàn tiền: 100%
  - Không cần phê duyệt
  - Actions:
    + Hủy món trong hệ thống
    + Kiểm tra món đã chế biến chưa
    + Nếu đã chế biến: ghi nhận hao hụt
    + Nếu chưa: hủy order bình thường
  */
}

// ============================================
// TỔNG HỢP QUY TRÌNH XỬ LÝ
// ============================================
export const getReturnProcessGuide = (category: ProductCategory) => {
  const guides = {
    food: {
      title: 'Quy trình xử lý đổi trả ĐỒ ĂN',
      steps: [
        '1. Nhận yêu cầu trả từ khách hàng',
        '2. Kiểm tra thời gian (trong vòng 10 phút sau khi giao)',
        '3. Xác định lý do trả hàng',
        '4. CHỤP ẢNH món hàng (bắt buộc)',
        '5. Gọi quản lý phê duyệt',
        '6. Nếu được duyệt: Hoàn tiền 100%',
        '7. Thu hồi món ăn',
        '8. TIÊU HỦY ngay lập tức',
        '9. Chụp ảnh quá trình tiêu hủy',
        '10. Ghi nhận vào sổ hao hụt',
        '11. Cập nhật báo cáo ca',
      ],
      notes: [
        '⚠️ KHÔNG cho nhân viên ăn món khách trả',
        '⚠️ KHÔNG để món trả lẫn với món bán',
        '⚠️ Tiêu hủy trong vòng 5 phút',
      ],
    },
    beverage: {
      title: 'Quy trình xử lý đổi trả ĐỒ UỐNG',
      steps: [
        '1. Nhận yêu cầu trả từ khách hàng',
        '2. Kiểm tra thời gian (trong vòng 5 phút)',
        '3. Xác định lý do',
        '4. Chụp ảnh nếu có vấn đề chất lượng',
        '5. Hoàn tiền hoặc pha lại (tùy trường hợp)',
        '6. Thu hồi đồ uống',
        '7. Đổ bỏ ngay',
        '8. Ghi nhận hao hụt',
      ],
      notes: [
        '💡 Nếu lỗi pha chế: pha lại miễn phí',
        '💡 Nếu khách đổi ý: hoàn 50% voucher',
        '⚠️ Không tái sử dụng nguyên liệu',
      ],
    },
    perishable: {
      title: 'Quy trình xử lý hàng DỄ HỎNG',
      steps: [
        '1. Kiểm tra hạn sử dụng HÀNG NGÀY',
        '2. Hàng còn 2 ngày: Giảm 20%',
        '3. Hàng còn 1 ngày: Giảm 30%',
        '4. Hàng hết hạn hôm nay: Giảm 50% (bán nhanh)',
        '5. Hàng quá hạn: TIÊU HỦY ngay',
        '6. Chụp ảnh hàng tiêu hủy',
        '7. Ghi nhận hao hụt',
        '8. Báo cáo quản lý',
      ],
      notes: [
        '⏰ Kiểm tra 2 lần/ngày: sáng và chiều',
        '📊 Theo dõi tỷ lệ hao hụt',
        '💰 Tối ưu đặt hàng để giảm hao hụt',
      ],
    },
    packaged: {
      title: 'Quy trình xử lý hàng ĐÓNG GÓI',
      steps: [
        '1. Kiểm tra hạn định kỳ (1 tuần/lần)',
        '2. Hàng còn 1 tháng: Đẩy lên vị trí dễ thấy',
        '3. Hàng còn 2 tuần: Giảm 10%',
        '4. Hàng còn 1 tuần: Giảm 20%',
        '5. Hàng hết hạn: Kiểm tra chính sách NCC',
        '6. Nếu được: Tạo phiếu trả NCC',
        '7. Nếu không: Tiêu hủy và ghi nhận',
      ],
      notes: [
        '✅ Ưu tiên trả NCC nếu còn nguyên seal',
        '📦 Sắp xếp theo FIFO (First In First Out)',
        '💡 Đàm phán với NCC về chính sách đổi trả',
      ],
    },
    general: {
      title: 'Quy trình xử lý hàng THÔNG THƯỜNG',
      steps: [
        '1. Nhận yêu cầu đổi trả',
        '2. Kiểm tra hóa đơn gốc',
        '3. Kiểm tra tình trạng hàng',
        '4. Xác định lý do',
        '5. Hoàn tiền hoặc đổi hàng',
        '6. Nhập lại kho phù hợp',
        '7. Cập nhật tồn kho',
      ],
      notes: [
        '✅ Linh hoạt hơn các loại hàng khác',
        '📋 Vẫn cần ghi nhận đầy đủ',
      ],
    },
  }

  return guides[category]
}

// Export tất cả cases để test
export const runAllCases = () => {
  console.log('\n🧪 CHẠY TẤT CẢ TEST CASES\n')
  
  case1_QualityIssue()
  console.log('\n---\n')
  
  case2_CustomerChangeMind()
  console.log('\n---\n')
  
  case3_TooLate()
  console.log('\n---\n')
  
  case4_ExpiredPackaged()
  console.log('\n---\n')
  
  case5_NearExpiry()
  console.log('\n---\n')
  
  case6_BatchExpiry()
  console.log('\n---\n')
  
  case7_ForeignObject()
  console.log('\n---\n')
  
  case8_CancelBeforeCooking()
  console.log('\n---\n')
  
  console.log('✅ Hoàn thành tất cả test cases')
}
