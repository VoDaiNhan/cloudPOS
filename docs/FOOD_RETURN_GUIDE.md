# Hướng dẫn xử lý đổi trả hàng ăn uống (F&B)

## Tổng quan

Hệ thống đổi trả hàng ăn uống được tích hợp vào chức năng "Đổi trả hàng" với các tính năng đặc biệt cho F&B:

- ✅ Quét mã vạch sản phẩm
- ✅ Tìm đơn hàng theo mã
- ✅ Kiểm tra tự động thời gian phục vụ
- ✅ Validate chính sách đổi trả theo loại hàng
- ✅ Kiểm tra hạn sử dụng
- ✅ Tính toán hoàn tiền tự động
- ✅ Cảnh báo cần phê duyệt

## Cách sử dụng

### 1. Truy cập chức năng

Vào menu: **Giao dịch > Đổi trả hàng**

### 2. Quét mã vạch hoặc nhập mã đơn

Có 3 cách tìm đơn hàng:

#### Cách 1: Quét mã vạch sản phẩm
- Đặt con trỏ vào ô "Quét mã vạch"
- Quét mã vạch trên sản phẩm
- Hệ thống tự động tìm đơn hàng chứa sản phẩm đó

#### Cách 2: Quét mã đơn hàng
- Quét mã vạch trên hóa đơn (bắt đầu bằng HD-)
- Hệ thống tự động load thông tin đơn

#### Cách 3: Nhập thủ công
- Nhập mã đơn hàng (VD: HD-2024-001)
- Nhấn Enter hoặc nút "Tìm kiếm"

### 3. Xem thông tin validation

Sau khi tìm thấy đơn hàng, hệ thống tự động kiểm tra:

- ✅ **Cho phép trả**: Hiển thị % hoàn tiền
- ❌ **Không cho phép**: Hiển thị lý do (quá thời gian, v.v.)
- ⏰ **Hạn sử dụng**: Còn bao nhiêu ngày hoặc đã hết hạn
- 🔒 **Cần phê duyệt**: Yêu cầu quản lý duyệt

### 4. Chọn sản phẩm trả

- Chọn sản phẩm muốn trả
- Nhập số lượng
- Chọn lý do trả hàng
- Chọn tình trạng hàng
- Nhập ghi chú (nếu cần)

### 5. Xác nhận và hoàn tất

- Kiểm tra tổng tiền hoàn
- Chọn phương thức hoàn tiền
- Xác nhận tạo phiếu

## Mã đơn hàng test

Hệ thống có sẵn 3 đơn hàng mẫu để test:

### HD-2024-001 (Đã phục vụ 25 phút trước)
- Cà phê Muối x2 (25,000đ) - Đồ uống
- Trà Đào Cam Sả x1 (45,000đ) - Đồ uống
- Sandwich Gà x1 (45,000đ) - Đồ ăn (còn 6 giờ hết hạn)
- Nước Ngọt Soda x1 (12,000đ) - Đóng gói (còn 30 ngày)

**Kết quả validation:**
- Đồ uống: ✅ Cho phép trả (trong 5 phút)
- Đồ ăn: ✅ Cho phép trả (trong 10 phút)
- Đóng gói: ✅ Cho phép trả (trong 60 phút)

### HD-2024-002 (Đã phục vụ 115 phút trước)
- Bánh Mì Bơ Tỏi x2 (35,000đ) - Dễ hỏng
- Cà Phê Sữa Đá x2 (22,000đ) - Đồ uống
- Bánh Flan x2 (18,000đ) - Dễ hỏng

**Kết quả validation:**
- Đồ uống: ❌ Quá thời gian (5 phút)
- Dễ hỏng: ❌ Quá thời gian (30 phút)

### HD-2024-003 (Chưa phục vụ)
- Combo Sáng Năng Động x1 (55,000đ)
- Combo Trà Chiều x1 (65,000đ)

**Kết quả validation:**
- ✅ Cho phép hủy (chưa phục vụ)
- ✅ Hoàn 100%

## Mã vạch test

Các mã vạch sản phẩm để test quét:

- `8934567890123` - Cà phê Muối
- `8934567890124` - Trà Đào Cam Sả
- `8934567890125` - Sandwich Gà
- `8934567890126` - Nước Ngọt Soda
- `8934567890127` - Bánh Mì Bơ Tỏi
- `8934567890128` - Cà Phê Sữa Đá
- `8934567890129` - Bánh Flan
- `8934567890130` - Combo Sáng Năng Động
- `8934567890131` - Combo Trà Chiều

## Chính sách đổi trả theo loại hàng

### 🍽️ Đồ ăn (food)
- Thời gian: **10 phút** sau khi phục vụ
- Hoàn tiền: **100%** (nếu lỗi từ cửa hàng)
- Hoàn tiền: **50%** (nếu khách đổi ý)
- Cần phê duyệt: **Có**
- Xử lý: **Tiêu hủy ngay**
- Bắt buộc chụp ảnh: **Có**

### ☕ Đồ uống (beverage)
- Thời gian: **5 phút** sau khi phục vụ
- Hoàn tiền: **100%** (nếu lỗi)
- Hoàn tiền: **50%** (nếu khách đổi ý)
- Cần phê duyệt: **Không** (nếu chưa động đến)
- Xử lý: **Tiêu hủy**

### 🥖 Hàng dễ hỏng (perishable)
- Thời gian: **30 phút** sau khi phục vụ
- Hoàn tiền: **100%**
- Cần phê duyệt: **Có**
- Xử lý: **Tiêu hủy** hoặc nhân viên tiêu thụ (nếu còn an toàn)
- Bắt buộc chụp ảnh: **Có**

### 📦 Hàng đóng gói (packaged)
- Thời gian: **60 phút** sau khi phục vụ
- Hoàn tiền: **100%**
- Cần phê duyệt: **Không**
- Xử lý: **Trả nhà cung cấp** (nếu còn nguyên seal)

## Xử lý hàng hết hạn

Hệ thống tự động kiểm tra hạn sử dụng:

### Còn hạn tốt
- ✅ Bán bình thường
- Không giảm giá

### Gần hết hạn
- ⚠️ Còn 3 ngày: Giảm 20%
- ⚠️ Còn 1 ngày: Giảm 30%
- ⚠️ Hôm nay hết hạn: Giảm 50%

### Đã hết hạn
- ❌ Không được bán
- ❌ Phải tiêu hủy ngay
- 📸 Bắt buộc chụp ảnh
- 📝 Ghi nhận hao hụt

## Quy trình xử lý thực tế

### Khi khách yêu cầu trả hàng:

1. **Nhận yêu cầu**
   - Hỏi lý do trả hàng
   - Yêu cầu hóa đơn hoặc mã đơn

2. **Quét mã**
   - Quét mã vạch sản phẩm hoặc mã đơn hàng
   - Hệ thống tự động kiểm tra

3. **Kiểm tra validation**
   - Xem kết quả: Cho phép / Không cho phép
   - Xem % hoàn tiền
   - Xem có cần phê duyệt không

4. **Nếu cần phê duyệt**
   - Gọi quản lý
   - Chụp ảnh bằng chứng (nếu cần)
   - Chờ phê duyệt

5. **Xử lý món hàng**
   - Thu hồi món
   - Tiêu hủy theo quy định
   - Chụp ảnh tiêu hủy (nếu cần)

6. **Hoàn tiền**
   - Chọn phương thức hoàn tiền
   - Xác nhận và in phiếu
   - Ghi nhận hao hụt

## Lưu ý quan trọng

### ⚠️ KHÔNG được:
- Cho nhân viên ăn món khách trả (trừ khi được phép)
- Để món trả lẫn với món bán
- Bỏ qua việc chụp ảnh khi bắt buộc
- Hoàn tiền khi chưa có phê duyệt (nếu cần)

### ✅ BẮT BUỘC:
- Kiểm tra thời gian phục vụ
- Chụp ảnh bằng chứng (món lỗi)
- Tiêu hủy trong vòng 5 phút
- Ghi nhận vào sổ hao hụt
- Cập nhật báo cáo ca

## Báo cáo và thống kê

Hệ thống tự động ghi nhận:
- Số lượng phiếu đổi trả
- Tổng tiền hoàn
- Lý do trả hàng phổ biến
- Sản phẩm bị trả nhiều nhất
- Tỷ lệ hao hụt theo ca

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra lại mã đơn hàng
2. Kiểm tra thời gian phục vụ
3. Liên hệ quản lý nếu cần phê duyệt đặc biệt
4. Xem log validation để biết lý do không cho phép trả
