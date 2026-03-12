import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'

type BillingCycle = 'monthly' | 'yearly'
type PaymentMethod = 'vietqr' | 'atm' | 'international'

const CheckoutPage = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr')
  const [voucher, setVoucher] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  })

  // Pricing logic
  const monthlyPrice = 500_000
  const months = billingCycle === 'yearly' ? 12 : 1
  const discount = billingCycle === 'yearly' ? 0.2 : 0
  const subtotal = monthlyPrice * months
  const discountAmount = subtotal * discount
  const taxRate = 0.08
  const afterDiscount = subtotal - discountAmount
  const tax = afterDiscount * taxRate
  const total = afterDiscount + tax

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN').format(amount) + 'đ'

  return (
    <DashboardLayout
      title="Thanh toán dịch vụ"
      breadcrumb={[
        { label: 'Cài đặt', path: '/settings' },
        { label: 'Thanh toán' }
      ]}
    >
      <div className="max-w-7xl mx-auto py-4">
        <div className="mb-8">
          <p className="text-slate-500 text-lg">Hoàn tất đăng ký gói CloudPOS của bạn để bắt đầu kinh doanh.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Checkout Steps */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Billing Cycle */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</span>
                <h3 className="text-lg font-bold">Chọn chu kỳ thanh toán</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    billingCycle === 'monthly'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-100 hover:border-primary/50'
                  }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">Hàng tháng</span>
                    <span className="text-sm text-slate-500">Thanh toán theo tháng linh hoạt</span>
                  </div>
                  <span
                    className={`material-symbols-outlined ml-auto text-primary transition-opacity ${
                      billingCycle === 'monthly' ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    check_circle
                  </span>
                </label>
                <label
                  className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    billingCycle === 'yearly'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-100 hover:border-primary/50'
                  }`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Hàng năm</span>
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -20%
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">Tiết kiệm nhất cho doanh nghiệp</span>
                  </div>
                  <span
                    className={`material-symbols-outlined ml-auto text-primary transition-opacity ${
                      billingCycle === 'yearly' ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    check_circle
                  </span>
                </label>
              </div>
            </section>

            {/* Step 2: Payment Method */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</span>
                <h3 className="text-lg font-bold">Phương thức thanh toán</h3>
              </div>
              <div className="space-y-3">
                {/* VietQR */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'vietqr'
                      ? 'border-primary ring-1 ring-primary'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setPaymentMethod('vietqr')}
                >
                  <input
                    className="text-primary focus:ring-primary h-4 w-4"
                    name="payment_method"
                    type="radio"
                    value="vietqr"
                    checked={paymentMethod === 'vietqr'}
                    readOnly
                  />
                  <div className="ml-4 flex items-center flex-1">
                    <span className="material-symbols-outlined text-primary mr-3">qr_code_2</span>
                    <div className="flex flex-col">
                      <span className="font-medium">Chuyển khoản qua VietQR</span>
                      <span className="text-xs text-slate-500">Quét mã QR để thanh toán nhanh qua Mobile Banking</span>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <div className="h-6 w-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center p-1">
                        <span className="text-[8px] font-bold text-blue-800 italic">VietQR</span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* ATM */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'atm'
                      ? 'border-primary ring-1 ring-primary'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setPaymentMethod('atm')}
                >
                  <input
                    className="text-primary focus:ring-primary h-4 w-4"
                    name="payment_method"
                    type="radio"
                    value="atm"
                    checked={paymentMethod === 'atm'}
                    readOnly
                  />
                  <div className="ml-4 flex items-center flex-1">
                    <span className="material-symbols-outlined text-slate-600 mr-3">credit_card</span>
                    <div className="flex flex-col">
                      <span className="font-medium">Thẻ ATM nội địa</span>
                      <span className="text-xs text-slate-500">Thanh toán qua cổng Napas</span>
                    </div>
                  </div>
                </label>

                {/* International */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === 'international'
                      ? 'border-primary ring-1 ring-primary'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => setPaymentMethod('international')}
                >
                  <input
                    className="text-primary focus:ring-primary h-4 w-4"
                    name="payment_method"
                    type="radio"
                    value="international"
                    checked={paymentMethod === 'international'}
                    readOnly
                  />
                  <div className="ml-4 flex items-center flex-1">
                    <span className="material-symbols-outlined text-slate-600 mr-3">payments</span>
                    <div className="flex flex-col">
                      <span className="font-medium">Thẻ quốc tế (Visa/Mastercard)</span>
                      <span className="text-xs text-slate-500">Thanh toán nhanh chóng, hỗ trợ thẻ nước ngoài</span>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <div className="h-6 w-8 bg-blue-700 rounded border border-slate-200 flex items-center justify-center">
                        <span className="text-[8px] text-white italic font-black">VISA</span>
                      </div>
                      <div className="h-6 w-8 bg-orange-600 rounded border border-slate-200 flex items-center justify-center">
                        <span className="text-[8px] text-white italic font-black">MC</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* Step 3: Customer Info */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">3</span>
                <h3 className="text-lg font-bold">Thông tin khách hàng</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Họ và tên</label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Nguyễn Văn A"
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Số điện thoại</label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="0901 234 567"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold">Địa chỉ Email</label>
                  <input
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="khachhang@example.com"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Step 4: Voucher */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">4</span>
                <h3 className="text-lg font-bold">Mã giảm giá</h3>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">sell</span>
                  <input
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Nhập mã ưu đãi của bạn"
                    type="text"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                  />
                </div>
                <button className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                  Áp dụng
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xl font-bold">Tóm tắt đơn hàng</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Service Details */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">rocket_launch</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Gói Chuyên Nghiệp</h4>
                    <p className="text-sm text-slate-500">Tất cả tính năng nâng cao &amp; 10 tài khoản nhân viên</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Thời hạn</span>
                    <span className="font-medium">
                      {billingCycle === 'yearly' ? '12 tháng (1 năm)' : '1 tháng'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Đơn giá</span>
                    <span className="font-medium">{formatCurrency(monthlyPrice)} / tháng</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tạm tính</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">Giảm giá chu kỳ ({discount * 100}%)</span>
                      <span className="text-green-600 font-bold">- {formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Thuế (VAT {taxRate * 100}%)</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t-2 border-dashed border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">Tổng thanh toán</span>
                    <div className="text-right">
                      <span className="block text-2xl font-black text-primary">{formatCurrency(total)}</span>
                      <span className="text-[10px] text-slate-400 italic">Đã bao gồm VAT</span>
                    </div>
                  </div>
                  <Link
                    to="/checkout/success"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">lock</span>
                    Thanh toán ngay
                  </Link>
                  <p className="text-[11px] text-center text-slate-500 mt-4 px-4 leading-relaxed">
                    Bằng cách nhấp vào "Thanh toán ngay", bạn đồng ý với{' '}
                    <Link className="underline hover:text-primary" to="/terms">Điều khoản dịch vụ</Link> và{' '}
                    <Link className="underline hover:text-primary" to="/privacy">Chính sách bảo mật</Link> của CloudPOS.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-xl">headset_mic</span>
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Cần hỗ trợ?</p>
                <p className="text-[11px] text-slate-600">Gọi 1900 1234 (8h - 22h)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CheckoutPage
