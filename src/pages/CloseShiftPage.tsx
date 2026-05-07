import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { shiftService, type BackendShift } from '../services/shiftService'

const CloseShiftPage = () => {
  const navigate = useNavigate()
  const [actualCash, setActualCash] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [shift, setShift] = useState<BackendShift | null>(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCurrentShift = async () => {
      setIsLoading(true)
      setError('')
      try {
        const currentShift = await shiftService.getCurrent()
        setShift(currentShift)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải ca hiện tại.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrentShift()
  }, [])

  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const currentDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`

  const paymentMethods = shift?.paymentMethods ?? []
  const cashRevenue = paymentMethods
    .filter((payment) => payment.method.toLowerCase().includes('cash') || payment.method.toLowerCase().includes('tiền mặt'))
    .reduce((sum, payment) => sum + payment.amount, 0)
  const transferRevenue = Math.max((shift?.totalRevenue ?? 0) - cashRevenue, 0)
  const totalRevenue = shift?.totalRevenue ?? 0
  const openingCash = shift?.openingAmount ?? 0
  const expectedCash = shift?.systemAmount ?? openingCash + cashRevenue
  const difference = actualCash > 0 ? actualCash - expectedCash : 0

  const handleCloseShift = async () => {
    if (!shift) {
      setError('Không có ca đang mở để đóng.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const closedShift = await shiftService.close(shift.id, actualCash, note.trim() || undefined)
      navigate('/end-shift-report', { state: { shiftId: closedShift.id } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đóng ca. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal size="full" closeOnBackdrop={false}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Kết thúc ca bán hàng</h1>
          <p className="text-slate-400 text-xs font-medium mt-0.5">{shift?.shiftCode ?? 'Ca hiện tại'}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="size-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Shift Info */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 space-y-1">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">info</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">1. Thông tin ca làm việc</h2>
            </div>
            {[
              { label: 'Nhân viên', value: shift?.userName ?? 'Tài khoản' },
              { label: 'Thời gian bắt đầu', value: shift ? new Date(shift.openedAt).toLocaleString('vi-VN') : '—' },
              { label: 'Thời gian hiện tại', value: `${currentTime} — ${currentDate}` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-slate-400 font-bold text-sm">{row.label}</span>
                <span className="font-black text-slate-900 dark:text-white text-sm">{row.value}</span>
              </div>
            ))}
            <div className="mt-5 bg-primary/5 dark:bg-primary/10 rounded-xl p-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Doanh thu hệ thống tính toán</p>
              <p className="text-3xl font-black text-primary tracking-tight">
                {totalRevenue.toLocaleString('vi-VN')} <span className="text-base">đ</span>
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold">Tiền mặt:</span>
                  <span className="font-black text-slate-700 dark:text-slate-300">{cashRevenue.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold">Chuyển khoản / Thẻ:</span>
                  <span className="font-black text-slate-700 dark:text-slate-300">{transferRevenue.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reconciliation */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary">edit_document</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">2. Nhập liệu đối soát</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiền đầu ca</label>
                <div className="relative">
                  <input type="text" value={openingCash.toLocaleString('vi-VN')} readOnly
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-500 font-bold cursor-not-allowed text-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">đ</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Doanh thu tiền mặt</label>
                <div className="relative">
                  <input type="text" value={cashRevenue.toLocaleString('vi-VN')} readOnly
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-slate-500 font-bold cursor-not-allowed text-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">đ</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
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
                  className="w-full border-2 border-primary rounded-xl py-4 px-4 text-slate-900 dark:text-white font-black text-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 placeholder:font-medium placeholder:text-base"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-black">đ</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex justify-between items-center">
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
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú đóng ca nếu có"
              rows={3}
              className="w-full p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium placeholder:text-slate-400"
            />
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleCloseShift}
                disabled={isLoading || !shift}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/25 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span><span>Đang xử lý...</span></>
                ) : (
                  <><span className="material-symbols-outlined">lock</span><span>Xác nhận đóng ca</span></>
                )}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 font-bold py-3 px-6 rounded-xl transition-all text-sm border border-slate-200 dark:border-slate-700"
              >
                Quay lại trang bán hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CloseShiftPage
