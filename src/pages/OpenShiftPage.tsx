import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const OpenShiftPage = () => {
  const navigate = useNavigate()
  const [cashAmount, setCashAmount] = useState(0)
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Current date/time display
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`

  const quickAmounts = [100000, 200000, 500000, 1000000]

  const handleQuickAdd = (amount: number) => {
    setCashAmount((prev) => prev + amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate opening shift
    await new Promise((resolve) => setTimeout(resolve, 1200))
    console.log('Shift opened:', { cashAmount, note, time: timeStr })
    setIsLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-display selection:bg-primary/20">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-xl">cloud_done</span>
          </div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">CloudPOS</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all border border-slate-100 dark:border-slate-800">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
              NV
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Nguyễn Văn A</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white dark:bg-slate-950 rounded-3xl shadow-2xl shadow-slate-300/30 dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
          {/* Card Header */}
          <div className="bg-primary px-10 py-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Mở ca bán hàng</h1>
              <p className="text-white/50 text-sm font-medium leading-relaxed">
                Vui lòng kiểm tra thông tin và nhập số tiền mặt trong két để bắt đầu phiên làm việc mới.
              </p>
            </div>
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-40 h-full bg-white/10 skew-x-[-20deg] translate-x-20" />
            <div className="absolute top-0 right-0 w-20 h-full bg-white/5 skew-x-[-20deg] translate-x-8" />
            <div className="absolute -bottom-4 -left-4 size-24 rounded-full bg-white/5" />
          </div>

          {/* Form Content */}
          <form className="p-10 space-y-8" onSubmit={handleSubmit}>
            {/* Staff & Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhân viên mở ca</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                  <input
                    type="text"
                    value="Nguyễn Văn A"
                    readOnly
                    className="w-full pl-12 pr-4 h-14 rounded-2xl border-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thời gian mở ca</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">schedule</span>
                  <input
                    type="text"
                    value={timeStr}
                    readOnly
                    className="w-full pl-12 pr-4 h-14 rounded-2xl border-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Cash Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số tiền đầu ca (VNĐ)</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-2xl">payments</span>
                <input
                  type="text"
                  value={cashAmount > 0 ? cashAmount.toLocaleString('vi-VN') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setCashAmount(Number(raw))
                  }}
                  placeholder="0"
                  className="w-full pl-14 pr-16 h-16 text-2xl font-black rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">VNĐ</span>
              </div>
              <div className="flex gap-2 pt-1">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAdd(amount)}
                    className="whitespace-nowrap px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-primary/10 hover:text-primary transition-all border border-slate-100 dark:border-slate-700"
                  >
                    + {(amount / 1000).toLocaleString('vi-VN')}.000
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú nếu có (ví dụ: tình trạng két, tiền lẻ...)"
                rows={3}
                className="w-full p-5 rounded-2xl border-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-primary text-white rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    <span>Đang mở ca...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                    <span>Bắt đầu bán hàng</span>
                  </>
                )}
              </button>
              <p className="text-center mt-5 text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-60">
                Bằng cách bắt đầu, hệ thống sẽ ghi nhận thời gian làm việc của bạn.
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-50">
        <p>© 2024 CloudPOS System - Phiên bản 4.2.0</p>
      </footer>
    </div>
  )
}

export default OpenShiftPage
