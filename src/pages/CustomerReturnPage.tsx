import { useState, useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { returnService } from '../services/returnService'
import type { ReturnInvoice, RefundMethod } from '../types/customerReturn'

const defaultInvoice: ReturnInvoice = {
  id: '', invoiceCode: '', customerName: '', customerPhone: '',
  status: 'PAID', items: [],
}

const CustomerReturnPage = () => {
  const [invoice, setInvoice] = useState<ReturnInvoice>(defaultInvoice)
  const [searchQuery, setSearchQuery] = useState('')
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('cash')
  const [returnReason, setReturnReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const updateReturnQuantity = (itemId: string, qty: number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, returnQuantity: Math.max(0, Math.min(qty, item.boughtQuantity)) }
          : item
      )
    }))
  }

  const summary = useMemo(() => {
    let totalItems = 0
    let originalTotal = 0
    
    invoice.items.forEach(item => {
      totalItems += item.returnQuantity
      originalTotal += item.returnQuantity * item.unitPrice
    })

    const returnFee = 0 // 0% fee for now
    const totalRefund = originalTotal - returnFee

    return { totalItems, originalTotal, returnFee, totalRefund }
  }, [invoice])

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await returnService.getAll('customer_return')
      console.log('Customer Return Confirmed', {
        invoiceId: invoice.id,
        items: invoice.items.filter(i => i.returnQuantity > 0),
        summary,
        refundMethod,
        returnReason
      })
      alert('Đã xác nhận đơn đổi trả thành công!')
    } catch (err) {
      console.error('Failed to process return:', err)
      alert('Không thể xử lý đơn đổi trả')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout title="Tạo đơn đổi trả" breadcrumb={[{ label: 'Đối tác' }, { label: 'Đổi trả KH' }]}>
      <div className="grid grid-cols-12 gap-8 pb-12 animate-fade-in">
        
        {/* Left Column: Invoice Details & Items */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
            
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm hóa đơn theo mã hoặc SĐT khách hàng..." 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  />
               </div>
            </div>

            {/* Invoice Info */}
            <div className="flex justify-between items-start mb-6 p-6 bg-primary/2 dark:bg-primary/5 rounded-2xl border border-primary/10">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-1 tracking-tight">
                  Hóa đơn: <span className="text-primary">{invoice.invoiceCode}</span>
                </h3>
                <p className="text-xs font-bold text-slate-500">Khách hàng: {invoice.customerName} - {invoice.customerPhone}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
                {invoice.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4">Sản phẩm</th>
                    <th className="px-4 py-4 text-center">Đơn vị</th>
                    <th className="px-4 py-4 text-center w-24">Đã mua</th>
                    <th className="px-4 py-4 text-center w-32">Trả lại</th>
                    <th className="px-6 py-4 text-right">Đơn giá</th>
                    <th className="px-6 py-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {invoice.items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight">{item.name}</span>
                          {item.variantInfo && (
                            <span className="text-[11px] font-bold text-slate-400 mt-0.5">{item.variantInfo}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center text-xs font-bold text-slate-500">{item.unit}</td>
                      <td className="px-4 py-5 text-center text-xs font-black text-slate-900 dark:text-white">{item.boughtQuantity}</td>
                      <td className="px-4 py-5">
                        <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl px-2 py-1 border border-slate-100 dark:border-slate-800 group-focus-within:border-primary/20 transition-all">
                          <input 
                            type="number" 
                            min="0"
                            max={item.boughtQuantity}
                            value={item.returnQuantity} 
                            onChange={(e) => updateReturnQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent border-none text-center focus:ring-0 text-sm font-black text-primary"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right text-xs font-bold text-slate-500">
                        {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-right font-black text-slate-900 dark:text-white text-sm">
                        {(item.returnQuantity * item.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note Section */}
            <div className="mt-8 space-y-3">
              <h4 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[18px]">notes</span>
                Ghi chú lý do trả hàng
              </h4>
              <textarea 
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none" 
                placeholder="Khách không hài lòng về màu sắc, sản phẩm bị trầy xước nhẹ..." 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Payment */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm sticky top-24 transition-all hover:shadow-md flex flex-col h-fit">
            
            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
              <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
              Tóm tắt hoàn trả
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng số lượng trả</span>
                <span className="font-black text-slate-900 dark:text-white text-xs">{summary.totalItems} sản phẩm</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng tiền gốc</span>
                <span className="font-black text-slate-900 dark:text-white tabular-nums text-xs">{summary.originalTotal.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phí đổi trả (0%)</span>
                <span className="font-black text-slate-900 dark:text-white tabular-nums text-xs">{summary.returnFee.toLocaleString()} đ</span>
              </div>
              <div className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-end">
                <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Tổng tiền hoàn trả</span>
                <span className="text-3xl font-black text-primary tracking-tighter tabular-nums">{summary.totalRefund.toLocaleString()} đ</span>
              </div>
            </div>

            {/* Refund Methods */}
            <div className="space-y-4 mb-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Phương thức hoàn tiền</h4>
              <div className="grid grid-cols-1 gap-3">
                
                {/* Cash Method */}
                <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${refundMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-transparent bg-slate-50 dark:bg-slate-900 hover:border-primary/20'}`}>
                  <input 
                    type="radio" 
                    name="payment_method" 
                    value="cash"
                    checked={refundMethod === 'cash'}
                    onChange={() => setRefundMethod('cash')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${refundMethod === 'cash' ? 'border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                      <div className={`size-2.5 rounded-full bg-primary scale-0 transition-transform ${refundMethod === 'cash' ? 'scale-100' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 dark:text-white">Tiền mặt</span>
                      <span className="text-[10px] font-bold text-slate-500">Hoàn trả ngay lập tức</span>
                    </div>
                  </div>
                </label>

                {/* Debt Method */}
                <label className={`relative flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${refundMethod === 'debt' ? 'border-primary bg-primary/5' : 'border-transparent bg-slate-50 dark:bg-slate-900 hover:border-primary/20'}`}>
                  <input 
                    type="radio" 
                    name="payment_method" 
                    value="debt"
                    checked={refundMethod === 'debt'}
                    onChange={() => setRefundMethod('debt')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${refundMethod === 'debt' ? 'border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                      <div className={`size-2.5 rounded-full bg-primary scale-0 transition-transform ${refundMethod === 'debt' ? 'scale-100' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 dark:text-white">Cộng vào công nợ</span>
                      <span className="text-[10px] font-bold text-slate-500">Trừ vào các hóa đơn sau</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mt-auto">
              <button 
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:shadow-xl hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                )}
                {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi trả'}
              </button>
              <button className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                Hủy bỏ
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex gap-4 mt-6">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">info</span>
            <div>
              <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Chính sách đổi trả</h5>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                Sản phẩm đổi trả phải còn nguyên tem mác và hóa đơn mua hàng trong vòng 30 ngày kể từ ngày xuất kho.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default CustomerReturnPage
