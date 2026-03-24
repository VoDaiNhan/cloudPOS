import { useState, useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { initialSupplierReturnProducts } from '../mock/supplierReturn'
import type { SupplierReturnProduct, ReturnReason } from '../types/supplierReturn'

const SupplierReturnPage = () => {
  const [products, setProducts] = useState<SupplierReturnProduct[]>(initialSupplierReturnProducts)
  const [reason, setReason] = useState<ReturnReason>('expiry')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const summary = useMemo(() => {
    const itemCount = products.length
    const totalQuantity = products.reduce((sum, p) => sum + p.returnQuantity, 0)
    const totalValue = products.reduce((sum, p) => sum + (p.returnQuantity * p.importPrice), 0)
    return { itemCount, totalQuantity, totalValue }
  }, [products])

  const updateQuantity = (id: string, qty: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, returnQuantity: qty } : p))
  }

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleComplete = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Supplier return completed:', { products, reason, note, summary })
    setIsLoading(false)
  }

  return (
    <DashboardLayout title="Tạo phiếu trả hàng nhà cung cấp" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Trả hàng NCC' }]}>
      <div className="grid grid-cols-12 gap-8 pb-12 animate-fade-in">
        {/* Left Column: Form & Product List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Supplier Info */}
          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-xl">person</span>
              Thông tin nhà cung cấp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chọn nhà cung cấp</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 appearance-none">
                  <option>Công ty TNHH Dược phẩm Tâm An</option>
                  <option>Nhà cung cấp Thực phẩm Sạch HN</option>
                  <option>Công ty CP Thiết bị Y tế Miền Nam</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã phiếu trả</label>
                <input 
                  type="text" 
                  value="THNCC00045" 
                  readOnly 
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-sm font-black text-slate-400 cursor-not-allowed uppercase tracking-wider"
                />
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
                Danh sách sản phẩm trả
              </h3>
              <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all">
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Thêm sản phẩm
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 font-black text-slate-400 uppercase tracking-widest text-[10px]">
                    <th className="px-8 py-5">Sản phẩm</th>
                    <th className="px-6 py-5">Lô / Hạn dùng</th>
                    <th className="px-6 py-5 text-center">Tồn</th>
                    <th className="px-6 py-5 text-center w-36">SL Trả</th>
                    <th className="px-6 py-5 text-right font-black">Giá nhập</th>
                    <th className="px-8 py-5 text-right font-black">Thành tiền</th>
                    <th className="px-4 py-5 font-black"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                  {products.map(product => (
                    <tr key={product.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white text-[13px] tracking-tight">{product.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">Mã: {product.sku}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border border-rose-100/50 dark:border-rose-900/50">
                          <span className="material-symbols-outlined text-[14px]">event_busy</span>
                          Lô: {product.batchCode} - {product.expiryDate}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-xs font-black text-slate-500">{product.currentStock}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl px-2 py-1 border border-slate-100 dark:border-slate-800 group-focus-within:border-primary/20 transition-all">
                          <input 
                            type="number" 
                            value={product.returnQuantity} 
                            onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                            className="w-full bg-transparent border-none text-center focus:ring-0 text-sm font-black text-slate-900 dark:text-white"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{product.importPrice.toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-primary tracking-tight">{(product.returnQuantity * product.importPrice).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <button 
                          onClick={() => removeProduct(product.id)}
                          className="size-8 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-xl">info</span>
                <p className="text-[10px] font-black uppercase tracking-widest italic opacity-80">Hệ thống sẽ tự động trừ tồn kho ngay khi phiếu trả được hoàn tất.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm sticky top-24 transition-all hover:shadow-md">
            <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
              <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
              Tóm tắt phiếu trả
            </h3>
            
            <div className="space-y-5 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số mặt hàng trả</span>
                <span className="text-[13px] font-black text-slate-900 dark:text-white">{summary.itemCount.toString().padStart(2, '0')} sản phẩm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng số lượng trả</span>
                <span className="text-[13px] font-black text-slate-900 dark:text-white">{summary.totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng giá trị trả</span>
                <span className="text-[13px] font-black text-slate-900 dark:text-white font-mono">{summary.totalValue.toLocaleString()} đ</span>
              </div>
              <div className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-end">
                <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Cần thanh toán</span>
                <span className="text-3xl font-black text-primary tracking-tighter tabular-nums">{summary.totalValue.toLocaleString()} đ</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lý do trả hàng</label>
                <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {(['expiry', 'damage', 'other'] as const).map((r) => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="reason" 
                          checked={reason === r}
                          onChange={() => setReason(r)}
                          className="peer appearance-none size-5 rounded-full border-2 border-slate-300 dark:border-slate-700 checked:border-primary transition-all cursor-pointer"
                        />
                        <div className="absolute size-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform"></div>
                      </div>
                      <span className={`text-xs font-bold transition-colors ${reason === r ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}>
                        {r === 'expiry' && 'Hàng hết hạn sử dụng'}
                        {r === 'damage' && 'Lỗi sản xuất / Hư hỏng'}
                        {r === 'other' && 'Khác (sai SL, sai mẫu...)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none" 
                  placeholder="Nhập ghi chú thêm..."
                />
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <button 
                onClick={handleComplete}
                disabled={isLoading}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                )}
                {isLoading ? 'Đang xử lý...' : 'Hoàn tất trả hàng'}
              </button>
              <button className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                Hủy bỏ
              </button>
            </div>
          </div>

          {/* Sync Alert */}
          <div className="bg-primary/3 dark:bg-primary/5 p-6 rounded-3xl border border-primary/10 flex gap-4 group hover:border-primary/20 transition-all">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:rotate-180 duration-500">
              <span className="material-symbols-outlined text-xl">sync</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Đồng bộ tự động</p>
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed opacity-80">
                Tồn kho của các sản phẩm trên sẽ được cập nhật giảm ngay sau khi phiếu trả được xác nhận thành công.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SupplierReturnPage
