import { useMemo, useState, useEffect } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import type { InventoryItem, InventoryStatus } from '../types/inventory'
import { exportToExcel } from '../utils/exportUtils'
import { inventoryService } from '../services/inventoryService'

const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await inventoryService.getAll()
        setInventoryItems(data)
      } catch (err) {
        console.error('Failed to load inventory:', err)
      }
    }
    load()
  }, [])
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [category, setCategory] = useState('Tất cả')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const totalItems = inventoryItems.length
  const totalStock = inventoryItems.reduce((sum, item) => sum + item.stockLevel, 0)
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.stockValue, 0)
  const expiringCount = inventoryItems.filter((item) => item.expiringQuantity > 0).length
  const categories = Array.from(new Set(inventoryItems.map((item) => item.category)))

  const stats = [
    { label: 'Tổng mặt hàng', value: totalItems.toLocaleString('vi-VN'), icon: 'category', color: 'text-primary', trend: 'Dữ liệu realtime', trendColor: 'text-emerald-600' },
    { label: 'Tổng số lượng tồn', value: totalStock.toLocaleString('vi-VN'), icon: 'inventory', color: 'text-primary', subtext: 'Đơn vị: Sản phẩm' },
    { label: 'Tổng giá trị tồn', value: totalValue.toLocaleString('vi-VN'), icon: 'account_balance_wallet', color: 'text-primary', subtext: 'VNĐ' },
    { label: 'Sản phẩm cận hạn', value: expiringCount.toLocaleString('vi-VN'), icon: 'schedule', color: 'text-amber-500', subtext: 'Ưu tiên xuất theo FEFO', subtextColor: 'text-amber-600', ring: 'ring-2 ring-amber-500/20' },
  ]

  const getStatusBadge = (status: InventoryStatus) => {
    switch (status) {
      case 'stable':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Ổn định</span>
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 italic">Tồn thấp</span>
      case 'under_limit':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">Dưới định mức</span>
      case 'expiring':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">Cận hạn</span>
      default:
        return null
    }
  }

  const filteredInventory = inventoryItems.filter(item => {
    const byStatus =
      filter === 'low'
        ? item.status === 'low' || item.status === 'under_limit'
        : filter === 'out'
          ? item.stockLevel === 0
          : true

    const byCategory = category === 'Tất cả' ? true : item.category === category
    return byStatus && byCategory
  })

  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / pageSize))

  const currentPageClamped = useMemo(() => {
    if (currentPage > totalPages) return totalPages
    return currentPage
  }, [currentPage, totalPages])

  const paginatedInventory = useMemo(() => {
    const start = (currentPageClamped - 1) * pageSize
    return filteredInventory.slice(start, start + pageSize)
  }, [currentPageClamped, filteredInventory])

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const start = Math.max(1, currentPageClamped - 2)
    const end = Math.min(totalPages, start + 4)
    const adjustedStart = Math.max(1, end - 4)
    return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i)
  }, [currentPageClamped, totalPages])

  const startIndex = filteredInventory.length === 0 ? 0 : (currentPageClamped - 1) * pageSize + 1
  const endIndex = Math.min(currentPageClamped * pageSize, filteredInventory.length)

  return (
    <DashboardLayout title="Quản lý Tồn kho" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Tồn kho' }]}>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Quản lý Tồn kho</h1>
            <p className="text-slate-500 font-medium">Theo dõi và cập nhật số lượng hàng hóa trong thời gian thực</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => exportToExcel('Tồn kho')}
              className="flex items-center justify-center rounded-2xl h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined mr-2">download</span>
              Xuất báo cáo Excel
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm ${stat.ring || ''}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <span className={`material-symbols-outlined ${stat.color} text-xl`}>{stat.icon}</span>
              </div>
              <p className={`text-3xl font-black tracking-tight ${stat.color === 'text-rose-500' ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{stat.value}</p>
              {stat.trend && (
                <p className={`text-[10px] ${stat.trendColor} mt-2 font-black uppercase tracking-widest flex items-center`}>
                  <span className="material-symbols-outlined text-xs mr-1">trending_up</span> {stat.trend}
                </p>
              )}
              {stat.subtext && (
                <p className={`text-[10px] ${stat.subtextColor || 'text-slate-400'} mt-2 font-bold uppercase tracking-widest`}>{stat.subtext}</p>
              )}
            </div>
          ))}
        </div>

        {/* Inventory Table Container */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
          {/* Filters Toolbar */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center">
            <div className="flex p-1 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <button 
                onClick={() => setFilter('all')}
                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Tất cả sản phẩm
              </button>
              <button 
                onClick={() => setFilter('low')}
                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filter === 'low' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <span className="material-symbols-outlined text-sm">priority_high</span>
                Cảnh báo tồn thấp
              </button>
              <button 
                onClick={() => setFilter('out')}
                className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === 'out' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Đã hết hàng
              </button>
            </div>
            
            <div className="ml-auto flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">filter_list</span>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="Tất cả">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã SKU</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên sản phẩm</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Số lượng tồn</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Giá trị tồn (VNĐ)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {paginatedInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-all group">
                    <td className="px-8 py-6 text-xs font-mono font-bold text-slate-500 tracking-wider">
                      {item.sku}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-start gap-3">
                        <div className="size-10 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden shrink-0">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'}
                            alt={item.name}
                            className="size-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">Danh mục: {item.category}</div>
                          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                            {item.issuePolicy === 'FEFO' && (
                              <span className="inline-flex rounded-full px-2.5 py-1 bg-primary/10 text-primary">
                                FEFO
                              </span>
                            )}
                            {item.nextExpiryDate && (
                              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-amber-600">
                                HSD gần nhất: {item.nextExpiryDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-xs font-bold text-slate-500">
                      {item.unit}
                    </td>
                    <td className={`px-6 py-6 text-sm font-black text-center ${item.status === 'low' ? 'text-rose-500' : item.status === 'under_limit' ? 'text-orange-500' : 'text-slate-900 dark:text-white'}`}>
                      {item.stockLevel}
                    </td>
                    <td className="px-6 py-6 text-sm font-black text-right text-slate-900 dark:text-white">
                      {item.stockValue.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-8 py-6 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Hiển thị {startIndex}-{endIndex} / {filteredInventory.length} sản phẩm
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPageClamped === 1}
                className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`size-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${
                    page === currentPageClamped
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPageClamped === totalPages}
                className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InventoryPage
