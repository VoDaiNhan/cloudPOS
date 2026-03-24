import { Link } from 'react-router-dom'

// Mock transaction data — replace with real data from router state or API later
const mockTransaction = {
  id: '#CP-982341',
  plan: 'Gói Chuyên Nghiệp',
  duration: '12 tháng (đến 20/05/2025)',
  total: 12_000_000,
}

const PaymentSuccessPage = () => {
  const tx = mockTransaction

  const formatCurrency = (v: number) => v.toLocaleString('vi-VN') + 'đ'

  return (
    <div className="min-h-screen bg-[#f6f6f8] font-display flex flex-col relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 md:px-10 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-primary">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px]">cloud_done</span>
          </div>
          <span className="text-slate-900 text-lg font-black tracking-tight">CloudPOS</span>
        </Link>
        <div className="flex gap-2">
          <button className="size-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="size-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Success icon + title */}
          <div className="pt-10 pb-6 flex flex-col items-center text-center px-8">
            {/* Animated check circle */}
            <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
              <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3">Thanh toán thành công!</h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Cảm ơn bạn đã tin dùng CloudPOS.<br />
              Gói dịch vụ của bạn đã được kích hoạt thành công.
            </p>
          </div>

          {/* Transaction details */}
          <div className="px-8 py-6 bg-slate-50/60 border-y border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Chi tiết giao dịch
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Mã giao dịch</span>
                <span className="font-bold text-slate-900 font-mono">{tx.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Gói dịch vụ</span>
                <span className="font-bold text-primary">{tx.plan}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Thời hạn</span>
                <span className="font-semibold text-slate-900">{tx.duration}</span>
              </div>
              <div className="pt-3 mt-1 border-t border-slate-200 flex justify-between items-center">
                <span className="font-black text-slate-900">Tổng tiền</span>
                <span className="text-xl font-black text-slate-900">{formatCurrency(tx.total)}</span>
              </div>
            </div>
          </div>

          {/* Next steps + actions */}
          <div className="p-8">
            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-8">
              <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">info</span>
              <div>
                <p className="text-sm font-black text-slate-900 mb-0.5">Bước tiếp theo</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Truy cập trang Quản lý để thiết lập cửa hàng của bạn ngay bây giờ.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                Bắt đầu sử dụng ngay
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Tải hóa đơn
              </button>
            </div>

            {/* Support link */}
            <div className="mt-8 text-center">
              <a
                href="tel:19001234"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">help</span>
                Cần hỗ trợ? Liên hệ bộ phận CSKH
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400">
        © 2024 CloudPOS SaaS System. Tất cả quyền được bảo lưu.
      </footer>
    </div>
  )
}

export default PaymentSuccessPage
