import { useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { 
  mockDashboardStats, 
  mockChartData, 
  mockCategoryRevenue, 
  mockTopProducts, 
  mockIncomeExpense 
} from '../mock/dashboard-data'
import { exportToExcel } from '../utils/exportUtils'
import { useProductStore } from '../store/productStore'

const DashboardPage = () => {
  const { inventoryItems } = useProductStore()

  const stats = useMemo(() => {
    const inventoryValue = inventoryItems.reduce((sum, item) => sum + item.stockValue, 0)
    return {
      ...mockDashboardStats,
      inventoryValue: {
        ...mockDashboardStats.inventoryValue,
        value: inventoryValue,
      },
    }
  }, [inventoryItems])

  const inventoryAlerts = useMemo(
    () =>
      inventoryItems
        .filter((item) => item.status === 'low' || item.status === 'under_limit' || item.status === 'expiring')
        .sort((a, b) => a.stockLevel - b.stockLevel)
        .slice(0, 5)
        .map((item) => {
          const threshold = item.status === 'low' ? 8 : item.status === 'under_limit' ? 12 : Math.max(15, item.stockLevel + item.expiringQuantity)

          return {
            id: item.id,
            name: item.name,
            remaining: item.stockLevel,
            threshold,
            unit: item.unit,
            status: item.status === 'low' ? 'critical' as const : 'warning' as const,
          }
        }),
    [inventoryItems]
  )

  return (
    <DashboardLayout title="Tổng quan" breadcrumb={[{ label: 'Tổng quan' }]}>
      <div className="flex flex-col gap-8 animate-fade-in pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Báo cáo tổng quan</h1>
            <p className="text-slate-500 font-medium">Theo dõi hiệu suất kinh doanh và quản lý cửa hàng trong thời gian thực.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => exportToExcel('Báo cáo tổng quan')}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 transition-all font-display"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất Excel
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 font-display">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Tháng này
            </button>
          </div>
        </div>

        {/* Top Row: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Revenue */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${stats.totalRevenue.change >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'}`}>
                {stats.totalRevenue.change > 0 ? '+' : ''}{stats.totalRevenue.change}%
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Tổng Doanh thu</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white font-display">
              {stats.totalRevenue.value.toLocaleString()}đ
            </h3>
            <div className="mt-4 h-8 flex items-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="bg-emerald-200 dark:bg-emerald-900/40 w-full h-[30%] rounded-full"></div>
              <div className="bg-emerald-300 dark:bg-emerald-800/50 w-full h-[50%] rounded-full"></div>
              <div className="bg-emerald-400 dark:bg-emerald-700/60 w-full h-[40%] rounded-full"></div>
              <div className="bg-emerald-500 dark:bg-emerald-500 w-full h-full rounded-full shadow-sm shadow-emerald-500/20"></div>
              <div className="bg-emerald-300 dark:bg-emerald-800/50 w-full h-[70%] rounded-full"></div>
            </div>
          </div>

          {/* Profit */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">savings</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10">
                +{stats.netProfit.change}%
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Lợi nhuận ròng</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white font-display">
              {stats.netProfit.value.toLocaleString()}đ
            </h3>
            <div className="mt-4 h-8 flex items-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="bg-blue-400 w-full h-[40%] rounded-full"></div>
              <div className="bg-blue-300 w-full h-[60%] rounded-full"></div>
              <div className="bg-blue-200 w-full h-[25%] rounded-full"></div>
              <div className="bg-blue-500 w-full h-full rounded-full shadow-sm shadow-blue-500/20"></div>
              <div className="bg-blue-400 w-full h-[50%] rounded-full"></div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/10">
                +{stats.totalOrders.change}%
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Tổng đơn hàng</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white font-display">
              {stats.totalOrders.value.toLocaleString()}
            </h3>
            <div className="mt-4 h-8 flex items-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="bg-purple-300 w-full h-[50%] rounded-full"></div>
              <div className="bg-purple-500 w-full h-full rounded-full shadow-sm shadow-purple-500/20"></div>
              <div className="bg-purple-200 w-full h-[25%] rounded-full"></div>
              <div className="bg-purple-400 w-full h-[70%] rounded-full"></div>
              <div className="bg-purple-300 w-full h-[40%] rounded-full"></div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10">
                {stats.inventoryValue.change}%
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Giá trị tồn kho</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white font-display">
              {stats.inventoryValue.value.toLocaleString()}đ
            </h3>
            <div className="mt-4 h-8 flex items-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="bg-amber-400 w-full h-[80%] rounded-full"></div>
              <div className="bg-amber-200 w-full h-[40%] rounded-full"></div>
              <div className="bg-amber-500 w-full h-full rounded-full shadow-sm shadow-amber-500/20"></div>
              <div className="bg-amber-300 w-full h-[30%] rounded-full"></div>
              <div className="bg-amber-400 w-full h-[60%] rounded-full"></div>
            </div>
          </div>

        </div>

        {/* Middle Section: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Line Chart Area */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-display">Doanh thu & Lợi nhuận (7 ngày qua)</h2>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest font-display">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/50"></div>
                  <span className="text-slate-500">Doanh thu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                  <span className="text-slate-500">Lợi nhuận</span>
                </div>
              </div>
            </div>
            <div className="h-64 relative w-full overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                <defs>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1c43a6" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#1c43a6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,150 L133,120 L266,160 L400,80 L533,100 L666,40 L800,60 L800,200 L0,200 Z" fill="url(#primaryGradient)"></path>
                <path d="M0,150 L133,120 L266,160 L400,80 L533,100 L666,40 L800,60" fill="none" stroke="#1c43a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <path d="M0,180 L133,165 L266,175 L400,140 L533,150 L666,110 L800,120" fill="none" stroke="#10b981" strokeDasharray="8,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                
                <circle cx="133" cy="120" r="5" fill="white" stroke="#1c43a6" strokeWidth="3"></circle>
                <circle cx="400" cy="80" r="5" fill="white" stroke="#1c43a6" strokeWidth="3"></circle>
                <circle cx="666" cy="40" r="5" fill="white" stroke="#1c43a6" strokeWidth="3"></circle>
              </svg>
              
              <div className="flex justify-between mt-4 px-2">
                {mockChartData.map((d, i) => (
                  <span key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">{d.day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Donut Chart / Category Breakdown */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col">
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-8 font-display">Doanh thu theo Ngành hàng</h2>
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative w-40 h-40 mb-8 hover:scale-105 transition-transform duration-500">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-slate-800"></circle>
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#1c43a6" strokeWidth="4" strokeDasharray="45 100" strokeDashoffset="0"></circle>
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-45"></circle>
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-70"></circle>
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#6366f1" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-90"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">450M</span>
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 mt-0.5 font-display">Tháng này</span>
                </div>
              </div>
              
              <div className="w-full space-y-3.5">
                {mockCategoryRevenue.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm group">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }}></div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors font-display">{cat.name}</span>
                    </div>
                    <span className="font-black tracking-tight text-slate-900 dark:text-white font-display">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Top 5 Products */}
          <div className="xl:col-span-1 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-display">Top 5 Bán chạy</h2>
              <button className="text-primary text-[10px] uppercase font-black tracking-widest hover:underline decoration-2 underline-offset-4 font-display">Tất cả</button>
            </div>
            <div className="space-y-4">
              {mockTopProducts.map((prod) => (
                <div key={prod.id} className="flex items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-900/50 p-2 -mx-2 rounded-2xl transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate font-display">{prod.name}</h4>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5 font-display">Đã bán {prod.soldCount.toLocaleString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white font-display">{(prod.revenue / 1000000).toFixed(1)}M</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest font-display ${prod.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {prod.change > 0 ? '+' : ''}{prod.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income & Expense Summary */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col">
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-8 font-display">Tổng Thu chi & Hao hụt</h2>
            
            <div className="space-y-8 flex-1">
              <div className="group">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-500 font-bold uppercase text-[11px] tracking-widest font-display">Tổng Thu</span>
                  <span className="font-black text-emerald-500 font-display">{mockIncomeExpense.totalIncome.toLocaleString()}đ</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full rounded-full shadow-sm shadow-emerald-500/20 group-hover:scale-y-110 transition-transform"></div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-500 font-bold uppercase text-[11px] tracking-widest font-display">Tổng Chi</span>
                  <span className="font-black text-primary font-display">{mockIncomeExpense.totalExpense.toLocaleString()}đ</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%] rounded-full shadow-sm shadow-primary/20 group-hover:scale-y-110 transition-transform"></div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-500 font-bold uppercase text-[11px] tracking-widest font-display">Hao hụt / Thất thoát</span>
                  <span className="font-black text-rose-500 font-display">{mockIncomeExpense.shrinkage.toLocaleString()}đ</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[5%] rounded-full shadow-sm shadow-rose-500/20 group-hover:scale-y-110 transition-transform"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-2xl">
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-emerald-600/70 mb-1 font-display">Lợi nhuận gộp</p>
                <p className="text-2xl font-black tracking-tight text-emerald-600 font-display">{mockIncomeExpense.grossProfit.toLocaleString()}đ</p>
              </div>
              <div className="size-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">trending_up</span>
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-display">Cảnh báo Tồn kho</h2>
              <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ring-1 ring-rose-500/20 font-display">Cần nhập</span>
            </div>
            
            <div className="flex-1 space-y-4">
              {inventoryAlerts.length === 0 ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 text-sm font-bold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400">
                  Kho dang o muc on dinh, khong co mat hang canh bao.
                </div>
              ) : inventoryAlerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${
                  alert.status === 'critical' 
                    ? 'border-rose-100 dark:border-rose-500/20 bg-rose-50/30 dark:bg-rose-500/5 hover:bg-rose-50/50 hover:border-rose-200' 
                    : 'border-amber-100 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5 hover:bg-amber-50/50 hover:border-amber-200'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">{alert.name}</h4>
                    <span className={`text-[11px] font-black uppercase tracking-widest font-display ${
                      alert.status === 'critical' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      Còn {alert.remaining} {alert.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/60 dark:bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${alert.status === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`} 
                      style={{ width: `${(alert.remaining / alert.threshold) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2.5 font-display">
                    Ngưỡng tối thiểu: <span className="text-slate-700 dark:text-slate-300">{alert.threshold} {alert.unit}</span>
                  </p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[11px] tracking-widest uppercase font-black hover:bg-primary hover:text-white transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 font-display">
              Tạo đơn nhập nhanh
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
