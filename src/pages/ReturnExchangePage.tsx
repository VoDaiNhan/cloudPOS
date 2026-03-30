import { useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ReturnItemSelector } from '../components/ReturnItemSelector'
import { ReturnSummary } from '../components/ReturnSummary'
import { ReturnDetailModal } from '../components/ReturnDetailModal'
import { BarcodeScanner } from '../components/BarcodeScanner'
import type { ReturnOrder, ReturnType, ReturnOrderItem, RefundMethod } from '../types/returnExchange'
import { sampleReturnOrders, sampleOrders, defaultReturnPolicy } from '../mock/returnExchange'
import { validateFoodReturn, checkExpiry } from '../utils/foodReturnHandler'
import type { ProductCategory } from '../types/foodReturnPolicy'

export const ReturnExchangePage = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')
  const [returnType, setReturnType] = useState<ReturnType>('return')
  const [returns, setReturns] = useState<ReturnOrder[]>(sampleReturnOrders)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [searchOrderNumber, setSearchOrderNumber] = useState('')
  const [selectedItems, setSelectedItems] = useState<Partial<ReturnOrderItem>[]>([])
  const [currentStep, setCurrentStep] = useState(1) // 1: Chọn loại, 2: Tìm đơn, 3: Chọn SP, 4: Xác nhận
  const [viewingReturn, setViewingReturn] = useState<ReturnOrder | null>(null)
  const [foodValidations, setFoodValidations] = useState<Record<string, any>>({})

  const handleBarcodeScanned = (code: string) => {
    // Kiểm tra xem có phải mã đơn hàng không
    if (code.startsWith('HD-')) {
      setSearchOrderNumber(code)
      handleSearchOrder(code)
      return
    }

    // Tìm sản phẩm theo mã vạch trong đơn hàng đã chọn
    if (selectedOrder) {
      const item = selectedOrder.items.find((i: any) => i.barcode === code)
      if (item) {
        alert(`Đã quét: ${item.productName}`)
        // Tự động chọn sản phẩm này
      } else {
        alert('Không tìm thấy sản phẩm với mã vạch này trong đơn hàng')
      }
    } else {
      // Tìm đơn hàng có chứa sản phẩm này
      const order = sampleOrders.find((o) =>
        o.items.some((i: any) => i.barcode === code)
      )
      if (order) {
        setSelectedOrder(order)
        setSearchOrderNumber(order.orderNumber)
        setCurrentStep(3)
        const item = order.items.find((i: any) => i.barcode === code)
        alert(`Tìm thấy đơn hàng ${order.orderNumber} - Sản phẩm: ${item.productName}`)
      } else {
        alert('Không tìm thấy đơn hàng nào chứa sản phẩm này')
      }
    }
  }

  const handleSearchOrder = (orderNumber?: string) => {
    const searchCode = orderNumber || searchOrderNumber
    const order = sampleOrders.find((o) => o.orderNumber === searchCode)
    if (order) {
      setSelectedOrder(order)
      setCurrentStep(3)
      
      // Validate các món ăn/uống
      const validations: Record<string, any> = {}
      order.items.forEach((item: any) => {
        if (item.category && ['food', 'beverage', 'perishable', 'packaged'].includes(item.category)) {
          const validation = validateFoodReturn(
            item.category as ProductCategory,
            order.orderDate,
            item.servedAt || order.servedDate,
            'quality_issue', // Mặc định
            item.price,
            false,
            item.expiryDate
          )
          validations[item.id] = validation

          // Kiểm tra hạn nếu có
          if (item.expiryDate) {
            const expiryCheck = checkExpiry(item.expiryDate, item.category as ProductCategory)
            validations[item.id].expiryCheck = expiryCheck
          }
        }
      })
      setFoodValidations(validations)
    } else {
      alert('Không tìm thấy hóa đơn')
    }
  }

  const handleItemsSelected = (items: Partial<ReturnOrderItem>[]) => {
    setSelectedItems(items)
  }

  const handleConfirmReturn = (refundMethod: RefundMethod, notes?: string) => {
    // Tạo phiếu trả hàng mới
    const newReturn: ReturnOrder = {
      id: `return-${Date.now()}`,
      returnNumber: `${returnType === 'cancel' ? 'CN' : returnType === 'return' ? 'RT' : 'EX'}-2024-${String(returns.length + 1).padStart(3, '0')}`,
      type: returnType,
      originalOrderId: selectedOrder.id,
      originalOrderNumber: selectedOrder.orderNumber,
      originalOrderDate: selectedOrder.orderDate,
      originalOrderTotal: selectedOrder.total,
      customerId: selectedOrder.customerId,
      customerName: selectedOrder.customerName,
      customerPhone: selectedOrder.customerPhone,
      items: selectedItems as ReturnOrderItem[],
      subtotal: selectedItems.reduce((sum, item) => sum + (item.returnAmount || 0), 0),
      refundAmount: returnType === 'return' || returnType === 'cancel' 
        ? selectedItems.reduce((sum, item) => sum + (item.returnAmount || 0), 0)
        : 0,
      additionalCharge: 0,
      netAmount: returnType === 'return' || returnType === 'cancel'
        ? -selectedItems.reduce((sum, item) => sum + (item.returnAmount || 0), 0)
        : 0,
      refundMethod,
      status: 'completed',
      requiresApproval: false,
      notes,
      returnDate: new Date().toISOString(),
      createdBy: 'staff-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setReturns([newReturn, ...returns])
    
    // Reset form
    setSelectedOrder(null)
    setSelectedItems([])
    setSearchOrderNumber('')
    setCurrentStep(1)
    setActiveTab('list')
    
    alert(`Đã tạo phiếu ${newReturn.returnNumber} thành công!`)
  }

  const handleReset = () => {
    setSelectedOrder(null)
    setSelectedItems([])
    setSearchOrderNumber('')
    setCurrentStep(1)
  }

  const returnTypes = [
    {
      value: 'cancel' as ReturnType,
      label: 'Hủy giao dịch',
      icon: 'cancel',
      color: 'rose',
      description: 'Hủy hóa đơn vừa tạo sai',
    },
    {
      value: 'return' as ReturnType,
      label: 'Trả hàng hoàn tiền',
      icon: 'keyboard_return',
      color: 'blue',
      description: 'Khách trả hàng và lấy lại tiền',
    },
    {
      value: 'exchange' as ReturnType,
      label: 'Đổi hàng',
      icon: 'swap_horiz',
      color: 'emerald',
      description: 'Khách đổi sang sản phẩm khác',
    },
  ]

  const tabs = [
    { id: 'create', label: 'Tạo phiếu mới', icon: 'add_circle' },
    { id: 'list', label: 'Danh sách phiếu', icon: 'list_alt' },
  ]

  return (
    <DashboardLayout
      title="Đổi trả hàng"
      breadcrumb={[{ label: 'Giao dịch' }, { label: 'Đổi trả hàng' }]}
    >
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-blue-600 text-2xl">
                assignment_return
              </span>
              <span className="text-2xl font-black text-blue-900 dark:text-blue-100">
                {returns.length}
              </span>
            </div>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
              Tổng phiếu đổi trả
            </p>
          </div>

          <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-emerald-600 text-2xl">
                check_circle
              </span>
              <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
                {returns.filter((r) => r.status === 'completed').length}
              </span>
            </div>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              Đã hoàn thành
            </p>
          </div>

          <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-amber-600 text-2xl">
                pending
              </span>
              <span className="text-2xl font-black text-amber-900 dark:text-amber-100">
                {returns.filter((r) => r.status === 'pending').length}
              </span>
            </div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">Chờ xử lý</p>
          </div>

          <div className="rounded-2xl border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-rose-600 text-2xl">
                payments
              </span>
              <span className="text-2xl font-black text-rose-900 dark:text-rose-100">
                {returns
                  .reduce((sum, r) => sum + Math.abs(r.refundAmount), 0)
                  .toLocaleString('vi-VN')}
                đ
              </span>
            </div>
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Đã hoàn tiền</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Step 1: Choose Return Type */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">
                  1
                </span>
                Chọn loại giao dịch
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {returnTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setReturnType(type.value)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      returnType === type.value
                        ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-4xl mb-3 block ${
                        returnType === type.value
                          ? `text-${type.color}-600`
                          : 'text-slate-400'
                      }`}
                    >
                      {type.icon}
                    </span>
                    <h4
                      className={`text-lg font-black mb-2 ${
                        returnType === type.value
                          ? `text-${type.color}-900 dark:text-${type.color}-100`
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {type.label}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Search Original Order */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">
                  2
                </span>
                Tìm hóa đơn gốc hoặc quét mã vạch
              </h3>

              {/* Barcode Scanner */}
              <BarcodeScanner onScan={handleBarcodeScanned} autoFocus />

              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-xs font-bold text-slate-400 uppercase">Hoặc</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              </div>

              {/* Manual Search */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchOrderNumber}
                    onChange={(e) => setSearchOrderNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchOrder()}
                    placeholder="Nhập mã hóa đơn (VD: HD-2024-001)"
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleSearchOrder()}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">search</span>
                  Tìm kiếm
                </button>
              </div>

              {/* Order Info */}
              {selectedOrder && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                        Hóa đơn: {selectedOrder.orderNumber}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Ngày: {new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')} {new Date(selectedOrder.orderDate).toLocaleTimeString('vi-VN')}
                      </p>
                      {selectedOrder.servedDate && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          Phục vụ: {new Date(selectedOrder.servedDate).toLocaleTimeString('vi-VN')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                        Khách hàng
                      </p>
                      <p className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                        {selectedOrder.customerName}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any) => {
                      const validation = foodValidations[item.id]
                      const isFoodItem = item.category && ['food', 'beverage', 'perishable', 'packaged'].includes(item.category)
                      
                      return (
                        <div
                          key={item.id}
                          className="flex items-start justify-between p-3 rounded-lg bg-white dark:bg-slate-900"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-slate-900 dark:text-white">
                                {item.productName}
                              </p>
                              {isFoodItem && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                                  {item.category === 'food' ? '🍽️ Đồ ăn' : 
                                   item.category === 'beverage' ? '☕ Đồ uống' :
                                   item.category === 'perishable' ? '🥖 Dễ hỏng' : '📦 Đóng gói'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mb-1">
                              SL: {item.quantity} × {item.price.toLocaleString('vi-VN')}đ
                              {item.barcode && ` • Mã: ${item.barcode}`}
                            </p>
                            
                            {/* Food Validation Info */}
                            {validation && (
                              <div className="mt-2 space-y-1">
                                {validation.canReturn ? (
                                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    <span>Cho phép trả • Hoàn {validation.refundPercentage}%</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-xs text-rose-600">
                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                    <span>{validation.reason}</span>
                                  </div>
                                )}
                                
                                {validation.expiryCheck && (
                                  <div className={`flex items-center gap-1 text-xs ${
                                    validation.expiryCheck.isExpired ? 'text-rose-600' :
                                    validation.expiryCheck.isNearExpiry ? 'text-amber-600' : 'text-emerald-600'
                                  }`}>
                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                    <span>
                                      {validation.expiryCheck.isExpired ? 
                                        `Hết hạn ${Math.abs(validation.expiryCheck.daysUntilExpiry)} ngày` :
                                        `Còn ${validation.expiryCheck.daysUntilExpiry} ngày`}
                                    </span>
                                  </div>
                                )}
                                
                                {validation.requiresApproval && (
                                  <div className="flex items-center gap-1 text-xs text-amber-600">
                                    <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                                    <span>Cần quản lý phê duyệt</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="font-black text-slate-900 dark:text-white ml-4">
                            {item.total.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      Tổng cộng:
                    </span>
                    <span className="text-xl font-black text-emerald-900 dark:text-emerald-100">
                      {selectedOrder.total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Coming soon message */}
            {selectedOrder && currentStep === 3 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">
                    3
                  </span>
                  Chọn sản phẩm và điền thông tin
                </h3>

                <ReturnItemSelector
                  orderItems={selectedOrder.items}
                  onItemsSelected={handleItemsSelected}
                  returnType={returnType}
                />

                {selectedItems.length > 0 && (
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                    >
                      Tiếp tục
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirm */}
            {selectedOrder && currentStep === 4 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">
                    4
                  </span>
                  Xác nhận và hoàn tất
                </h3>

                <ReturnSummary
                  items={selectedItems}
                  returnType={returnType}
                  onConfirm={handleConfirmReturn}
                  onCancel={() => setCurrentStep(3)}
                />
              </div>
            )}
          </div>
        )}

        {/* List Tab */}
        {activeTab === 'list' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Danh sách phiếu đổi trả
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                      Mã phiếu
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                      Loại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                      Khách hàng
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-500">
                      Số tiền
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-black uppercase text-slate-500">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                      Ngày tạo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {returns.map((ret) => (
                    <tr
                      key={ret.id}
                      onClick={() => setViewingReturn(ret)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {ret.returnNumber}
                        </p>
                        <p className="text-xs text-slate-500">{ret.originalOrderNumber}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            ret.type === 'cancel'
                              ? 'bg-rose-100 text-rose-700'
                              : ret.type === 'return'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {ret.type === 'cancel'
                            ? 'Hủy'
                            : ret.type === 'return'
                            ? 'Trả hàng'
                            : 'Đổi hàng'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {ret.customerName}
                        </p>
                        <p className="text-xs text-slate-500">{ret.customerPhone}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p
                          className={`font-black ${
                            ret.netAmount < 0
                              ? 'text-rose-600'
                              : ret.netAmount > 0
                              ? 'text-emerald-600'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {ret.netAmount < 0 ? '-' : ret.netAmount > 0 ? '+' : ''}
                          {Math.abs(ret.netAmount).toLocaleString('vi-VN')}đ
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            ret.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : ret.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {ret.status === 'completed'
                            ? 'Hoàn thành'
                            : ret.status === 'pending'
                            ? 'Chờ xử lý'
                            : 'Từ chối'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(ret.returnDate).toLocaleDateString('vi-VN')}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewingReturn && (
        <ReturnDetailModal
          returnOrder={viewingReturn}
          onClose={() => setViewingReturn(null)}
          onPrint={() => {
            alert('Chức năng in phiếu sẽ được phát triển sau')
          }}
        />
      )}
    </DashboardLayout>
  )
}
