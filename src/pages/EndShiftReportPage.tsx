import { useNavigate } from 'react-router-dom'
import { mockShiftReport } from '../mock/shiftReport'
import { DashboardLayout } from '../layouts/DashboardLayout'

const EndShiftReportPage = () => {
  const navigate = useNavigate()
  const report = mockShiftReport

  const actions = (
    <div className="flex gap-2 shrink-0">
      <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors tooltip group relative">
        <span className="material-symbols-outlined">print</span>
        <span className="absolute -top-10 scale-0 transition-all rounded bg-slate-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap">In</span>
      </button>
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors tooltip group relative"
      >
        <span className="material-symbols-outlined">close</span>
        <span className="absolute -top-10 scale-0 transition-all rounded bg-slate-800 p-2 text-xs text-white group-hover:scale-100 whitespace-nowrap">Đóng</span>
      </button>
    </div>
  )

  return (
    <DashboardLayout title="Báo cáo kết thúc ca" actions={actions}>
      <div className="mx-auto flex w-full max-w-[800px] flex-col flex-1 animate-fade-in py-8 px-4">
        {/* Report Content */}
        <div className="bg-white dark:bg-slate-900 shadow-sm px-8 py-10 border border-slate-200 dark:border-slate-800 rounded-t-2xl print:shadow-none print:border-none">
          <div className="text-center mb-10">
            <h3 className="tracking-tight text-3xl font-black uppercase text-slate-900 dark:text-white mb-3">Tổng kết ca làm việc</h3>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-black tracking-widest">
              {report.shiftId}
            </div>
          </div>

          {/* General Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center md:text-left">
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1.5">Nhân viên</p>
              <p className="text-slate-900 dark:text-white font-bold text-base">{report.employeeName}</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center md:text-left">
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1.5">Thời gian bắt đầu</p>
              <p className="text-slate-900 dark:text-white font-bold text-base">{report.startTime}</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center md:text-left">
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1.5">Thời gian kết thúc</p>
              <p className="text-slate-900 dark:text-white font-bold text-base">{report.endTime}</p>
            </div>
          </div>

          {/* Revenue Highlight */}
          <div className="mb-10">
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl p-10 bg-linear-to-br from-primary to-indigo-600 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full group-hover:scale-110 transition-transform origin-top-right"></div>
              <p className="text-white/80 text-[11px] font-black uppercase tracking-widest">Tổng doanh thu ca</p>
              <p className="text-5xl font-black tracking-tight">{report.totalRevenue.toLocaleString()}đ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Payment Methods & Order Stats */}
            <div className="space-y-8">
              <div>
                <h4 className="flex items-center gap-2.5 text-[13px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined text-[18px]">payments</span></div>
                  Phương thức thanh toán
                </h4>
                <div className="space-y-1">
                  {report.paymentMethods.map((pm, i) => (
                    <div key={i} className="flex justify-between items-center py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border-b border-slate-50 dark:border-slate-800/30 last:border-0">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{pm.method}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{pm.amount.toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2.5 text-[13px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500"><span className="material-symbols-outlined text-[18px]">analytics</span></div>
                  Thống kê đơn hàng
                </h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-center">
                    <p className="text-emerald-600 dark:text-emerald-500 text-[10px] font-black tracking-widest uppercase mb-1">Thành công</p>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{report.orderStats.successful}</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-2xl border border-rose-100 dark:border-rose-800/50 text-center">
                    <p className="text-rose-600 dark:text-rose-500 text-[10px] font-black tracking-widest uppercase mb-1">Đã hủy</p>
                    <p className="text-3xl font-black text-rose-600 dark:text-rose-400">{String(report.orderStats.cancelled).padStart(2, '0')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Cash Reconciliation */}
            <div className="h-full">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700 h-full flex flex-col">
                <h4 className="flex items-center gap-2.5 text-[13px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
                  <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500"><span className="material-symbols-outlined text-[18px]">account_balance_wallet</span></div>
                  Đối soát tiền mặt
                </h4>
                
                <div className="space-y-6 flex-1">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-black tracking-widest uppercase">Hệ thống ghi nhận</span>
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{report.cashReconciliation.systemRecorded.toLocaleString()}đ</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-black tracking-widest uppercase">Thực tế bàn giao</span>
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{report.cashReconciliation.actualHandover.toLocaleString()}đ</span>
                  </div>
                  
                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-4"></div>
                  
                  <div className={`flex justify-between items-center p-4 rounded-xl border ${
                    report.cashReconciliation.difference === 0 
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' 
                      : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50'
                  }`}>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Chênh lệch</span>
                    <span className={`text-base font-black ${
                      report.cashReconciliation.difference === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {report.cashReconciliation.difference.toLocaleString()}đ {report.cashReconciliation.difference === 0 && '(Khớp)'}
                    </span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-center px-4">
                    <div className="flex flex-col gap-4">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Chữ ký nhân viên</span>
                      <div className="h-20 w-32 border-b border-slate-300 dark:border-slate-600 border-dashed opacity-50"></div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Chữ ký quản lý</span>
                      <div className="h-20 w-32 border-b border-slate-300 dark:border-slate-600 border-dashed opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white dark:bg-slate-900 border-t border-b border-x border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-4 rounded-b-2xl print:hidden">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl h-14 bg-primary text-white font-black uppercase tracking-widest text-[13px] hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
            <span className="material-symbols-outlined">print</span>
            In báo cáo
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl h-14 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest text-[13px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Về Dashboard
          </button>
        </div>
        
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium text-center mt-6 uppercase tracking-widest opacity-80 mb-6 print:block">
          CloudPOS System • Printed at {report.printedAt}
        </p>

      </div>
    </DashboardLayout>
  )
}

export default EndShiftReportPage

