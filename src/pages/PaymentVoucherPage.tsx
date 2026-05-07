import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { importOrderService, type ImportOrderListItem } from '../services/importOrderService'
import { cashbookService } from '../services/cashbookService'
import { Modal } from '../components/Modal'

const PaymentVoucherPage = () => {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<string>('0')
  const [selectedOrders, setSelectedOrders] = useState<Record<string, boolean>>({})
  const [unpaidImports, setUnpaidImports] = useState<ImportOrderListItem[]>([])
  const [treasury, setTreasury] = useState({ cashBalance: 0, bankBalance: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const [imports, cashbook] = await Promise.all([
          importOrderService.getAll(undefined, 'unpaid'),
          cashbookService.getSummary(),
        ])
        setUnpaidImports(imports)
        setTreasury({ cashBalance: cashbook.cashBalance, bankBalance: 0 })
      } catch (err) {
        console.error('Failed to load payment data:', err)
      }
    }
    load()
  }, [])

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
    const allSelected = unpaidImports.every(order => selectedOrders[order.id])
    const newSelected: Record<string, boolean> = {}
    if (!allSelected) {
      unpaidImports.forEach(order => { newSelected[order.id] = true })
    }
    setSelectedOrders(newSelected)
  }

  const toggleOrder = (id: string) => {
    setSelectedOrders(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Modal size="full" closeOnBackdrop={false}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Tạo phiếu chi mới</h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">CloudPOS • Quản lý tài chính</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-primary font-bold text-sm transition-colors tracking-wide uppercase">Hủy</button>
          <button className="flex items-center justify-center rounded-xl px-5 h-9 bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>Lưu phiếu chi
          </button>
          <button onClick={() => navigate(-1)} className="flex items-center justify-center rounded-xl size-9 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Balance Info */}
      <div className="px-6 pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm group hover:border-emerald-500/30 transition-colors">
            <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Quỹ tiền mặt</p>
              <p className="text-base font-black tracking-tight">{treasury.cashBalance.toLocaleString()}đ</p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm group hover:border-blue-500/30 transition-colors">
            <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined text-xl">account_balance</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Tài khoản NH</p>
              <p className="text-base font-black tracking-tight">{treasury.bankBalance.toLocaleString()}đ</p>
            </div>
          </div>
          <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3 shadow-sm">
            <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
            </div>
            <div>
              <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-0.5">Mã tự động</p>
              <p className="text-base font-black tracking-tight text-primary">PC20231027-001</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-5">
              <h3 className="text-primary font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-0.5 bg-primary/30 rounded-full" />
                Thông tin cơ bản
              </h3>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Loại chi <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium h-11 px-4 outline-none cursor-pointer">
                    <option value="">Chọn loại chi</option>
                    <option value="nhap-hang">Nhập hàng</option>
                    <option value="tra-no">Trả nợ nhà cung cấp</option>
                    <option value="commission-payout">Chi hoa hồng</option>
                    <option value="luong">Chi lương nhân viên</option>
                    <option value="khac">Chi khác</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Số tiền chi <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input className="w-full pl-4 pr-14 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xl font-black text-primary focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="0" type="text" value={formatCurrency(amount)} onChange={handleAmountChange} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black tracking-widest text-sm">VND</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Thời gian</label>
                  <input className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Phương thức</label>
                  <div className="relative">
                    <select className="appearance-none w-full px-4 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer outline-none">
                      <option value="tien-mat">Tiền mặt</option>
                      <option value="chuyen-khoan">Chuyển khoản</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <h3 className="text-primary font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-0.5 bg-primary/30 rounded-full" />
                Đối tượng & Chứng từ
              </h3>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Đối tượng nhận <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input className="w-full pl-11 pr-4 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="Tìm NCC, nhân viên..." type="text" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold">Liên kết chứng từ (Phiếu nhập)</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
                    <span>Phiếu chưa thanh toán</span>
                    <button onClick={handleSelectAll} className="text-primary hover:text-primary/70 transition-colors">Chọn tất cả</button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {unpaidImports.map(order => (
                      <label key={order.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary/50 transition-colors shadow-sm">
                        <input type="checkbox" className="w-4 h-4 rounded accent-primary" checked={!!selectedOrders[order.id]} onChange={() => toggleOrder(order.id)} />
                        <div className="flex-1 flex justify-between items-center min-w-0">
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 dark:text-white truncate">{order.importNumber}</p>
                            <p className="text-[11px] font-bold text-slate-400 truncate">{order.supplierName || 'NCC'} - {order.createdAt}</p>
                          </div>
                          <div className="text-right ml-2">
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
                <textarea className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none" placeholder="Nhập mô tả thêm..." rows={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PaymentVoucherPage
