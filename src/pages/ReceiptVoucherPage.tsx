import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockUnpaidSalesOrders } from '../mock/voucher'
import type { ReceiptCategory } from '../types/voucher'
import { Modal } from '../components/Modal'

const hoverTransition = 'transition-all duration-200 ease-in-out'

const ReceiptVoucherPage = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ReceiptCategory>('SALES')
  const [amount, setAmount] = useState<string>('0')

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setAmount(val)
  }

  const formatCurrency = (val: string) => {
    if (!val) return '0'
    return parseInt(val, 10).toLocaleString('vi-VN')
  }

  return (
    <Modal size="full" closeOnBackdrop={false}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Tạo phiếu thu mới</h2>
            <p className="text-slate-500 text-xs font-medium">Quản lý dòng tiền</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center justify-center rounded-xl px-5 h-9 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm ${hoverTransition} hover:bg-slate-200 dark:hover:bg-slate-700`}
          >
            Hủy
          </button>
          <button className={`flex items-center justify-center rounded-xl px-6 h-9 bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 ${hoverTransition} hover:-translate-y-0.5`}>
            Lưu phiếu
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-xl size-9 bg-rose-50 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">info</span>
                Thông tin cơ bản
              </h3>

              {/* Loại thu selection */}
              <div className="mb-6">
                <p className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-3">Loại thu <span className="text-rose-500">*</span></p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'SALES', icon: 'shopping_cart', label: 'Bán hàng' },
                    { id: 'DEBT_COLLECTION', icon: 'person_add', label: 'Thu nợ khách' },
                    { id: 'OTHER', icon: 'payments', label: 'Thu khác' },
                  ].map((cat) => (
                    <label key={cat.id} onClick={() => setCategory(cat.id as ReceiptCategory)} className="cursor-pointer">
                      <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${category === cat.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/30'} ${hoverTransition}`}>
                        <span className={`material-symbols-outlined mb-2 ${category === cat.id ? 'text-primary' : 'text-slate-400'}`}>{cat.icon}</span>
                        <span className={`text-sm font-bold ${category === cat.id ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>{cat.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Đối tượng nộp <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all" placeholder="Tìm tên khách hàng, SĐT..." type="text" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Liên kết chứng từ</label>
                  <div className="relative">
                    <select className="appearance-none w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all cursor-pointer">
                      <option value="">Chọn đơn hàng chưa thanh toán</option>
                      {mockUnpaidSalesOrders.map(order => (
                        <option key={order.id} value={order.id}>
                          {order.code} - {order.amount.toLocaleString('vi-VN')}đ ({order.customer})
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Ghi chú</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all resize-none" placeholder="Nhập mô tả chi tiết khoản thu..." rows={3} />
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">currency_exchange</span>
                Thanh toán
              </h3>
              <div className="mb-5">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold block mb-2">Số tiền thu <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input className="w-full pl-4 pr-16 py-4 text-xl font-black text-primary rounded-xl border-2 border-primary/20 bg-primary/5 focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="0" type="text" value={formatCurrency(amount)} onChange={handleAmountChange} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 font-black tracking-widest text-sm">VNĐ</span>
                </div>
              </div>
              <div className="mb-5">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold block mb-2">Phương thức thanh toán</label>
                <div className="relative">
                  <select className="appearance-none w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all cursor-pointer">
                    <option value="CASH">Tiền mặt</option>
                    <option value="TRANSFER">Chuyển khoản</option>
                    <option value="CARD">Quẹt thẻ</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold block mb-2">Thời gian thu</label>
                <input className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-4 rounded-2xl flex gap-3">
              <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1.5 self-start">help</span>
              <div>
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Cần hỗ trợ?</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Phiếu thu sẽ được tự động hạch toán vào sổ quỹ và báo cáo doanh thu cuối ngày.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ReceiptVoucherPage
