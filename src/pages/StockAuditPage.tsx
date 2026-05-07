import { useState, useMemo, useEffect } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { stockAuditService, type AuditSession } from '../services/stockAuditService'
import type { StockAuditItem } from '../types/stockAudit'

const StockAuditPage = () => {
  const [items, setItems] = useState<StockAuditItem[]>([])
  const [recentSessions, setRecentSessions] = useState<AuditSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const sessions = await stockAuditService.getAll()
        setRecentSessions(sessions)
      } catch (err) {
        console.error('Failed to load audit sessions:', err)
      }
    }
    load()
  }, [])

  const filteredItems = useMemo(
    () => items.filter(item =>
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [items, searchTerm]
  )

  const totalDifference = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.actualCount - item.systemCount), 0)
  }, [items])

  const updateActualCount = (id: string, count: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, actualCount: count, difference: count - item.systemCount }
      }
      return item
    }))
  }

  const updateReason = (id: string, reason: StockAuditItem['reason']) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, reason }
      }
      return item
    }))
  }

  const handleComplete = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Stock audit completed:', items)
    setIsLoading(false)
  }

  return (
    <DashboardLayout title="Kiểm kê kho hàng" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Kiểm kho' }]}>
      <div className="space-y-8 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-slate-500 text-sm">Quản lý và điều chỉnh số lượng tồn kho thực tế của cửa hàng.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 rounded-xl hover:shadow-md transition-all">
              <span className="material-symbols-outlined text-lg">file_download</span>
              Xuất Excel
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
              <span className="material-symbols-outlined text-lg">add</span>
              Tạo phiếu kiểm kho
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          {/* Left Column: Form Kiểm Kho */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">edit_document</span>
                  Chi tiết phiếu kiểm
                </h3>
                <span className="text-[10px] font-black px-2.5 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-widest">Đang soạn thảo</span>
              </div>
              <div className="p-8 space-y-8">
                {/* Search Product */}
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Tìm kiếm sản phẩm</label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 focus-within:border-primary/40 transition-all">
                    <span className="material-symbols-outlined text-slate-400 mr-3 text-xl">barcode_scanner</span>
                    <input 
                      disabled
                      className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-bold placeholder:text-slate-300" 
                      placeholder="Nhập tên sản phẩm hoặc mã vạch (F2)..." 
                      type="text"
                    />
                    <button className="ml-2 text-primary font-black text-[11px] uppercase tracking-widest hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">Chọn nhanh</button>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400 font-bold italic ml-1">* Nhấn F2 để quét mã vạch hoặc Alt+S để tìm nhanh</p>
                </div>

                {/* Inventory Table */}
                <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-2xl">
                  {/* Search filter */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative max-w-sm">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                      <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 h-9 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                        placeholder="Tìm sản phẩm theo tên hoặc SKU..."
                      />
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 font-black text-slate-400 uppercase tracking-widest text-[10px]">
                        <th className="px-6 py-4">Sản phẩm</th>
                        <th className="px-6 py-4 text-center w-28">Hệ thống</th>
                        <th className="px-6 py-4 text-center w-32">Thực tế</th>
                        <th className="px-6 py-4 text-center w-28">Chênh lệch</th>
                        <th className="px-6 py-4 w-56">Lý do điều chỉnh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">Không tìm thấy sản phẩm nào.</td>
                        </tr>
                      ) : filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">barcode</span> SKU: {item.sku}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center font-black text-slate-600 dark:text-slate-400 text-sm">{item.systemCount}</td>
                          <td className="px-6 py-5">
                            <input 
                              type="number"
                              value={item.actualCount}
                              onChange={(e) => updateActualCount(item.id, Number(e.target.value))}
                              className="w-full text-center bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary/20 py-2.5 font-black text-slate-900 dark:text-white text-sm" 
                            />
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${item.difference < 0 ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : item.difference > 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-400 bg-slate-50 dark:bg-slate-900'}`}>
                              {item.difference > 0 ? `+${item.difference}` : item.difference}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <select 
                              value={item.reason}
                              onChange={(e) => updateReason(item.id, e.target.value as StockAuditItem['reason'])}
                              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20 py-2.5 appearance-none"
                            >
                              <option value="hu-hong">Hư hỏng</option>
                              <option value="that-thoat">Thất thoát</option>
                              <option value="khac">Khác / Định kỳ</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 dark:border-slate-800 gap-6">
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-primary/20">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/5">
                      <span className="material-symbols-outlined text-primary text-xl">person</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-tight">Nhân viên kiểm</p>
                      <p className="text-[13px] font-black text-slate-900 dark:text-white tracking-tight">Nguyễn Văn A</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-center w-full sm:w-auto">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 opacity-60">Tổng chênh lệch</p>
                      <p className={`text-2xl font-black tracking-tighter ${totalDifference < 0 ? 'text-rose-600' : totalDifference > 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                        {totalDifference > 0 ? `+${totalDifference}` : totalDifference} SP
                      </p>
                    </div>
                    <button 
                      onClick={handleComplete}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none bg-primary text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-xl">task_alt</span>
                      )}
                      {isLoading ? 'Đang xử lý...' : 'Hoàn tất kiểm kho'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent History & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Đợt kiểm gần đây
                </h3>
                <button className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Xem tất cả</button>
              </div>
              <div className="p-2 space-y-1">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl cursor-pointer transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-black text-slate-900 dark:text-white text-sm group-hover:text-primary transition-colors tracking-tight">{session.code}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${session.status === 'balanced' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                        {session.status === 'balanced' ? 'Đã cân bằng' : 'Đã hủy'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      <span>{session.dateTime}</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-bold uppercase opacity-60">VN: {session.auditor}</span>
                      <span className="text-slate-900 dark:text-white font-black">{session.totalProducts} SP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-primary/3 dark:bg-primary/5 rounded-3xl border border-primary/10 p-6 space-y-6 relative overflow-hidden group hover:border-primary/20 transition-all">
              <div className="absolute -right-4 -top-4 size-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
              <h4 className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">analytics</span>
                Thống kê tháng này
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-primary/5 shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Số lần kiểm</p>
                  <p className="text-xl font-black text-primary tracking-tighter">24</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-primary/5 shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hụt kho (trđ)</p>
                  <p className="text-xl font-black text-rose-500 tracking-tighter">1.2</p>
                </div>
              </div>
            </div>

            {/* Help/Note Card */}
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-200/50 dark:border-amber-800/30 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-lg">info</span>
                </div>
                <div className="text-[11px] text-amber-900 dark:text-amber-200 space-y-3">
                  <p className="font-black uppercase tracking-widest text-amber-600 dark:text-amber-500">Lưu ý khi kiểm kho</p>
                  <ul className="space-y-2 font-bold leading-relaxed opacity-80">
                    <li className="flex items-start gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                       Tạm dừng tất cả giao dịch bán hàng của sản phẩm đang kiểm.
                    </li>
                    <li className="flex items-start gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                       Đảm bảo các phiếu nhập hàng đã được duyệt trước đó.
                    </li>
                    <li className="flex items-start gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                       Hệ thống sẽ tự động tạo phiếu điều chỉnh sau khi hoàn tất.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StockAuditPage
