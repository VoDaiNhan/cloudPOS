import { useState, useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { stockCancellationService } from '../services/stockCancellationService'
import type { StockCancellationItem, CancellationReason } from '../types/stockCancellation'

const StockCancellationPage = () => {
  const [items, setItems] = useState<StockCancellationItem[]>([])
  const [reason, setReason] = useState<CancellationReason>('damage')
  const [note, setNote] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const updateQuantity = (id: string, qty: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, cancellationQuantity: Math.max(0, qty) } : item
    ))
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const totalLoss = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.cancellationQuantity * item.costPrice), 0)
  }, [items])

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await stockCancellationService.create({
        reason,
        notes: note,
        items: items.map(i => ({ productId: i.id, quantity: i.cancellationQuantity, unitPrice: i.costPrice, reason })),
      })
      alert('Đã tạo phiếu hủy hàng thành công!')
      setItems([])
    } catch (err) {
      console.error('Failed to create cancellation:', err)
      alert('Không thể tạo phiếu hủy hàng')
    } finally {
      setIsLoading(false)
    }
  }

  const getReasonLabel = (r: CancellationReason) => {
    switch (r) {
      case 'damage': return 'Hư hỏng'
      case 'expired': return 'Hết hạn'
      case 'loss': return 'Thất thoát'
      case 'other': return 'Khác'
    }
  }

  return (
    <DashboardLayout title="Tạo phiếu hủy hàng" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Hủy hàng' }]}>
      <div className="grid grid-cols-12 gap-8 pb-12 animate-fade-in">
        
        {/* Left Column: Product Selection & Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Header & Description */}
          <div className="mb-2">
             <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Ghi nhận hàng hóa bị hư hỏng hoặc thất thoát trong kho.</p>
          </div>

          {/* Product Search */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3">Tìm kiếm sản phẩm cần hủy</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên sản phẩm hoặc mã SKU..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Products List Table */}
          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Danh sách sản phẩm hủy</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 font-black text-slate-400 uppercase tracking-widest text-[10px]">
                    <th className="px-8 py-5">Sản phẩm</th>
                    <th className="px-4 py-5 text-center">ĐVT</th>
                    <th className="px-4 py-5 text-center w-32">Số lượng</th>
                    <th className="px-6 py-5 text-right font-black">Giá vốn</th>
                    <th className="px-8 py-5 text-right font-black">Hao hụt</th>
                    <th className="px-4 py-5 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                  {items.map(item => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-[13px] text-slate-900 dark:text-white tracking-tight">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">SKU: {item.sku}</span>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span className="text-xs font-bold text-slate-500">{item.unit}</span>
                      </td>
                      <td className="px-4 py-6">
                        <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl px-2 py-1.5 border border-slate-100 dark:border-slate-800 group-focus-within:border-primary/20 transition-all">
                          <input 
                            type="number" 
                            min="1"
                            value={item.cancellationQuantity} 
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent border-none text-center focus:ring-0 text-sm font-black text-slate-900 dark:text-white"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{item.costPrice.toLocaleString()}đ</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{(item.cancellationQuantity * item.costPrice).toLocaleString()}đ</span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="size-8 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 text-center border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-80">Có {items.length} sản phẩm trong danh sách hủy</p>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Summary */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Reason and Notes */}
          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md space-y-8">
            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-5">
              Chi tiết phiếu hủy
            </h3>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lý do hủy hàng</label>
              <div className="grid grid-cols-2 gap-3">
                {(['damage', 'expired', 'loss', 'other'] as const).map(r => (
                  <label key={r} className="cursor-pointer relative">
                    <input 
                      type="radio" 
                      name="reason" 
                      className="peer sr-only" 
                      checked={reason === r}
                      onChange={() => setReason(r)}
                    />
                    <div className="px-3 py-3 text-center text-xs font-bold rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 peer-checked:bg-primary/5 peer-checked:border-primary/50 peer-checked:text-primary transition-all">
                      {getReasonLabel(r)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú chi tiết</label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-5 rounded-2xl border-none bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 text-xs font-bold transition-all resize-none min-h-[120px]" 
                placeholder="Nhập mô tả chi tiết tình trạng hàng hóa..." 
              />
            </div>
          </div>

          {/* Summary & Confirmation */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/10 p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Tổng giá trị hao hụt</span>
              <span className="text-4xl font-black text-primary tracking-tighter">{totalLoss.toLocaleString()}đ</span>
            </div>
            
            <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 rounded-r-2xl flex gap-4 items-start shadow-sm">
              <span className="material-symbols-outlined text-amber-500 shrink-0">warning</span>
              <p className="text-[11px] text-amber-900 dark:text-amber-200 font-bold leading-relaxed">
                <span className="uppercase tracking-wider mr-1">Lưu ý:</span>Hành động này sẽ ngay lập tức giảm số lượng tồn kho của các sản phẩm trên. Không thể hoàn tác.
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                )}
                {isLoading ? 'Đang xử lý...' : 'Xác nhận hủy hàng'}
              </button>
              <button className="w-full py-4 bg-white dark:bg-slate-900/50 text-slate-500 border-2 border-white dark:border-slate-800 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm">
                Hủy bỏ và quay lại
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default StockCancellationPage
