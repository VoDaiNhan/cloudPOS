import { useNavigate } from 'react-router-dom'
import { mockShiftReport } from '../mock/shiftReport'
import { Modal } from '../components/Modal'

const EndShiftReportPage = () => {
  const navigate = useNavigate()
  const report = mockShiftReport

  return (
    <Modal size="full" closeOnBackdrop={false}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
        <div className="flex items-center gap-3">
          <div className="text-primary flex items-center justify-center p-2 rounded-xl bg-primary/10">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Báo cáo kết thúc ca</h2>
            <p className="text-slate-400 text-xs">{report.shiftId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">print</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center rounded-xl h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="px-8 py-6">
        {/* Revenue Highlight */}
        <div className="mb-8">
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl p-8 bg-linear-to-br from-primary to-indigo-600 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" />
            <p className="text-white/80 text-[11px] font-black uppercase tracking-widest">Tổng doanh thu ca</p>
            <p className="text-4xl font-black tracking-tight">{report.totalRevenue.toLocaleString()}đ</p>
          </div>
        </div>

        {/* General Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Nhân viên', value: report.employeeName },
            { label: 'Thời gian bắt đầu', value: report.startTime },
            { label: 'Thời gian kết thúc', value: report.endTime },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-slate-900 dark:text-white font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Payment methods & Order stats */}
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined text-[18px]">payments</span></div>
                Phương thức thanh toán
              </h4>
              <div className="space-y-1">
                {report.paymentMethods.map((pm, i) => (
                  <div key={i} className="flex justify-between items-center py-3 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg border-b border-slate-50 dark:border-slate-800/30 last:border-0">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{pm.method}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{pm.amount.toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500"><span className="material-symbols-outlined text-[18px]">analytics</span></div>
                Thống kê đơn hàng
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-center">
                  <p className="text-emerald-600 text-[10px] font-black uppercase mb-1">Thành công</p>
                  <p className="text-3xl font-black text-emerald-600">{report.orderStats.successful}</p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800/50 text-center">
                  <p className="text-rose-600 text-[10px] font-black uppercase mb-1">Đã hủy</p>
                  <p className="text-3xl font-black text-rose-600">{String(report.orderStats.cancelled).padStart(2, '0')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Cash reconciliation */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            <h4 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4 mb-5">
              <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500"><span className="material-symbols-outlined text-[18px]">account_balance_wallet</span></div>
              Đối soát tiền mặt
            </h4>
            <div className="space-y-4">
              <div>
                <span className="text-slate-500 text-[11px] font-black tracking-widest uppercase">Hệ thống ghi nhận</span>
                <p className="text-xl font-black mt-1 text-slate-900 dark:text-white">{report.cashReconciliation.systemRecorded.toLocaleString()}đ</p>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] font-black tracking-widest uppercase">Thực tế bàn giao</span>
                <p className="text-xl font-black mt-1 text-slate-900 dark:text-white">{report.cashReconciliation.actualHandover.toLocaleString()}đ</p>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700" />
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
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-8 pb-8 pt-4 flex flex-col sm:flex-row gap-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky bottom-0">
        <button className="flex-1 flex items-center justify-center gap-2 rounded-xl h-12 bg-primary text-white font-black uppercase tracking-widest text-[13px] hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
          <span className="material-symbols-outlined">print</span>
          In báo cáo
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl h-12 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest text-[13px] hover:bg-slate-100 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <span className="material-symbols-outlined">dashboard</span>
          Về Dashboard
        </button>
      </div>
    </Modal>
  )
}

export default EndShiftReportPage
