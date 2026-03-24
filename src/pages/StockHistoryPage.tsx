import { DashboardLayout } from '../layouts/DashboardLayout'
import { mockStockHistory } from '../mock/stockHistory'
import type { StockMovementType } from '../types/stockHistory'
import { exportToExcel, exportToPDF } from '../utils/exportUtils'

const getMovementStyles = (type: StockMovementType) => {
  switch (type) {
    case 'IMPORT':
      return { icon: 'download', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Nhập kho' }
    case 'EXPORT':
      return { icon: 'upload', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', label: 'Xuất kho' }
    case 'AUDIT_ADJUSTMENT':
      return { icon: 'rule', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', label: 'Kiểm kê' }
    case 'CANCELLATION':
      return { icon: 'delete_forever', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', label: 'Hủy hàng' }
    case 'RETURN_TO_SUPPLIER':
      return { icon: 'assignment_return', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', label: 'Trả hàng NCC' }
    case 'RETURN_FROM_CUSTOMER':
      return { icon: 'assignment_return', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', label: 'Khách trả hàng' }
    default:
      return { icon: 'history', color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-500/10', label: 'Giao dịch' }
  }
}

const StockHistoryPage = () => {
  return (
    <DashboardLayout title="Lịch sử kho" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Hạn sử dụng', path: '/expiry' }, { label: 'Lịch sử biến động' }]}>
      <div className="flex flex-col gap-8 animate-fade-in pb-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">history</span>
              Lịch sử biến động kho
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Nhật ký kho hàng</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl font-medium">Theo dõi chi tiết mọi biến động nhập, xuất, kiểm kê và điều chỉnh tồn kho trong hệ thống.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => exportToExcel('Lịch sử kho')}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400" 
              placeholder="Tìm theo sản phẩm, mã SKU hoặc ID phiếu..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">calendar_today</span>
                <input 
                  type="text" 
                  className="pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 w-48"
                  placeholder="KHOẢNG THỜI GIAN"
                />
             </div>
            <select className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-xs font-black uppercase tracking-widest py-3 px-5 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
              <option value="">Tất cả loại giao dịch</option>
              <option value="IMPORT">Nhập hàng</option>
              <option value="EXPORT">Xuất hàng</option>
              <option value="AUDIT">Kiểm kê</option>
              <option value="CANCEL">Hủy hàng</option>
            </select>
            <button className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* Timeline Table */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Loại giao dịch</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Mã tham chiếu</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Biến động</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Tồn sau</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Người thực hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {mockStockHistory.map((entry) => {
                  const styles = getMovementStyles(entry.type)
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                      <td className="px-8 py-4">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{entry.date.split(' ')[0]}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">{entry.date.split(' ')[1]}</p>
                      </td>
                      <td className="px-8 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${styles.bg} ${styles.color}`}>
                          <span className="material-symbols-outlined text-[18px]">{styles.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{styles.label}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-black tracking-widest text-primary hover:underline cursor-pointer font-mono bg-primary/5 px-2 py-1 rounded-lg">
                          {entry.referenceId}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{entry.productName}</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">SKU: {entry.sku}</p>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className={`text-sm font-black ${entry.changeQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {entry.changeQuantity > 0 ? '+' : ''}{entry.changeQuantity} {entry.unit}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-center">
                        <span className="text-sm font-black text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-xl">
                          {entry.balanceAfter}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                           <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[14px] text-slate-500">person</span>
                           </div>
                           <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400">{entry.performedBy}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Hiển thị <span className="font-black text-slate-900 dark:text-white">1-5</span> trong số <span className="font-black text-slate-900 dark:text-white">1,250</span> biến động</p>
            <div className="flex gap-2.5">
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 disabled:opacity-50 cursor-pointer" disabled>Trước</button>
              <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-primary/20">1</button>
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all">...250</button>
              <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all">Sau</button>
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl shadow-slate-900/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-2 tracking-tight">Cần báo cáo chi tiết cho đối tác?</h4>
            <p className="text-slate-400 font-medium max-w-md">Sử dụng công cụ xuất dữ liệu để tạo các bản báo cáo PDF hoặc Excel chuyên nghiệp cho việc kiểm toán và đối soát cuối tháng.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <button 
              onClick={() => exportToPDF('Lịch sử kho')}
              className="px-8 py-4 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">description</span>
              BÁO CÁO PDF
            </button>
            <button 
              onClick={() => exportToExcel('Lịch sử kho')}
              className="px-8 py-4 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">table_chart</span>
              XUẤT EXCEL
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default StockHistoryPage
