import { useState } from 'react'
import type { ReturnOrderItem, ReturnReason, ReturnCondition } from '../types/returnExchange'
import { returnReasons, returnConditions } from '../mock/returnExchange'

interface ReturnItemSelectorProps {
  orderItems: any[]
  onItemsSelected: (items: Partial<ReturnOrderItem>[]) => void
  returnType: 'cancel' | 'return' | 'exchange'
}

export const ReturnItemSelector = ({
  orderItems,
  onItemsSelected,
  returnType,
}: ReturnItemSelectorProps) => {
  const [selectedItems, setSelectedItems] = useState<
    Map<string, Partial<ReturnOrderItem>>
  >(new Map())

  const handleSelectItem = (item: any) => {
    const newSelected = new Map(selectedItems)
    
    if (newSelected.has(item.id)) {
      newSelected.delete(item.id)
    } else {
      newSelected.set(item.id, {
        originalOrderItemId: item.id,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        originalQuantity: item.quantity,
        originalPrice: item.price,
        originalDiscount: item.discount || 0,
        returnQuantity: 1,
        returnPrice: item.price,
        returnAmount: item.price,
        condition: 'good',
        warehouse: 'main',
        reason: 'customer_request',
      })
    }
    
    setSelectedItems(newSelected)
    onItemsSelected(Array.from(newSelected.values()))
  }

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const newSelected = new Map(selectedItems)
    const item = newSelected.get(itemId)
    
    if (item) {
      const maxQty = item.originalQuantity || 1
      const validQty = Math.max(1, Math.min(quantity, maxQty))
      
      item.returnQuantity = validQty
      item.returnAmount = validQty * (item.returnPrice || 0)
      
      newSelected.set(itemId, item)
      setSelectedItems(newSelected)
      onItemsSelected(Array.from(newSelected.values()))
    }
  }

  const handleReasonChange = (itemId: string, reason: ReturnReason) => {
    const newSelected = new Map(selectedItems)
    const item = newSelected.get(itemId)
    
    if (item) {
      item.reason = reason
      newSelected.set(itemId, item)
      setSelectedItems(newSelected)
      onItemsSelected(Array.from(newSelected.values()))
    }
  }

  const handleConditionChange = (itemId: string, condition: ReturnCondition) => {
    const newSelected = new Map(selectedItems)
    const item = newSelected.get(itemId)
    
    if (item) {
      item.condition = condition
      const conditionInfo = returnConditions.find((c) => c.value === condition)
      if (conditionInfo) {
        item.warehouse = conditionInfo.warehouse
      }
      newSelected.set(itemId, item)
      setSelectedItems(newSelected)
      onItemsSelected(Array.from(newSelected.values()))
    }
  }

  const handleNoteChange = (itemId: string, note: string) => {
    const newSelected = new Map(selectedItems)
    const item = newSelected.get(itemId)
    
    if (item) {
      item.reasonNote = note
      newSelected.set(itemId, item)
      setSelectedItems(newSelected)
      onItemsSelected(Array.from(newSelected.values()))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-black text-slate-900 dark:text-white">
          Chọn sản phẩm muốn {returnType === 'cancel' ? 'hủy' : returnType === 'return' ? 'trả' : 'đổi'}
        </h4>
        <span className="text-xs text-slate-500">
          Đã chọn: {selectedItems.size} sản phẩm
        </span>
      </div>

      {orderItems.map((item) => {
        const isSelected = selectedItems.has(item.id)
        const selectedItem = selectedItems.get(item.id)

        return (
          <div
            key={item.id}
            className={`rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            {/* Item Header */}
            <div
              className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
              onClick={() => handleSelectItem(item)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-white text-sm">
                      check
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {item.productName}
                    </p>
                    {/* Category Badge */}
                    {item.category && ['food', 'beverage', 'perishable', 'packaged'].includes(item.category) && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.category === 'food' ? 'bg-orange-100 text-orange-700' :
                        item.category === 'beverage' ? 'bg-blue-100 text-blue-700' :
                        item.category === 'perishable' ? 'bg-amber-100 text-amber-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {item.category === 'food' ? '🍽️ Đồ ăn' : 
                         item.category === 'beverage' ? '☕ Đồ uống' :
                         item.category === 'perishable' ? '🥖 Dễ hỏng' : '📦 Đóng gói'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Đã mua: {item.quantity} × {item.price.toLocaleString('vi-VN')}đ = {item.total.toLocaleString('vi-VN')}đ
                    {item.barcode && ` • Mã: ${item.barcode}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Item Details (when selected) */}
            {isSelected && selectedItem && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                    Số lượng {returnType === 'return' ? 'trả' : returnType === 'exchange' ? 'đổi' : 'hủy'}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, (selectedItem.returnQuantity || 1) - 1)
                      }
                      disabled={(selectedItem.returnQuantity || 1) <= 1}
                      className="size-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <input
                      type="number"
                      value={selectedItem.returnQuantity || 1}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                      }
                      min="1"
                      max={item.quantity}
                      className="w-20 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, (selectedItem.returnQuantity || 1) + 1)
                      }
                      disabled={(selectedItem.returnQuantity || 1) >= item.quantity}
                      className="size-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                    <span className="text-xs text-slate-500">
                      / {item.quantity} (tối đa)
                    </span>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                    Lý do
                  </label>
                  <select
                    value={selectedItem.reason}
                    onChange={(e) => handleReasonChange(item.id, e.target.value as ReturnReason)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    {/* Lý do cho F&B */}
                    {item.category && ['food', 'beverage', 'perishable'].includes(item.category) ? (
                      <>
                        <option value="wrong_item">Giao sai món</option>
                        <option value="technical_defect">Chất lượng không đạt (mùi vị, độ tươi)</option>
                        <option value="shipping_damage">Nhiệt độ không đúng (quá nóng/lạnh)</option>
                        <option value="expired">Hết hạn hoặc gần hết hạn</option>
                        <option value="other">Có dị vật</option>
                        <option value="customer_request">Khách đổi ý (trong thời gian cho phép)</option>
                      </>
                    ) : item.category === 'packaged' ? (
                      <>
                        <option value="expired">Hết hạn</option>
                        <option value="shipping_damage">Bao bì hư hỏng</option>
                        <option value="technical_defect">Sản phẩm bị lỗi</option>
                        <option value="wrong_item">Giao sai hàng</option>
                        <option value="customer_request">Khách đổi ý</option>
                      </>
                    ) : (
                      // Lý do cho hàng thông thường
                      returnReasons.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                    Tình trạng hàng
                  </label>
                  
                  {/* Kiểm tra nếu là F&B */}
                  {item.category && ['food', 'beverage', 'perishable'].includes(item.category) ? (
                    // Tình trạng cho F&B
                    <div className="space-y-2">
                      <button
                        onClick={() => handleConditionChange(item.id, 'defective')}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedItem.condition === 'defective'
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-rose-600">delete</span>
                          <p className={`text-sm font-bold ${
                            selectedItem.condition === 'defective'
                              ? 'text-rose-900 dark:text-rose-100'
                              : 'text-slate-900 dark:text-white'
                          }`}>
                            Tiêu hủy ngay
                          </p>
                        </div>
                        <p className="text-xs text-slate-500">
                          {item.category === 'beverage' ? 'Đồ uống đã pha chế không thể bán lại' :
                           item.category === 'food' ? 'Đồ ăn đã chế biến phải tiêu hủy' :
                           'Hàng dễ hỏng không đảm bảo vệ sinh'}
                        </p>
                      </button>
                      
                      {item.category === 'perishable' && (
                        <button
                          onClick={() => handleConditionChange(item.id, 'need_check')}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            selectedItem.condition === 'need_check'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-blue-600">fact_check</span>
                            <p className={`text-sm font-bold ${
                              selectedItem.condition === 'need_check'
                                ? 'text-blue-900 dark:text-blue-100'
                                : 'text-slate-900 dark:text-white'
                            }`}>
                              Nhân viên tiêu thụ
                            </p>
                          </div>
                          <p className="text-xs text-slate-500">
                            Còn an toàn, nhân viên có thể ăn/uống
                          </p>
                        </button>
                      )}
                    </div>
                  ) : item.category === 'packaged' ? (
                    // Tình trạng cho hàng đóng gói
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleConditionChange(item.id, 'good')}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedItem.condition === 'good'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <p className={`text-sm font-bold mb-1 ${
                          selectedItem.condition === 'good'
                            ? 'text-emerald-900 dark:text-emerald-100'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          Còn nguyên seal
                        </p>
                        <p className="text-xs text-slate-500">Trả nhà cung cấp</p>
                      </button>
                      <button
                        onClick={() => handleConditionChange(item.id, 'opened')}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedItem.condition === 'opened'
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <p className={`text-sm font-bold mb-1 ${
                          selectedItem.condition === 'opened'
                            ? 'text-amber-900 dark:text-amber-100'
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          Đã mở
                        </p>
                        <p className="text-xs text-slate-500">Tiêu hủy</p>
                      </button>
                    </div>
                  ) : (
                    // Tình trạng cho hàng thông thường
                    <div className="grid grid-cols-2 gap-2">
                      {returnConditions.map((cond) => (
                        <button
                          key={cond.value}
                          onClick={() => handleConditionChange(item.id, cond.value)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            selectedItem.condition === cond.value
                              ? `border-${cond.color}-500 bg-${cond.color}-50 dark:bg-${cond.color}-900/20`
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <p
                            className={`text-sm font-bold mb-1 ${
                              selectedItem.condition === cond.value
                                ? `text-${cond.color}-900 dark:text-${cond.color}-100`
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {cond.label}
                          </p>
                          <p className="text-xs text-slate-500">{cond.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                    Ghi chú (không bắt buộc)
                  </label>
                  <textarea
                    value={selectedItem.reasonNote || ''}
                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    placeholder="VD: Đế giày bị bong, size không vừa..."
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                  />
                </div>

                {/* Summary */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      Giá trị {returnType === 'return' ? 'hoàn' : 'trả'}:
                    </span>
                    <span className="text-lg font-black text-primary">
                      {selectedItem.returnAmount?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span className="material-symbols-outlined text-sm">warehouse</span>
                    <span>
                      Nhập vào:{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedItem.warehouse === 'main'
                          ? 'Kho bán lại'
                          : selectedItem.warehouse === 'defective'
                          ? 'Kho lỗi'
                          : selectedItem.warehouse === 'clearance'
                          ? 'Kho giảm giá'
                          : 'Kho chờ kiểm tra'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {selectedItems.size === 0 && (
        <div className="text-center py-8 text-slate-400">
          <span className="material-symbols-outlined text-5xl mb-2 block">
            shopping_cart
          </span>
          <p className="text-sm">Chưa chọn sản phẩm nào</p>
        </div>
      )}
    </div>
  )
}
