import { useState } from 'react'
import type { ReturnOrder, ReturnOrderItem, WarehouseType } from '../types/batch'

interface ReturnOrderManagerProps {
  onSubmit: (returnOrder: Partial<ReturnOrder>) => void
  onCancel: () => void
  existingOrder?: ReturnOrder
}

export const ReturnOrderManager = ({
  onSubmit,
  onCancel,
  existingOrder,
}: ReturnOrderManagerProps) => {
  const [returnType, setReturnType] = useState<ReturnOrder['type']>(
    existingOrder?.type || 'customer_return'
  )
  const [items, setItems] = useState<Partial<ReturnOrderItem>[]>(
    existingOrder?.items || [
      {
        productName: '',
        batchNumber: '',
        quantity: 0,
        unitPrice: 0,
        condition: 'good',
        action: 'restock',
      },
    ]
  )
  const [reason, setReason] = useState(existingOrder?.reason || '')
  const [notes, setNotes] = useState(existingOrder?.notes || '')

  const addItem = () => {
    setItems([
      ...items,
      {
        productName: '',
        batchNumber: '',
        quantity: 0,
        unitPrice: 0,
        condition: 'good',
        action: 'restock',
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof ReturnOrderItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.unitPrice || 0)
    }, 0)
  }

  const getDestinationWarehouse = (): WarehouseType => {
    switch (returnType) {
      case 'customer_return':
        return 'return'
      case 'supplier_return':
        return 'return_to_supplier'
      case 'damage':
        return 'damaged'
      case 'expiry':
        return 'expired'
      default:
        return 'return'
    }
  }

  const handleSubmit = () => {
    const returnOrder: Partial<ReturnOrder> = {
      type: returnType,
      items: items as ReturnOrderItem[],
      reason,
      notes,
      destinationWarehouse: getDestinationWarehouse(),
      totalAmount: calculateTotal(),
      refundAmount: returnType === 'customer_return' ? calculateTotal() : 0,
      status: 'pending',
      returnDate: new Date().toISOString().split('T')[0],
    }

    onSubmit(returnOrder)
  }

  const returnTypeOptions = [
    { value: 'customer_return', label: 'Khách hàng trả lại', icon: 'person', color: 'blue' },
    { value: 'supplier_return', label: 'Trả nhà cung cấp', icon: 'local_shipping', color: 'purple' },
    { value: 'damage', label: 'Hàng hỏng', icon: 'broken_image', color: 'orange' },
    { value: 'expiry', label: 'Hết hạn', icon: 'event_busy', color: 'rose' },
  ]

  const conditionOptions = [
    { value: 'good', label: 'Tốt', color: 'emerald' },
    { value: 'damaged', label: 'Hỏng', color: 'orange' },
    { value: 'expired', label: 'Hết hạn', color: 'rose' },
    { value: 'defective', label: 'Lỗi', color: 'amber' },
  ]

  const actionOptions = [
    { value: 'restock', label: 'Nhập lại kho', icon: 'inventory' },
    { value: 'dispose', label: 'Hủy', icon: 'delete' },
    { value: 'return_to_supplier', label: 'Trả NCC', icon: 'undo' },
    { value: 'repair', label: 'Sửa chữa', icon: 'build' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-rose-500 to-orange-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black mb-1">
                {existingOrder ? 'Chỉnh sửa phiếu trả hàng' : 'Tạo phiếu trả hàng / hủy hàng'}
              </h2>
              <p className="text-sm opacity-90">
                Xử lý hàng trả lại, hàng hỏng, hàng hết hạn
              </p>
            </div>
            <button
              onClick={onCancel}
              className="size-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Return Type Selection */}
          <div>
            <label className="block text-sm font-black text-slate-900 dark:text-white mb-3">
              Loại phiếu trả
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {returnTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setReturnType(option.value as ReturnOrder['type'])}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    returnType === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl mb-2 ${
                      returnType === option.value
                        ? `text-${option.color}-600`
                        : 'text-slate-400'
                    }`}
                  >
                    {option.icon}
                  </span>
                  <p
                    className={`text-sm font-bold ${
                      returnType === option.value
                        ? `text-${option.color}-900 dark:text-${option.color}-100`
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {option.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-black text-slate-900 dark:text-white">
                Danh sách sản phẩm
              </label>
              <button
                onClick={addItem}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-black hover:bg-primary/90 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Thêm sản phẩm
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
                      {index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Tên sản phẩm
                      </label>
                      <input
                        type="text"
                        value={item.productName || ''}
                        onChange={(e) => updateItem(index, 'productName', e.target.value)}
                        placeholder="Nhập tên sản phẩm"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Số lô (nếu có)
                      </label>
                      <input
                        type="text"
                        value={item.batchNumber || ''}
                        onChange={(e) => updateItem(index, 'batchNumber', e.target.value)}
                        placeholder="Nhập số lô"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        value={item.quantity || ''}
                        onChange={(e) =>
                          updateItem(index, 'quantity', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Đơn giá
                      </label>
                      <input
                        type="number"
                        value={item.unitPrice || ''}
                        onChange={(e) =>
                          updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Tình trạng
                      </label>
                      <select
                        value={item.condition || 'good'}
                        onChange={(e) => updateItem(index, 'condition', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      >
                        {conditionOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Xử lý
                      </label>
                      <select
                        value={item.action || 'restock'}
                        onChange={(e) => updateItem(index, 'action', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      >
                        {actionOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Ghi chú
                    </label>
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => updateItem(index, 'notes', e.target.value)}
                      placeholder="Ghi chú về sản phẩm này"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      Thành tiền:
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reason & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-slate-900 dark:text-white mb-2">
                Lý do <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do trả hàng/hủy hàng"
                rows={3}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-slate-900 dark:text-white mb-2">
                Ghi chú thêm
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú bổ sung (không bắt buộc)"
                rows={3}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Tổng giá trị:
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {calculateTotal().toLocaleString('vi-VN')}đ
              </span>
            </div>
            {returnType === 'customer_return' && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  Số tiền hoàn lại:
                </span>
                <span className="text-xl font-black text-primary">
                  {calculateTotal().toLocaleString('vi-VN')}đ
                </span>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-primary/20">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-sm text-amber-500">
                  warehouse
                </span>
                <span>
                  Hàng sẽ được chuyển đến:{' '}
                  <span className="font-black text-slate-900 dark:text-white">
                    {getDestinationWarehouse() === 'return'
                      ? 'Kho hàng trả'
                      : getDestinationWarehouse() === 'damaged'
                      ? 'Kho hàng hỏng'
                      : getDestinationWarehouse() === 'expired'
                      ? 'Kho hàng hết hạn'
                      : 'Trả nhà cung cấp'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 py-3 font-black text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || items.length === 0}
            className="flex-1 rounded-xl bg-primary py-3 font-black text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Tạo phiếu trả hàng
          </button>
        </div>
      </div>
    </div>
  )
}
