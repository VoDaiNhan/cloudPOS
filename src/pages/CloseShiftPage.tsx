import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'

const CloseShiftPage = () => {
  const navigate = useNavigate()
  const [actualCash, setActualCash] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Mock shift data
  const shiftData = {
    employee: 'Nguyễn Văn A',
    startTime: '08:00',
    startDate: '05/03/2026',
    branch: 'Chi nhánh Quận 1, TP. HCM',
    openingCash: 2000000,
    cashRevenue: 12000000,
    transferRevenue: 3500000,
    expenses: -500000,
  }

  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`

  const totalRevenue = shiftData.cashRevenue + shiftData.transferRevenue
  const expectedCash = shiftData.openingCash + shiftData.cashRevenue + shiftData.expenses
  const difference = actualCash > 0 ? actualCash - expectedCash : 0

  const handleCloseShift = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Shift closed:', { actualCash, difference })
    setIsLoading(false)
    navigate('/login')
  }

  return (
    <DashboardLayout title="Kết thúc ca bán hàng">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 lg:px-10 py-10 min-h-[calc(100vh-80px)]">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white lg:text-4xl uppercase">
            Kết thúc ca bán hàng
          </h1>
          <p className="text-slate-400 text-base font-medium">
            Vui lòng kiểm tra và đối soát kỹ thông tin doanh thu trước khi đóng ca.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ─── Left Column: Shift Info ─── */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary text-2xl">info</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">1. Thông tin ca làm việc</h2>
              </div>

              <div className="space-y-1">
                {/* Employee */}
                <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-400 font-bold text-sm">Nhân viên</span>
                  <span className="font-black text-slate-900 dark:text-white">{shiftData.employee}</span>
                </div>
                {/* Start Time */}
                <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-400 font-bold text-sm">Thời gian bắt đầu</span>
                  <div className="text-right">
                    <p className="font-black text-slate-900 dark:text-white">{shiftData.startTime}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{shiftData.startDate}</p>
                  </div>
                </div>
                {/* Current Time */}
                <div className="flex justify-between items-center py-4 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-400 font-bold text-sm">Thời gian hiện tại</span>
                  <div className="text-right">
                    <p className="font-black text-slate-900 dark:text-white">{currentTime}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentDate}</p>
                  </div>
                </div>
              </div>

              {/* Revenue Summary */}
              <div className="mt-8 bg-primary/5 dark:bg-primary/10 rounded-2xl p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Doanh thu hệ thống tính toán
                </p>
                <p className="text-4xl font-black text-primary tracking-tight">
                  {totalRevenue.toLocaleString('vi-VN')} <span className="text-lg">đ</span>
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">Tiền mặt:</span>
                    <span className="font-black text-slate-700 dark:text-slate-300">{shiftData.cashRevenue.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold">Chuyển khoản / Thẻ:</span>
                    <span className="font-black text-slate-700 dark:text-slate-300">{shiftData.transferRevenue.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Reconciliation ─── */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary text-2xl">edit_document</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">2. Nhập liệu đối soát</h2>
              </div>

              <div className="space-y-6">
                {/* Opening Cash */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiền đầu ca</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={shiftData.openingCash.toLocaleString('vi-VN')}
                      readOnly
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4 px-5 text-slate-500 font-bold cursor-not-allowed"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">đ</span>
                  </div>
                </div>

                {/* Cash Revenue + Expenses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Doanh thu tiền mặt</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={shiftData.cashRevenue.toLocaleString('vi-VN')}
                        readOnly
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4 px-5 text-slate-500 font-bold cursor-not-allowed"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">đ</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Thu/Chi trong ca</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={shiftData.expenses.toLocaleString('vi-VN')}
                        readOnly
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4 px-5 text-rose-500 font-bold cursor-not-allowed"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">đ</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Actual Cash Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Tiền thực tế trong két</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={actualCash > 0 ? actualCash.toLocaleString('vi-VN') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '')
                        setActualCash(Number(raw))
                      }}
                      placeholder="Nhập số tiền mặt thực tế"
                      className="w-full border-2 border-primary rounded-2xl py-5 px-5 text-slate-900 dark:text-white font-black text-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 placeholder:font-medium placeholder:text-base"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-primary font-black">đ</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">
                    Đếm toàn bộ tiền mặt đang có trong ngăn kéo.
                  </p>
                </div>

                {/* Difference */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-black text-slate-500">Chênh lệch:</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">(Thực tế − Hệ thống)</p>
                  </div>
                  <span className={`text-2xl font-black ${
                    difference === 0 ? 'text-slate-900 dark:text-white' :
                    difference > 0 ? 'text-emerald-600' : 'text-rose-500'
                  }`}>
                    {actualCash > 0 ? `${difference > 0 ? '+' : ''}${difference.toLocaleString('vi-VN')}` : '0'} đ
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleCloseShift}
                disabled={isLoading}
                className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-black py-5 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/25 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">lock</span>
                    <span>Xác nhận đóng ca</span>
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/pos')}
                className="w-full mt-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 font-bold py-3 px-6 rounded-xl transition-all text-sm"
              >
                Quay lại trang bán hàng
              </button>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}

export default CloseShiftPage

