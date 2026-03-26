import { useState } from 'react'
import { SmartDiscountInput } from '../components/SmartDiscountInput'
import type { DiscountType } from '../types/posProduct'

const DiscountComparisonDemo = () => {
  // Product discounts
  const [product1Discount, setProduct1Discount] = useState({ value: 0, type: 'percent' as DiscountType })
  const [product2Discount, setProduct2Discount] = useState({ value: 0, type: 'fixed' as DiscountType })
  const [product3Discount, setProduct3Discount] = useState({ value: 0, type: 'percent' as DiscountType })

  // Invoice discount
  const [invoiceDiscount, setInvoiceDiscount] = useState({ value: 0, type: 'percent' as DiscountType })

  // Mock products
  const products = [
    { id: '1', name: 'Cà phê sữa đá', price: 35000, quantity: 2 },
    { id: '2', name: 'Bánh mì thịt', price: 25000, quantity: 3 },
    { id: '3', name: 'Trà sữa trân châu', price: 45000, quantity: 1 },
  ]

  // Calculate discounts
  const calculateDiscount = (value: number, type: DiscountType, amount: number) => {
    if (type === 'percent') {
      return Math.round(amount * value / 100)
    }
    return Math.min(value, amount)
  }

  const product1Total = products[0].price * products[0].quantity
  const product1DiscountAmount = calculateDiscount(product1Discount.value, product1Discount.type, product1Total)
  const product1Final = product1Total - product1DiscountAmount

  const product2Total = products[1].price * products[1].quantity
  const product2DiscountAmount = calculateDiscount(product2Discount.value, product2Discount.type, product2Total)
  const product2Final = product2Total - product2DiscountAmount

  const product3Total = products[2].price * products[2].quantity
  const product3DiscountAmount = calculateDiscount(product3Discount.value, product3Discount.type, product3Total)
  const product3Final = product3Total - product3DiscountAmount

  const subtotal = product1Total + product2Total + product3Total
  const totalProductDiscount = product1DiscountAmount + product2DiscountAmount + product3DiscountAmount
  const afterProductDiscount = subtotal - totalProductDiscount

  const invoiceDiscountAmount = calculateDiscount(invoiceDiscount.value, invoiceDiscount.type, afterProductDiscount)
  const finalTotal = afterProductDiscount - invoiceDiscountAmount

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            So sánh Giảm giá Sản phẩm vs Giảm giá Hóa đơn
          </h1>
          <p className="text-slate-500 font-medium">
            Hiểu rõ sự khác biệt và cách áp dụng linh hoạt
          </p>
        </div>

        {/* Explanation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Discount */}
          <div className="bg-linear-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-rose-200 dark:border-rose-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-xl bg-rose-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">sell</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-rose-900 dark:text-rose-100">
                  Giảm giá Sản phẩm
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest">
                  Product-level Discount
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-rose-800 dark:text-rose-200">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                <span>Áp dụng cho <strong>từng sản phẩm riêng lẻ</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                <span>Tính trên <strong>đơn giá × số lượng</strong> của sản phẩm đó</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                <span>Mỗi sản phẩm có thể có <strong>mức giảm giá khác nhau</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                <span>Hỗ trợ cả <strong>% và tiền mặt</strong></span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl">
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                💡 Ví dụ: Giảm 10% cho cà phê, giảm 5,000đ cho bánh mì
              </p>
            </div>
          </div>

          {/* Invoice Discount */}
          <div className="bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">receipt_long</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-amber-900 dark:text-amber-100">
                  Giảm giá Hóa đơn
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest">
                  Invoice-level Discount
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                <span>Áp dụng cho <strong>toàn bộ hóa đơn</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                <span>Tính trên <strong>tổng tiền sau khi đã giảm giá sản phẩm</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                <span>Chỉ có <strong>1 mức giảm giá duy nhất</strong> cho cả đơn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
                <span>Hỗ trợ cả <strong>% và tiền mặt</strong></span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                💡 Ví dụ: Giảm thêm 5% cho khách VIP, hoặc giảm 20,000đ cho đơn trên 100k
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-primary to-blue-600 p-6 text-white">
            <h2 className="text-2xl font-black mb-2">Demo Tương tác</h2>
            <p className="text-sm opacity-90">Thử nghiệm và xem sự khác biệt ngay lập tức</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Products Table */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-rose-500">sell</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  1. Giảm giá từng sản phẩm
                </h3>
              </div>
              
              <div className="space-y-3">
                {/* Product 1 */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{products[0].name}</p>
                      <p className="text-xs text-slate-500">
                        {products[0].price.toLocaleString('vi-VN')}đ × {products[0].quantity} = {product1Total.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Thành tiền</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {product1Final.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                  <SmartDiscountInput
                    value={product1Discount.value}
                    type={product1Discount.type}
                    maxAmount={product1Total}
                    onApply={(value, type) => setProduct1Discount({ value, type })}
                    placeholder="Nhập giảm giá"
                    showTypeIndicator={true}
                  />
                </div>

                {/* Product 2 */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{products[1].name}</p>
                      <p className="text-xs text-slate-500">
                        {products[1].price.toLocaleString('vi-VN')}đ × {products[1].quantity} = {product2Total.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Thành tiền</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {product2Final.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                  <SmartDiscountInput
                    value={product2Discount.value}
                    type={product2Discount.type}
                    maxAmount={product2Total}
                    onApply={(value, type) => setProduct2Discount({ value, type })}
                    placeholder="Nhập giảm giá"
                    showTypeIndicator={true}
                  />
                </div>

                {/* Product 3 */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{products[2].name}</p>
                      <p className="text-xs text-slate-500">
                        {products[2].price.toLocaleString('vi-VN')}đ × {products[2].quantity} = {product3Total.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Thành tiền</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">
                        {product3Final.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                  <SmartDiscountInput
                    value={product3Discount.value}
                    type={product3Discount.type}
                    maxAmount={product3Total}
                    onApply={(value, type) => setProduct3Discount({ value, type })}
                    placeholder="Nhập giảm giá"
                    showTypeIndicator={true}
                  />
                </div>
              </div>
            </div>

            {/* Calculation Summary */}
            <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Tổng tiền hàng</span>
                <span className="font-black text-slate-900 dark:text-white">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              
              {totalProductDiscount > 0 && (
                <div className="flex justify-between items-center bg-rose-50 dark:bg-rose-900/20 -mx-6 px-6 py-3 border-y border-rose-100 dark:border-rose-900/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-500 text-sm">sell</span>
                    <span className="text-rose-700 dark:text-rose-300 font-bold text-sm">Giảm giá sản phẩm</span>
                  </div>
                  <span className="font-black text-rose-600">-{totalProductDiscount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">Tạm tính</span>
                <span className="font-black text-slate-900 dark:text-white">{afterProductDiscount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Invoice Discount */}
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-amber-600">receipt_long</span>
                <h3 className="text-lg font-black text-amber-900 dark:text-amber-100">
                  2. Giảm giá toàn hóa đơn
                </h3>
              </div>
              <SmartDiscountInput
                value={invoiceDiscount.value}
                type={invoiceDiscount.type}
                maxAmount={afterProductDiscount}
                onApply={(value, type) => setInvoiceDiscount({ value, type })}
                placeholder="Nhập giảm giá hóa đơn"
                showTypeIndicator={true}
              />
            </div>

            {/* Final Total */}
            <div className="bg-linear-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-widest mb-1">
                    Tổng thanh toán
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-emerald-600">
                      {finalTotal.toLocaleString('vi-VN')}đ
                    </span>
                    {(totalProductDiscount + invoiceDiscountAmount) > 0 && (
                      <div className="text-left">
                        <p className="text-xs text-emerald-600 font-bold">Tiết kiệm</p>
                        <p className="text-lg font-black text-emerald-600">
                          {(totalProductDiscount + invoiceDiscountAmount).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <span className="material-symbols-outlined text-6xl text-emerald-500">
                  check_circle
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">lightbulb</span>
            Điểm quan trọng cần nhớ
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="space-y-2">
              <p className="font-bold">✅ Thứ tự áp dụng:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Giảm giá sản phẩm trước</li>
                <li>Tính tổng sau giảm giá sản phẩm</li>
                <li>Áp dụng giảm giá hóa đơn</li>
              </ol>
            </div>
            <div className="space-y-2">
              <p className="font-bold">✅ Linh hoạt:</p>
              <ul className="space-y-1 ml-2">
                <li>• Mỗi loại giảm giá có thể dùng % hoặc tiền mặt</li>
                <li>• Có thể kết hợp cả 2 loại giảm giá</li>
                <li>• Hệ thống tự động tính toán chính xác</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscountComparisonDemo
