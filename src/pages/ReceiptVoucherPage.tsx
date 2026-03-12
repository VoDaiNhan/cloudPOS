import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockUnpaidSalesOrders } from '../mock/voucher'
import type { ReceiptCategory } from '../types/voucher'
import { DashboardLayout } from '../layouts/DashboardLayout'

const hoverTransition = 'transition-all duration-200 ease-in-out'

const ReceiptVoucherPage = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ReceiptCategory>('SALES')
  const [amount, setAmount] = useState<string>('0')

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only digits
    const val = e.target.value.replace(/[^0-9]/g, '')
    setAmount(val)
  }

  const formatCurrency = (val: string) => {
    if (!val) return '0'
    return parseInt(val, 10).toLocaleString('vi-VN')
  }

  return (
    <DashboardLayout title="Lập phiếu thu" breadcrumb={[{ label: 'Sổ quỹ' }, { label: 'Lập phiếu thu' }]}>
      <div className="animate-fade-in pb-20">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-end gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl font-bold leading-tight tracking-tight">Tạo phiếu thu mới</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Vui lòng điền thông tin chi tiết để ghi nhận khoản thu</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/cashbook')}
                  className={`flex items-center justify-center rounded-xl px-6 h-11 bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-700 dark:text-slate-300 font-bold text-sm ${hoverTransition} hover:bg-slate-200 dark:hover:bg-slate-700`}
                >
                  Hủy
                </button>
                <button className={`flex items-center justify-center rounded-xl px-8 h-11 bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 ${hoverTransition} hover:-translate-y-0.5 hover:shadow-primary/40`}>
                  Lưu phiếu
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form Section */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">info</span>
                    Thông tin cơ bản
                  </h3>

                  {/* Loại thu selection */}
                  <div className="mb-8">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-3">Loại thu <span className="text-rose-500">*</span></p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label onClick={() => setCategory('SALES')} className="relative cursor-pointer group">
                        <input type="radio" name="loai_thu" className="peer hidden" checked={category === 'SALES'} readOnly />
                        <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${category === 'SALES' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/30'} ${hoverTransition}`}>
                          <span className={`material-symbols-outlined mb-2 ${category === 'SALES' ? 'text-primary' : 'text-slate-400'}`}>shopping_cart</span>
                          <span className={`text-sm font-bold ${category === 'SALES' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Bán hàng</span>
                        </div>
                      </label>
                      <label onClick={() => setCategory('DEBT_COLLECTION')} className="relative cursor-pointer group">
                        <input type="radio" name="loai_thu" className="peer hidden" checked={category === 'DEBT_COLLECTION'} readOnly />
                        <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${category === 'DEBT_COLLECTION' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/30'} ${hoverTransition}`}>
                          <span className={`material-symbols-outlined mb-2 ${category === 'DEBT_COLLECTION' ? 'text-primary' : 'text-slate-400'}`}>person_add</span>
                          <span className={`text-sm font-bold ${category === 'DEBT_COLLECTION' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Thu nợ khách</span>
                        </div>
                      </label>
                      <label onClick={() => setCategory('OTHER')} className="relative cursor-pointer group">
                        <input type="radio" name="loai_thu" className="peer hidden" checked={category === 'OTHER'} readOnly />
                        <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${category === 'OTHER' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/30'} ${hoverTransition}`}>
                          <span className={`material-symbols-outlined mb-2 ${category === 'OTHER' ? 'text-primary' : 'text-slate-400'}`}>payments</span>
                          <span className={`text-sm font-bold ${category === 'OTHER' ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>Thu khác</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Đối tượng nộp */}
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Đối tượng nộp <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm" 
                          placeholder="Tìm tên khách hàng, SĐT..." 
                          type="text" 
                        />
                      </div>
                    </div>
                    {/* Liên kết chứng từ */}
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Liên kết chứng từ</label>
                      <div className="relative">
                        <select className="appearance-none w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all shadow-sm cursor-pointer">
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

                  {/* Ghi chú */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Ghi chú</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all shadow-sm resize-none" 
                      placeholder="Nhập mô tả chi tiết khoảng thu..." 
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Sidebar Section (Payment & Time) */}
              <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">currency_exchange</span>
                    Thanh toán
                  </h3>

                  {/* Số tiền */}
                  <div className="mb-6">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-bold block mb-2">Số tiền thu <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input 
                        className="w-full pl-4 pr-16 py-4 text-xl font-black text-primary rounded-xl border-2 border-primary/20 bg-primary/5 focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-inner" 
                        placeholder="0" 
                        type="text" 
                        value={formatCurrency(amount)}
                        onChange={handleAmountChange}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 font-black tracking-widest">VNĐ</span>
                    </div>
                  </div>

                  {/* Phương thức */}
                  <div className="mb-6">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-bold block mb-2">Phương thức thanh toán</label>
                    <div className="relative">
                      <select className="appearance-none w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all shadow-sm cursor-pointer">
                        <option value="CASH">Tiền mặt</option>
                        <option value="TRANSFER">Chuyển khoản</option>
                        <option value="CARD">Quẹt thẻ</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  {/* Thời gian */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-bold block mb-2">Thời gian thu</label>
                    <div className="relative">
                      <input 
                        className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all shadow-sm" 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>Mặc định là thời gian hiện tại lúc lưu phiếu. Có thể chỉnh sửa thủ công.</span>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-5 rounded-2xl flex gap-4">
                  <div className="mt-0.5">
                    <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1.5">help</span>
                  </div>
                  <div>
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Cần hỗ trợ?</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">Phiếu thu sẽ được tự động hạch toán vào sổ quỹ và báo cáo doanh thu cuối ngày. Để sửa phiếu đã lập, vui lòng vào Sổ quỹ để điều chỉnh.</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
    </DashboardLayout>
  )
}

export default ReceiptVoucherPage
