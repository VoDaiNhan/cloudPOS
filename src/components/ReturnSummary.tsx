import { useState } from 'react'
import type { ReturnOrderItem, RefundMethod } from '../types/returnExchange'

interface ReturnSummaryProps {
  items: Partial<ReturnOrderItem>[]
  returnType: 'cancel' | 'return' | 'exchange'
  onConfirm: (refundMethod: RefundMethod, notes?: string) => void
  onCancel: () => void
}

export const ReturnSummary = ({
  items,
  returnType,
  onConfirm,
  onCancel,
}: ReturnSummaryProps) => {
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('cash')
  const [notes, setNotes] = useState('')
  const [refundReference, setRefundReference] = useState('')

  const subtotal = items.reduce((sum, item) => sum + (item.returnAmount || 0), 0)
  const refundAmount = returnType === 'cancel' || returnType === 'return' ? subtotal : 0
  const additionalCharge = 0 // Sẽ tính khi có đổi hàng
  const netAmount = returnType === 'return' ? -refundAmount : additionalCharge

  const refundMethods = [
    { value: 'cash', label: 'Tiền mặt', icon: 'payments' },
    { value: 'bank_transfer', label: 'Chuyển khoản', icon: 'account_balance' },
    { value: 'card', label: 'Thẻ', icon: 'credit_card' },
    { value: 'ewallet', label: 'Ví điện tử', icon: 'wallet' },
    { value: 'store_credit', label: 'Tích điểm', icon: 'loyalty' },
  ]

  const handleConfirm = () => {
    onConfirm(refundMethod, notes)
  }

  return (
    <div className="space-y-6">
      {/* Items Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 p-4">
        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-3">
          Tóm tắt sản phẩm
        </h4>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
            >
              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {item.productName}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>SL: {item.returnQuantity}</span>
                  <span>•</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold ${
                      item.condition === 'good'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.condition === 'defective'
                        ? 'bg-rose-100 text-rose-700'
                        : item.condition === 'opened'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.condition === 'good'
                      ? 'Còn tốt'
                      : item.condition === 'defective'
                      ? 'Lỗi'
                      : item.condition === 'opened'
                      ? 'Đã mở'
                      : 'Cần kiểm tra'}
                  </span>
                </div>
              </div>
              <p className="font-black text-slate-900 dark:text-white">
                {item.returnAmount?.toLocaleString('vi-VN')}đ
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-linear-to-br from-primary/10 to-blue-500/10 rounded-xl border-2 border-primary/20 p-6">
        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4">
          Tính toán tài chính
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Tổng giá trị hàng:
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {subtotal.toLocaleString('vi-VN')}đ
            </span>
          </div>

          {returnType === 'return' && (
            <div className="flex items-center justify-between pt-3 border-t border-primary/20">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Số tiền hoàn lại:
              </span>
              <span className="text-2xl font-black text-rose-600">
                {refundAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
          )}

          {returnType === 'exchange' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Giá trị hàng mới:
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  0đ
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Chênh lệch:
                </span>
                <span className="text-2xl font-black text-emerald-600">
                  0đ
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Refund Method */}
      {(returnType === 'return' || returnType === 'cancel') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 p-4">
          <h4 className="text-sm font-black text-slate-900 dark:text-white mb-3">
            Phương thức hoàn tiền
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {refundMethods.map((method) => (
              <button
                key={method.value}
                onClick={() => setRefundMethod(method.value as RefundMethod)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  refundMethod === method.value
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl mb-1 block ${
                    refundMethod === method.value ? 'text-primary' : 'text-slate-400'
                  }`}
                >
                  {method.icon}
                </span>
                <p
                  className={`text-xs font-bold ${
                    refundMethod === method.value
                      ? 'text-primary'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {method.label}
                </p>
              </button>
            ))}
          </div>

          {(refundMethod === 'bank_transfer' || refundMethod === 'card') && (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                {refundMethod === 'bank_transfer' ? 'Số tài khoản' : 'Số thẻ'}
              </label>
              <input
                type="text"
                value={refundReference}
                onChange={(e) => setRefundReference(e.target.value)}
                placeholder={
                  refundMethod === 'bank_transfer'
                    ? 'Nhập số tài khoản nhận tiền'
                    : 'Nhập 4 số cuối thẻ'
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 p-4">
        <label className="block text-sm font-black text-slate-900 dark:text-white mb-2">
          Ghi chú thêm (không bắt buộc)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi chú về giao dịch đổi trả này..."
          rows={3}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 py-3 font-black text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          Hủy
        </button>
        <button
          onClick={handleConfirm}
          disabled={items.length === 0}
          className="flex-1 rounded-xl bg-primary py-3 font-black text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Xác nhận {returnType === 'cancel' ? 'hủy' : returnType === 'return' ? 'trả hàng' : 'đổi hàng'}
        </button>
      </div>
    </div>
  )
}
