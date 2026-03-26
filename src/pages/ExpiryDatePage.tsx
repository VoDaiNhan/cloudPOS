import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useProductStore } from '../store/productStore'
import { formatDisplayDate } from '../utils/stockBatchUtils'

const ExpiryDatePage = () => {
  const { expiryBatches, expirySummary } = useProductStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'EXPIRED' | 'NEAR_EXPIRY' | 'SAFE' | 'NO_EXPIRY'>('ALL')
  const [windowFilter, setWindowFilter] = useState<'7' | '15' | '30' | '90' | 'ALL'>('30')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const filteredBatches = useMemo(() => {
    return expiryBatches.filter((batch) => {
      const keyword = searchTerm.trim().toLowerCase()
      const matchesKeyword =
        !keyword ||
        batch.productName.toLowerCase().includes(keyword) ||
        batch.sku.toLowerCase().includes(keyword) ||
        batch.batchNumber.toLowerCase().includes(keyword)

      const matchesStatus = statusFilter === 'ALL' ? true : batch.status === statusFilter

      const matchesWindow =
        windowFilter === 'ALL'
          ? true
          : batch.daysDifference === null
            ? false
            : batch.daysDifference <= Number(windowFilter)

      return matchesKeyword && matchesStatus && matchesWindow
    })
  }, [expiryBatches, searchTerm, statusFilter, windowFilter])

  const priorityBatches = useMemo(
    () => expiryBatches.filter((batch) => batch.priorityRank === 1 && batch.isSellable).slice(0, 5),
    [expiryBatches]
  )
  const expiredBatches = useMemo(
    () => expiryBatches.filter((batch) => batch.status === 'EXPIRED'),
    [expiryBatches]
  )

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / pageSize))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, windowFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedBatches = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBatches.slice(start, start + pageSize)
  }, [currentPage, filteredBatches])

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + 4)
    const adjustedStart = Math.max(1, end - 4)
    return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i)
  }, [currentPage, totalPages])

  const startIndex = filteredBatches.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, filteredBatches.length)
  
  return (
    <DashboardLayout title="Hạn sử dụng" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Hạn sử dụng' }]}>
      <div className="flex flex-col gap-8 animate-fade-in pb-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">inventory</span>
              Kho hàng chính
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Quản lý Hạn sử dụng</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl font-medium">Giám sát vòng đời sản phẩm, tối ưu hóa quy trình luân chuyển hàng hóa và giảm thiểu thất thoát do hết hạn.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất báo cáo
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Kiểm kê kho
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
            <div className="size-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">event_busy</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Đã hết hạn</p>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{expirySummary.expiredCount} Lô hàng</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
            <div className="size-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">running_with_errors</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Sắp hết hạn (&lt;30 ngày)</p>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{expirySummary.nearExpiryCount} Lô hàng</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
            <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">task_alt</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Ưu tiên xuất ngay</p>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{expirySummary.priorityCount.toLocaleString()} Mặt hàng</h3>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400" 
              placeholder="Tìm kiếm sản phẩm, SKU hoặc số lô..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'EXPIRED' | 'NEAR_EXPIRY' | 'SAFE' | 'NO_EXPIRY')}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-xs font-black uppercase tracking-widest py-3 px-5 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="EXPIRED">Đã hết hạn</option>
              <option value="NEAR_EXPIRY">Sắp hết hạn</option>
              <option value="SAFE">Còn hạn</option>
              <option value="NO_EXPIRY">Không theo dõi hạn</option>
            </select>
            <select
              value={windowFilter}
              onChange={(e) => setWindowFilter(e.target.value as '7' | '15' | '30' | '90' | 'ALL')}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-xs font-black uppercase tracking-widest py-3 px-5 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="30">Thời gian: 30 ngày tới</option>
              <option value="7">7 ngày tới</option>
              <option value="15">15 ngày tới</option>
              <option value="90">90 ngày tới</option>
              <option value="ALL">Tất cả</option>
            </select>
            <button className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Tên sản phẩm</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Số lô (Batch)</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Ngày hết hạn</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Số lượng</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {paginatedBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-200/50 dark:border-slate-800/50 group-hover:scale-105 transition-transform duration-500">
                          <img src={batch.image} alt={batch.productName} className="size-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{batch.productName}</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Mã: {batch.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="space-y-2">
                        <span className="text-xs font-black tracking-widest text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-800/40 inline-flex">
                          {batch.batchNumber}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${batch.issuePolicy === 'FEFO' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}`}>
                            {batch.issuePolicy}
                          </span>
                          {batch.priorityRank === 1 && batch.isSellable && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
                              Ưu tiên xuất
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className={`text-sm font-black tracking-tight ${
                        batch.status === 'EXPIRED' ? 'text-rose-600' : batch.status === 'NEAR_EXPIRY' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {formatDisplayDate(batch.expiryDate)}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        {batch.daysDifference === null
                          ? 'Không theo dõi hạn'
                          : batch.daysDifference < 0
                            ? `Đã quá hạn ${Math.abs(batch.daysDifference)} ngày`
                            : `Còn lại ${batch.daysDifference} ngày`}
                      </p>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-black text-slate-900 dark:text-slate-200">{batch.quantity} {batch.unit}</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center">
                        {batch.status === 'EXPIRED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 uppercase tracking-widest">
                            <span className="size-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/30"></span>
                            HẾT HẠN
                          </span>
                        )}
                        {batch.status === 'NEAR_EXPIRY' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 uppercase tracking-widest">
                            <span className="size-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30"></span>
                            SẮP HẾT HẠN
                          </span>
                        )}
                        {batch.status === 'SAFE' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 uppercase tracking-widest">
                            <span className="size-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30"></span>
                            AN TOÀN
                          </span>
                        )}
                        {batch.status === 'NO_EXPIRY' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase tracking-widest">
                            <span className="size-2 rounded-full bg-slate-400 shadow-sm"></span>
                            KHÔNG DATE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">
              Hiển thị <span className="font-black text-slate-900 dark:text-white">{startIndex}-{endIndex}</span> trong số <span className="font-black text-slate-900 dark:text-white">{filteredBatches.length}</span> lô hàng sau lọc
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    page === currentPage
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        {/* Action Footer / AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-8 rounded-3xl flex items-start gap-6 relative overflow-hidden group">
            <div className="size-24 bg-primary/10 rounded-full absolute -top-10 -right-10 group-hover:scale-125 transition-transform"></div>
            <div className="p-3 bg-primary/20 rounded-2xl text-primary shrink-0 relative">
              <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
            </div>
            <div className="relative">
              <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-2">Đề xuất xuất kho FEFO/FIFO</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-5 leading-relaxed">Hệ thống đang đánh dấu <strong>{priorityBatches.length}</strong> mặt hàng cần xuất trước. Với hàng có hạn dùng, CloudPOS ưu tiên FEFO; với hàng không theo dõi hạn, hệ thống rơi về FIFO để tránh giữ lâu lô cũ trong kho.</p>
              <button className="flex items-center gap-2 text-primary text-sm font-black uppercase tracking-widest hover:translate-x-1 transition-transform">
                Xem lô ưu tiên xuất
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-8 rounded-3xl flex items-start gap-6 relative overflow-hidden group">
            <div className="size-24 bg-rose-500/10 rounded-full absolute -top-10 -right-10 group-hover:scale-125 transition-transform"></div>
            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 rounded-2xl text-rose-600 shrink-0 relative">
              <span className="material-symbols-outlined text-[28px]">delete_forever</span>
            </div>
            <div className="relative">
              <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-2">Xử lý hàng quá hạn</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-5 leading-relaxed">Hiện có <strong>{expiredBatches.length}</strong> lô hàng đã quá hạn sử dụng và cần tách khỏi luồng bán. Cần ưu tiên tạo phiếu xuất hủy hoặc đổi trả để giữ tồn khả dụng luôn đúng với lượng có thể xuất thực tế.</p>
              <button className="flex items-center gap-2 text-rose-600 text-sm font-black uppercase tracking-widest hover:translate-x-1 transition-transform">
                Tạo phiếu xuất hủy ngay
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default ExpiryDatePage
