import { useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { mockInventory } from '../mock/inventory'
import type { InventoryStatus } from '../types/inventory'
import { exportToExcel } from '../utils/exportUtils'

const InventoryPage = () => {
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [category, setCategory] = useState('Tất cả')

  const stats = [
    { label: 'Tổng mặt hàng', value: '1,250', icon: 'category', color: 'text-primary', trend: '+12 mặt hàng mới', trendColor: 'text-emerald-600' },
    { label: 'Tổng số lượng tồn', value: '45,800', icon: 'inventory', color: 'text-primary', subtext: 'Đơn vị: Sản phẩm' },
    { label: 'Tổng giá trị tồn', value: '2,450,000,000', icon: 'account_balance_wallet', color: 'text-primary', subtext: 'VNĐ' },
    { label: 'Sản phẩm tồn thấp', value: '42', icon: 'warning', color: 'text-rose-500', subtext: 'Cần nhập hàng gấp', subtextColor: 'text-rose-500', ring: 'ring-2 ring-rose-500/20' },
  ]

  const getStatusBadge = (status: InventoryStatus) => {
    switch (status) {
      case 'stable':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Ổn định</span>
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 italic">Tồn thấp</span>
      case 'under_limit':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">Dưới định mức</span>
      default:
        return null
    }
  }

  const filteredInventory = mockInventory.filter(item => {
    if (filter === 'low') return item.status === 'low'
    if (filter === 'out') return item.stockLevel === 0
    return true
  })

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
                  <option>Nhóm hàng: Tất cả</option>
                  <option>Điện thoại</option>
                  <option>Phụ kiện</option>
                  <option>Laptop</option>
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
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-all group">
                    <td className="px-8 py-6 text-xs font-mono font-bold text-slate-500 tracking-wider">
                      {item.sku}
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60">Danh mục: {item.category}</div>
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
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hiển thị 1 - 5 của 1,250 sản phẩm</p>
            <div className="flex gap-2">
              <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-[10px] font-black shadow-md shadow-primary/20">1</button>
              <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[10px] font-black">2</button>
              <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-[10px] font-black">3</button>
              <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
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
