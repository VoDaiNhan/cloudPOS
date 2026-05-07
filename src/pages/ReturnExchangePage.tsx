import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { ReturnItemSelector } from '../components/ReturnItemSelector'
import { ReturnSummary } from '../components/ReturnSummary'
import { ReturnDetailModal } from '../components/ReturnDetailModal'
import { BarcodeScanner } from '../components/BarcodeScanner'
import type { ReturnOrder, ReturnType, ReturnOrderItem, RefundMethod } from '../types/returnExchange'
import { sampleReturnOrders, sampleOrders } from '../mock/returnExchange'
import { useReturnInventoryStore } from '../store/returnInventoryStore'

export const ReturnExchangePage = () => {
  const navigate = useNavigate()
  const addItemToInventory = useReturnInventoryStore(state => state.addItem)
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('list')
  const [returnType, setReturnType] = useState<ReturnType>('return')
  const [returns, setReturns] = useState<ReturnOrder[]>(sampleReturnOrders)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [searchOrderNumber, setSearchOrderNumber] = useState('')
  const [selectedItems, setSelectedItems] = useState<Partial<ReturnOrderItem>[]>([])
  const [currentStep, setCurrentStep] = useState(1) // 1: Chọn loại, 2: Tìm đơn, 3: Chọn SP, 4: Xác nhận
  const [viewingReturn, setViewingReturn] = useState<ReturnOrder | null>(null)

  // States for filter grid
  const [filterQuery, setFilterQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const handleBarcodeScanned = (code: string) => {
    if (code.startsWith('HD-')) {
      setSearchOrderNumber(code)
      handleSearchOrder(code)
      return
    }

    if (selectedOrder) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = selectedOrder.items.find((i: any) => i.barcode === code)
      if (item) {
        alert(`Đã quét: ${item.productName}`)
      } else {
        alert('Không tìm thấy sản phẩm với mã vạch này trong đơn hàng')
      }
    } else {
      const order = sampleOrders.find((o) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        o.items.some((i: any) => i.barcode === code)
      )
      if (order) {
        setSelectedOrder(order)
        setSearchOrderNumber(order.orderNumber)
        setCurrentStep(3)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = order.items.find((i: any) => i.barcode === code)
        alert(`Tìm thấy đơn hàng ${order.orderNumber} - Sản phẩm: ${item?.productName || 'Không rõ'}`)
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
    } else {
      alert('Không tìm thấy hóa đơn')
    }
  }

  const handleItemsSelected = (items: Partial<ReturnOrderItem>[]) => {
    setSelectedItems(items)
  }

  const handleConfirmReturn = (refundMethod: RefundMethod, notes?: string) => {
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
    
    selectedItems.forEach(item => {
      addItemToInventory({
        id: `ret-inv-${Date.now()}-${Math.random()}`,
        orderRef: newReturn.returnNumber,
        productName: item.productName || 'Sản phẩm không rõ',
        sku: item.productId || 'UNKNOWN',
        quantity: item.returnQuantity || 1,
        status: 'Mới',
        discountPercentage: 0,
        createdAt: new Date().toLocaleDateString('vi-VN')
      })
    })

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

  const filteredReturns = returns.filter(ret => {
     const queryMatch = ret.returnNumber.toLowerCase().includes(filterQuery.toLowerCase()) || 
                        ret.originalOrderNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
                        (ret.customerName || '').toLowerCase().includes(filterQuery.toLowerCase())
     const statusMatch = statusFilter === 'all' || ret.status === statusFilter
     return queryMatch && statusMatch
  })

  return (
    <DashboardLayout title="Đổi trả hàng" breadcrumb={[{ label: 'Giao dịch' }, { label: 'Đổi trả hàng' }]}>
      <div className="bg-surface-container-low min-h-[calc(100vh-8rem)] rounded-xl -mt-8 -mx-8 px-10 pt-10 pb-12 animate-fade-in relative">
        
        {/* VIEW: BẢNG DANH SÁCH (THEO GIAO DIỆN CODE.HTML) */}
        {activeTab === 'list' && (
          <div className="animate-fade-in">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <nav className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-widest">
                  <span>Quản lý đơn hàng</span>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <span className="text-primary font-bold">Đổi trả hàng</span>
                </nav>
                <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface">Quản lý Đổi trả hàng</h2>
              </div>
              <button 
                onClick={() => setActiveTab('create')}
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-semibold shadow-lg hover:shadow-primary-fixed/30 transition-all active:scale-95 text-sm ghost-shadow"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                <span>Tạo phiếu trả mới</span>
              </button>
            </div>

            {/* Filter Bento Grid */}
            <div className="grid grid-cols-12 gap-6 mb-8">
              <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/10">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-[0.75rem] font-medium uppercase tracking-widest text-on-surface-variant">Tìm kiếm thông tin</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                      <input 
                        className="w-full bg-transparent border-0 border-b-2 border-surface-container-highest focus:ring-0 focus:border-primary px-10 py-2 transition-all placeholder:text-slate-300 font-bold" 
                        placeholder="Mã phiếu, mã hóa đơn hoặc tên khách..." 
                        type="text"
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-64 space-y-2">
                    <label className="text-[0.75rem] font-medium uppercase tracking-widest text-on-surface-variant">Khoảng thời gian</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">calendar_month</span>
                      <input 
                        className="w-full bg-transparent border-0 border-b-2 border-surface-container-highest focus:ring-0 focus:border-primary px-10 py-2 transition-all text-sm font-bold text-slate-700" 
                        type="text" 
                        value="01/10/2023 - 31/10/2023"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/10">
                <div className="space-y-2">
                  <label className="text-[0.75rem] font-medium uppercase tracking-widest text-on-surface-variant">Trạng thái xử lý</label>
                  <div className="flex gap-2 pt-1 flex-wrap">
                    <button 
                       onClick={() => setStatusFilter('all')}
                       className={`px-4 py-2 ${statusFilter === 'all' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant hover:bg-primary/10'} rounded-full text-xs font-bold transition-all`}
                    >
                      Tất cả
                    </button>
                    <button 
                       onClick={() => setStatusFilter('pending')}
                       className={`px-4 py-2 ${statusFilter === 'pending' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant hover:bg-primary/10'} rounded-full text-xs font-bold transition-all`}
                    >
                      Chờ xử lý
                    </button>
                    <button 
                       onClick={() => setStatusFilter('completed')}
                       className={`px-4 py-2 ${statusFilter === 'completed' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-on-surface-variant hover:bg-primary/10'} rounded-full text-xs font-bold transition-all`}
                    >
                      Đã hoàn tiền
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-none">
                      <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Mã phiếu trả</th>
                      <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Mã HD gốc</th>
                      <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Ngày trả</th>
                      <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Khách hàng</th>
                      <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant text-right">Giá trị trả</th>
                      <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">Hình thức hoàn</th>
                      <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant text-center">Trạng thái</th>
                      <th className="px-6 py-5 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {filteredReturns.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400">Không tìm thấy phiếu nào đáp ứng điều kiện</td>
                      </tr>
                    ) : (
                      filteredReturns.map((ret, index) => {
                         const bgColors = ['bg-secondary-fixed text-on-secondary-fixed', 'bg-tertiary-fixed text-on-tertiary-fixed', 'bg-primary-fixed text-on-primary-fixed', 'bg-slate-200 text-slate-600']
                         const safeCust = ret.customerName || "Khách lẻ"
                         const cAvatar = safeCust === "Khách lẻ" ? "KL" : safeCust.replace(/[^A-Z]/g, '').slice(0, 2) || safeCust.slice(0,2).toUpperCase()
                         
                         return (
                          <tr key={ret.id} className="hover:bg-surface-container-high transition-colors group cursor-pointer" onClick={() => navigate('/customer-return')}>
                            <td className="px-6 py-4">
                              <span className="font-bold text-primary">{ret.returnNumber}</span>
                            </td>
                            <td className="px-6 py-4 text-on-surface-variant font-medium">{ret.originalOrderNumber}</td>
                            <td className="px-6 py-4 text-on-surface-variant">
                              {new Date(ret.returnDate).toLocaleString('vi-VN', {
                                  day: '2-digit', month: '2-digit', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${bgColors[index % 4]} flex items-center justify-center text-[10px] font-bold`}>
                                  {cAvatar}
                                </div>
                                <span className="font-semibold text-sm">{ret.customerName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-on-surface text-right border-x-0">
                               {Math.abs(ret.netAmount).toLocaleString('vi-VN')}₫
                            </td>
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                                <span className="material-symbols-outlined text-sm">
                                  {ret.refundMethod === 'cash' ? 'payments' : ret.refundMethod === 'bank_transfer' ? 'account_balance' : 'account_balance_wallet'}
                                </span> 
                                {ret.refundMethod === 'cash' ? 'Tiền mặt' : ret.refundMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Công nợ'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter ${
                                ret.status === 'completed'
                                  ? 'bg-secondary-container text-on-secondary-container'
                                  : ret.status === 'pending'
                                  ? 'bg-surface-variant text-outline'
                                  : 'bg-error-container text-on-error-container'
                              }`}>
                                {ret.status === 'completed' ? 'Đã hoàn tiền' : ret.status === 'pending' ? 'Chờ xử lý' : 'Từ chối'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => navigate('/customer-return')} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                <span className="material-symbols-outlined">visibility</span>
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Placeholder */}
              <div className="flex items-center justify-between px-6 py-6 border-t border-outline-variant/10">
                <p className="text-sm text-on-surface-variant font-medium">Hiển thị <span className="font-bold text-on-surface">1 - {filteredReturns.length}</span> trong số <span className="font-bold text-on-surface">{filteredReturns.length}</span> phiếu trả</p>
                <div className="flex items-center gap-1">
                   {/* Dummy pagination mirroring layout */}
                   <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all">
                     <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
                   </button>
                   <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-container text-white font-bold shadow-md">1</button>
                   <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all text-on-surface-variant font-semibold">2</button>
                   <span className="px-2 text-outline">...</span>
                   <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all">
                     <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                   </button>
                </div>
              </div>
            </div>

            {/* Dashboard Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-primary-container rounded-xl text-white shadow-xl flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <span className="material-symbols-outlined text-3xl">currency_exchange</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/70">Tổng hoàn tiền {new Date().getMonth() + 1}/{new Date().getFullYear()}</p>
                  <h3 className="text-2xl font-black">
                    {returns.filter(r => r.status === 'completed').reduce((sum, r) => sum + Math.abs(r.refundAmount), 0).toLocaleString('vi-VN')}₫
                  </h3>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-outline-variant/10 flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">assignment_returned</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Số phiếu trong tháng</p>
                  <h3 className="text-2xl font-black text-on-surface">{returns.length} Phiếu</h3>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-outline-variant/10 flex items-center gap-6">
                <div className="w-14 h-14 bg-orange-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-orange-600">pending_actions</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Đang chờ xử lý</p>
                  <h3 className="text-2xl font-black text-on-surface">{returns.filter(r => r.status === 'pending').length} Đơn</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TẠO MỚI (CHỐNG TRÀN VÀ ĐỒNG BỘ CSS) */}
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto pt-4 animate-fade-in">
             <div className="mb-8 flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-black tracking-tight text-on-surface mb-1">Quy trình Tạo Phiếu Đổi/Trả</h2>
                   <p className="text-sm text-on-surface-variant">Thực hiện các bước để hoàn trả hàng hoặc thay đổi đơn cho khách.</p>
                </div>
                <button 
                  onClick={() => { setActiveTab('list'); handleReset(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                  Hủy tạo
                </button>
             </div>
             
             {currentStep === 1 && (
               <div className="bg-surface-container-lowest rounded-2xl p-8 ghost-shadow border border-outline-variant/10">
                 <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                   <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">1</span>
                   Chọn phân loại tác vụ
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {returnTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setReturnType(type.value)}
                        className={`p-6 rounded-2xl border-2 transition-all text-left group ${
                          returnType === type.value
                            ? 'border-primary bg-primary-fixed/20'
                            : 'border-surface-container hover:border-outline-variant/50 hover:bg-surface-container-low'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-4xl mb-4 block ${returnType === type.value ? 'text-primary' : 'text-outline group-hover:text-primary transition-colors'}`}>
                          {type.icon}
                        </span>
                        <h4 className="text-lg font-black mb-2 text-on-surface">{type.label}</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{type.description}</p>
                      </button>
                    ))}
                 </div>
                 <div className="mt-8 flex justify-end">
                    <button onClick={() => setCurrentStep(2)} className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:brightness-110 flex items-center gap-2">
                       Tiếp theo <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                 </div>
               </div>
             )}

            {currentStep === 2 && (
              <div className="bg-surface-container-lowest rounded-2xl p-8 ghost-shadow border border-outline-variant/10">
                <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                  <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">2</span>
                  Tìm hóa đơn gốc
                </h3>
                <BarcodeScanner onScan={handleBarcodeScanned} autoFocus />
                <div className="my-6 flex items-center gap-3">
                  <div className="flex-1 h-px bg-surface-container"></div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Hoặc tra cứu thủ công</span>
                  <div className="flex-1 h-px bg-surface-container"></div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input
                      type="text"
                      value={searchOrderNumber}
                      onChange={(e) => setSearchOrderNumber(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchOrder()}
                      placeholder="Nhập mã hóa đơn (VD: HD-2024-001)"
                      className="w-full rounded-xl border-none bg-surface-container-low pl-12 pr-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all placeholder:text-outline"
                    />
                  </div>
                  <button
                    onClick={() => handleSearchOrder()}
                    className="px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">search</span>
                    Tra cứu
                  </button>
                </div>
                
                {selectedOrder && (
                   <div className="mt-8 p-6 bg-secondary-fixed/30 rounded-2xl border border-secondary-fixed">
                     <div className="flex items-center gap-3 mb-4 text-on-secondary-fixed-variant">
                         <span className="material-symbols-outlined">receipt_long</span>
                         <span className="font-bold">Hóa đơn {selectedOrder.orderNumber} - {selectedOrder.customerName}</span>
                     </div>
                     <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setCurrentStep(1)} className="px-6 py-2 rounded-lg font-bold text-sm text-outline hover:bg-surface-container">Quay lại</button>
                        <button onClick={() => setCurrentStep(3)} className="px-6 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:brightness-110 flex items-center gap-1">Chuyển sang Nhập món <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
                     </div>
                   </div>
                )}
              </div>
            )}

            {currentStep === 3 && selectedOrder && (
              <div className="bg-surface-container-lowest rounded-2xl p-8 ghost-shadow border border-outline-variant/10">
                <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                  <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">3</span>
                  Chọn sản phẩm cần đổi/trả
                </h3>
                <ReturnItemSelector
                  orderItems={selectedOrder.items}
                  onItemsSelected={handleItemsSelected}
                  returnType={returnType}
                />
                <div className="mt-8 flex justify-between items-center border-t border-surface-container pt-6">
                  <button onClick={() => setCurrentStep(2)} className="px-6 py-3 rounded-xl font-bold text-sm text-outline hover:bg-surface-container flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      Quay lại chọn HĐ
                  </button>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:brightness-110 shadow-md flex items-center gap-2"
                    >
                      Kiểm tra tóm tắt
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && selectedOrder && (
              <div className="bg-surface-container-lowest rounded-2xl p-8 ghost-shadow border border-outline-variant/10">
                <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                  <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">4</span>
                  Tóm tắt & Hoàn tất
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

      </div>

      {viewingReturn && (
        <ReturnDetailModal
          returnOrder={viewingReturn}
          onClose={() => setViewingReturn(null)}
          onPrint={() => alert('Đang gửi lệnh đến máy in...')}
        />
      )}
    </DashboardLayout>
  )
}
