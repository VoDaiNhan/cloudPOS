import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { mockDebtSummary, mockCustomerDebts, mockSupplierDebts } from '../mock/debt'

type TabType = 'CUSTOMER' | 'SUPPLIER' | 'HISTORY'

const DebtPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('CUSTOMER')
  const [showVoucherMenu, setShowVoucherMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const summary = mockDebtSummary

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowVoucherMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OVERDUE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-100 dark:bg-rose-900/30 text-rose-600">Quá hạn</span>
      case 'DUE_SOON':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-600">Sắp đến hạn</span>
      case 'ON_TIME':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">Trong hạn</span>
      case 'PAID':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500">Đã thanh toán</span>
      default:
        return null
    }
  }

  return (
    <DashboardLayout title="Đối soát Công nợ" breadcrumb={[{ label: 'Sổ quỹ', path: '/cashbook' }, { label: 'Công nợ' }]}>
      <div className="space-y-8 animate-fade-in pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Đối soát Công nợ</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">Quản lý dòng tiền, nợ khách hàng và nghĩa vụ thanh toán nhà cung cấp.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất báo cáo
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowVoucherMenu(!showVoucherMenu)}
                className="flex items-center gap-2 bg-primary text-white border border-transparent px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 hover:-translate-y-0.5 shadow-xl shadow-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Tạo phiếu thu/chi
                <span className="material-symbols-outlined text-[16px] ml-1">expand_more</span>
              </button>
              {showVoucherMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <button
                    onClick={() => {
                      setShowVoucherMenu(false)
                      navigate('/receipt-voucher', { state: { background: location } })
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:text-primary transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-emerald-500">request_quote</span>
                    Tạo phiếu thu
                  </button>
                  <button
                    onClick={() => {
                      setShowVoucherMenu(false)
                      navigate('/payment-voucher', { state: { background: location } })
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-primary/5 hover:text-primary transition-colors text-left border-t border-slate-100 dark:border-slate-800"
                  >
                    <span className="material-symbols-outlined text-rose-500">payments</span>
                    Tạo phiếu chi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng nợ phải thu</p>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{summary.totalReceivable.toLocaleString()}đ</h3>
            <div className="flex items-center gap-1.5 mt-3 text-emerald-500 text-[11px] font-black uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 
              +{summary.receivableChangePercent}% 
              <span className="text-slate-400 font-bold normal-case tracking-normal ml-1">so với tháng trước</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng nợ phải trả</p>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{summary.totalPayable.toLocaleString()}đ</h3>
            <div className="flex items-center gap-1.5 mt-3 text-rose-500 text-[11px] font-black uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px]">trending_down</span> 
              {summary.payableChangePercent}% 
              <span className="text-slate-400 font-bold normal-case tracking-normal ml-1">so với tháng trước</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nợ quá hạn</p>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{summary.overdueAmount.toLocaleString()}đ</h3>
            <p className="text-slate-400 text-[11px] font-bold mt-3">Gồm {summary.overdueCount} đối tác quá hạn</p>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-3xl border border-primary/20 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform origin-top-right"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">query_stats</span>
              </div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Chỉ số thanh khoản</p>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-primary">{summary.liquidityRatio}</h3>
            <p className="text-emerald-500 text-[11px] mt-3 font-black uppercase tracking-widest">Mức độ an toàn cao</p>
          </div>
        </div>

        {/* Tabs & Table Section */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 dark:border-slate-800 flex overflow-x-auto px-2 pt-2">
            {[
              { id: 'CUSTOMER', label: 'Công nợ Khách hàng' },
              { id: 'SUPPLIER', label: 'Công nợ Nhà cung cấp' },
              { id: 'HISTORY', label: 'Lịch sử thanh toán' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                placeholder="Tìm kiếm đối tác, SĐT..." 
                type="text"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none shadow-sm flex-1 md:flex-none cursor-pointer">
                <option>Tất cả trạng thái</option>
                <option>Còn nợ</option>
                <option>Quá hạn</option>
                <option>Đã thanh toán</option>
              </select>
              <button className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">filter_list</span> 
                Lọc
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto min-h-[300px]">
            {activeTab === 'HISTORY' ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">history</span>
                <p>Chưa có dữ liệu lịch sử thanh toán.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Mã đối tác</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Tổng nợ</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Hạn TT</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {((activeTab === 'CUSTOMER' ? mockCustomerDebts : mockSupplierDebts) as unknown as Array<{
                    id: string; avatarLetters: string; customerName?: string; supplierName?: string; 
                    customerPhone?: string; supplierPhone?: string; customerId?: string; supplierId?: string;
                    totalDebt: number; dueDate: string; status: string; daysOverdue?: number;
                  }>).map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 text-sm">
                            {item.avatarLetters}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{item.customerName || item.supplierName}</p>
                            <p className="text-[11px] font-bold text-slate-400">{item.customerPhone || item.supplierPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">
                        {item.customerId || item.supplierId}
                      </td>
                      <td className="px-6 py-5 text-sm font-black tracking-tight text-slate-900 dark:text-white">
                        {item.totalDebt.toLocaleString()}đ
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {item.dueDate}
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(item.status)}
                        {item.daysOverdue && (
                          <span className="ml-2 text-[10px] font-black text-rose-500">({item.daysOverdue} ngày)</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => navigate(
                            activeTab === 'CUSTOMER' ? '/receipt-voucher' : '/payment-voucher',
                            { state: { background: location } }
                          )}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                        >
                          {activeTab === 'CUSTOMER' ? 'Thu nợ' : 'Trả nợ'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DebtPage
