import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { mockCashbookSummary, mockCashbookTransactions } from '../mock/cashbook'
import type { CashbookTransaction } from '../types/cashbook'

const CashbookPage = () => {
  const navigate = useNavigate()
  const [transactions] = useState<CashbookTransaction[]>(mockCashbookTransactions)
  const summary = mockCashbookSummary

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-xs font-black px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl tracking-widest uppercase">Hoàn thành</span>
      case 'PENDING':
        return <span className="text-xs font-black px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl tracking-widest uppercase">Đang chờ</span>
      case 'CANCELLED':
        return <span className="text-xs font-black px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl tracking-widest uppercase">Đã hủy</span>
      default:
        return null
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CASH': return 'payments'
      case 'TRANSFER': return 'account_balance'
      case 'CARD': return 'credit_card'
      default: return 'receipt_long'
    }
  }
  
  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'CASH': return 'Tiền mặt'
      case 'TRANSFER': return 'Chuyển khoản'
      case 'CARD': return 'Thẻ tín dụng'
      default: return method
    }
  }

  return (
    <DashboardLayout title="Sổ quỹ tổng quan" breadcrumb={[{ label: 'Sổ quỹ' }, { label: 'Sổ quỹ tổng quan' }]}>
      <div className="space-y-8 animate-fade-in pb-12">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
              placeholder="Tìm kiếm phiếu thu/chi..." 
              type="text"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/payment-voucher')} 
              className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm transition-all hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[18px] text-rose-500">remove_circle</span>
              Lập phiếu chi
            </button>
            <button 
              onClick={() => navigate('/receipt-voucher')} 
              className="flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary/95 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Lập phiếu thu
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-6">
              <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">trending_up</span>
              </div>
              <span className="text-[11px] font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 rounded-xl uppercase tracking-widest">+{summary.incomeChangePercent}%</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng thu</p>
            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{summary.totalIncome.toLocaleString()}đ</h3>
          </div>
          
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-6">
              <div className="size-12 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">trending_down</span>
              </div>
              <span className="text-[11px] font-black text-rose-600 bg-rose-100 dark:bg-rose-900/40 px-3 py-1.5 rounded-xl uppercase tracking-widest">{summary.expenseChangePercent}%</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng chi</p>
            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{summary.totalExpense.toLocaleString()}đ</h3>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-3xl border border-primary/20 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform origin-top-right"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Tồn quỹ tiền mặt</p>
            <h3 className="text-3xl font-black tracking-tight text-primary">{summary.cashBalance.toLocaleString()}đ</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-end gap-5 shadow-sm">
          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Khoảng thời gian</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold py-3.5 px-4 focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none">
              <option>Tháng này (01/10 - 31/10)</option>
              <option>Tháng trước</option>
              <option>Hôm nay</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại phiếu</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold py-3.5 px-4 focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none">
              <option>Tất cả các loại</option>
              <option>Phiếu thu</option>
              <option>Phiếu chi</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Người tạo</label>
            <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold py-3.5 px-4 focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none">
              <option>Tất cả nhân viên</option>
              <option>Admin User</option>
              <option>Nguyễn Văn A</option>
            </select>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors">
               <span className="material-symbols-outlined text-[18px]">filter_list</span>
               Lọc kết quả
             </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã phiếu</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Loại</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Số tiền</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phương thức</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người tạo</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {transactions.map(t => (
                  <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-primary hover:underline cursor-pointer tracking-tight">{t.code}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-[10px] font-black tracking-widest uppercase ${t.type === 'IN' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                        <span className={`size-1.5 rounded-full ${t.type === 'IN' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {t.type === 'IN' ? 'Thu' : 'Chi'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{t.time.split(' ')[0]}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.time.split(' ')[1]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className={`text-sm font-black tracking-tight ${t.type === 'IN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {t.type === 'IN' ? '+' : '-'}{t.amount.toLocaleString()}đ
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">{getMethodIcon(t.method)}</span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{getMethodLabel(t.method)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-tight">{t.creator}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {getStatusBadge(t.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị 1-4 của 1.240 phiếu</span>
            <div className="flex gap-1.5">
              <button className="size-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="size-8 flex items-center justify-center rounded-xl bg-primary text-white text-xs font-black shadow-lg shadow-primary/20">1</button>
              <button className="size-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">2</button>
              <button className="size-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">3</button>
              <button className="size-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default CashbookPage
