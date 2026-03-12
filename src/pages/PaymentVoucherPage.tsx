import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockUnpaidImportOrders, mockTreasuryData } from '../mock/voucher'
import { DashboardLayout } from '../layouts/DashboardLayout'

const PaymentVoucherPage = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<string>('0')
  const [selectedOrders, setSelectedOrders] = useState<Record<string, boolean>>({})

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setAmount(val)
  }

  const formatCurrency = (val: string) => {
    if (!val) return '0'
    return parseInt(val, 10).toLocaleString('vi-VN')
  }

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault()
    const allSelected = mockUnpaidImportOrders.every(order => selectedOrders[order.id])
    const newSelected: Record<string, boolean> = {}
    
    if (!allSelected) {
      mockUnpaidImportOrders.forEach(order => {
        newSelected[order.id] = true
      })
    }
    setSelectedOrders(newSelected)
  }

  const toggleOrder = (id: string) => {
    setSelectedOrders(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <DashboardLayout title="Lập phiếu chi" breadcrumb={[{ label: 'Sổ quỹ' }, { label: 'Lập phiếu chi' }]}>
      <div className="animate-fade-in">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
            
            {/* Header Area */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-4">
                  <div className="size-10 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                  <div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Lập phiếu chi</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest mt-0.5">CloudPOS • Quản lý tài chính</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => navigate('/cashbook')} className="text-slate-500 hover:text-primary font-bold text-sm transition-colors tracking-wide uppercase">Hủy</button>
                  <button onClick={() => navigate('/cashbook')} className="flex items-center justify-center rounded-xl size-10 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </header>
              
              <div className="p-8">
                <div className="mb-10">
                  <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight leading-tight">Tạo phiếu chi mới</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Vui lòng nhập đầy đủ thông tin để ghi nhận khoản chi vào hệ thống</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <h3 className="text-primary font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-primary/30 rounded-full"></span>
                      Thông tin cơ bản
                    </h3>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Loại chi <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 shadow-sm transition-all cursor-pointer outline-none">
                          <option value="">Chọn loại chi</option>
                          <option value="nhap-hang">Nhập hàng</option>
                          <option value="tra-no">Trả nợ nhà cung cấp</option>
                          <option value="luong">Chi lương nhân viên</option>
                          <option value="khac">Chi khác</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Số tiền chi <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <input 
                          className="w-full pl-4 pr-14 h-14 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xl font-black text-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none" 
                          placeholder="0"
                          type="text"
                          value={formatCurrency(amount)}
                          onChange={handleAmountChange}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black tracking-widest text-sm">VND</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Thời gian</label>
                        <div className="relative">
                          <input 
                            className="w-full pr-4 pl-4 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none" 
                            type="date" 
                            defaultValue={new Date().toISOString().split('T')[0]} 
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Phương thức</label>
                        <div className="relative">
                          <select className="appearance-none w-full px-4 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm cursor-pointer outline-none">
                            <option value="tien-mat">Tiền mặt</option>
                            <option value="chuyen-khoan">Chuyển khoản</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <h3 className="text-primary font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-primary/30 rounded-full"></span>
                      Đối tượng & Chứng từ
                    </h3>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Đối tượng nhận <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                          className="w-full pl-11 pr-4 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none" 
                          placeholder="Tìm NCC, nhân viên..." 
                          type="text"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Liên kết chứng từ (Phiếu nhập)</label>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/30">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
                          <span>Phiếu chưa thanh toán</span>
                          <button onClick={handleSelectAll} className="text-primary hover:text-primary/70 transition-colors">
                            Chọn tất cả
                          </button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                          {mockUnpaidImportOrders.map(order => (
                            <label key={order.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary/50 transition-colors shadow-sm group">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded appearance-none border-2 border-slate-300 checked:bg-primary checked:border-primary relative flex items-center justify-center after:content-[''] after:hidden checked:after:block after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45 after:-translate-y-0.5" 
                                checked={!!selectedOrders[order.id]}
                                onChange={() => toggleOrder(order.id)}
                              />
                              <div className="flex-1 flex justify-between items-center min-w-0">
                                <div className="min-w-0 flex-1 pr-2">
                                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{order.code}</p>
                                  <p className="text-[11px] font-bold text-slate-400 truncate uppercase tracking-widest">{order.supplier} - {order.date}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Còn nợ</span>
                                  <span className="text-rose-500 font-black text-sm">{order.debtAmount.toLocaleString()}đ</span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Ghi chú</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-none outline-none" 
                        placeholder="Nhập mô tả thêm..." 
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => navigate('/cashbook')}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/30 hover:bg-primary/95 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Lưu phiếu chi
                  </button>
                </div>
              </div>
            </div>

            {/* Balances Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm group hover:border-emerald-500/30 transition-colors">
                <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Quỹ tiền mặt</p>
                  <p className="text-lg font-black tracking-tight">{mockTreasuryData.cashBalance.toLocaleString()}đ</p>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm group hover:border-blue-500/30 transition-colors">
                <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Tài khoản NH</p>
                  <p className="text-lg font-black tracking-tight">{mockTreasuryData.bankBalance.toLocaleString()}đ</p>
                </div>
              </div>

              <div className="p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </div>
                <div>
                  <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-0.5">Mã tự động</p>
                  <p className="text-lg font-black tracking-tight text-primary">PC20231027-001</p>
                </div>
              </div>
            </div>

          </div>
        </div>
    </DashboardLayout>
  )
}

export default PaymentVoucherPage
