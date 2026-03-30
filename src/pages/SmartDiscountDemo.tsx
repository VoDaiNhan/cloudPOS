import { useState } from 'react'
import { SmartDiscountInput } from '../components/SmartDiscountInput'
import type { DiscountType } from '../types/posProduct'
import { DashboardLayout } from '../layouts/DashboardLayout'

const SmartDiscountDemo = () => {
  const [discount1, setDiscount1] = useState({ value: 0, type: 'percent' as DiscountType })
  const [discount2, setDiscount2] = useState({ value: 0, type: 'fixed' as DiscountType })
  const [discount3, setDiscount3] = useState({ value: 0, type: 'percent' as DiscountType })

  const productPrice = 150000
  const quantity = 2
  const lineTotal = productPrice * quantity

  const calculateDiscount = (value: number, type: DiscountType, max: number) => {
    if (type === 'percent') {
      return Math.round(max * value / 100)
    }
    return Math.min(value, max)
  }

  const discount1Amount = calculateDiscount(discount1.value, discount1.type, lineTotal)
  const discount2Amount = calculateDiscount(discount2.value, discount2.type, 500000)
  const discount3Amount = calculateDiscount(discount3.value, discount3.type, 1000000)

  return (
    <DashboardLayout
      title="Giảm giá thông minh"
      breadcrumb={[
        { label: 'Bán hàng' },
        { label: 'Giảm giá' },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Smart Discount Input Demo
          </h1>
          <p className="text-slate-500 font-medium">
            Nhập số và xem gợi ý thông minh xuất hiện ngay lập tức
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            Hướng dẫn sử dụng
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
              <span><strong>Nhập số 8:</strong> Gợi ý 8%, 0.8%, 80,000đ, 800,000đ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
              <span><strong>Nhập số 15:</strong> Gợi ý 15%, 1.5%, 15,000đ, 150,000đ, 1,500,000đ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>
              <span><strong>Nhập số 50000:</strong> Gợi ý 50,000đ (số tiền chính xác)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">keyboard</span>
              <span><strong>Phím tắt:</strong> ↑↓ để di chuyển, Enter để chọn, Esc để hủy</span>
            </li>
          </ul>
        </div>

        {/* Demo Cases */}
        <div className="grid gap-6">
          {/* Case 1: Product Discount */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Giảm giá sản phẩm
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Sản phẩm: Cà phê sữa đá • Giá: {productPrice.toLocaleString('vi-VN')}đ • SL: {quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tổng dòng</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {lineTotal.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32">
                  Giảm giá:
                </label>
                <SmartDiscountInput
                  value={discount1.value}
                  type={discount1.type}
                  maxAmount={lineTotal}
                  onApply={(value, type) => setDiscount1({ value, type })}
                  placeholder="Nhập giảm giá"
                  className="flex-1"
                />
              </div>

              {discount1.value > 0 && (
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-rose-900 dark:text-rose-100">
                        Giảm giá áp dụng
                      </p>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                        {discount1.value}{discount1.type === 'percent' ? '%' : 'đ'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-rose-600">
                        -{discount1Amount.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                        Còn: {(lineTotal - discount1Amount).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Case 2: Invoice Discount */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Giảm giá hóa đơn
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Áp dụng cho toàn bộ hóa đơn
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tổng hóa đơn</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  500,000đ
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32">
                  Giảm giá:
                </label>
                <SmartDiscountInput
                  value={discount2.value}
                  type={discount2.type}
                  maxAmount={500000}
                  onApply={(value, type) => setDiscount2({ value, type })}
                  placeholder="Nhập giảm giá"
                  className="flex-1"
                />
              </div>

              {discount2.value > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                        Giảm giá hóa đơn
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                        {discount2.value}{discount2.type === 'percent' ? '%' : 'đ'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-600">
                        -{discount2Amount.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                        Còn: {(500000 - discount2Amount).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Case 3: Large Amount */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Giảm giá số tiền lớn
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Test với số tiền lớn hơn
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tổng</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  1,000,000đ
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 w-32">
                  Giảm giá:
                </label>
                <SmartDiscountInput
                  value={discount3.value}
                  type={discount3.type}
                  maxAmount={1000000}
                  onApply={(value, type) => setDiscount3({ value, type })}
                  placeholder="Nhập giảm giá"
                  className="flex-1"
                />
              </div>

              {discount3.value > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
                        Giảm giá áp dụng
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        {discount3.value}{discount3.type === 'percent' ? '%' : 'đ'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-purple-600">
                        -{discount3Amount.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                        Còn: {(1000000 - discount3Amount).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
            Ví dụ thực tế
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-bold text-slate-700 dark:text-slate-300">Nhập "8":</p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 ml-4">
                <li>• 8% - Giảm theo phần trăm</li>
                <li>• 0.8% - Giảm phần trăm nhỏ</li>
                <li>• 8,000đ - Giảm 8 nghìn</li>
                <li>• 80,000đ - Giảm 80 nghìn</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-700 dark:text-slate-300">Nhập "15":</p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 ml-4">
                <li>• 15% - Giảm theo phần trăm</li>
                <li>• 1.5% - Giảm phần trăm nhỏ</li>
                <li>• 15,000đ - Giảm 15 nghìn</li>
                <li>• 150,000đ - Giảm 150 nghìn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SmartDiscountDemo
