import { useEffect, useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { dashboardService } from '../services/dashboardService'
import type {
  BackendDashboardStats,
  BackendChartPoint,
  BackendTopProduct,
  BackendLowStockAlert,
} from '../utils/apiMappers'

const DashboardPage = () => {
  const [stats, setStats] = useState<BackendDashboardStats | null>(null)
  const [chartData, setChartData] = useState<BackendChartPoint[]>([])
  const [topProducts, setTopProducts] = useState<BackendTopProduct[]>([])
  const [alerts, setAlerts] = useState<BackendLowStockAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [s, c, t, a] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getChart(7),
          dashboardService.getTopProducts(5),
          dashboardService.getAlerts(),
        ])
        setStats(s)
        setChartData(c)
        setTopProducts(t)
        setAlerts(a)
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Tổng quan" breadcrumb={[{ label: 'Tổng quan' }]}>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const revenue = stats?.todayRevenue ?? 0
  const orders = stats?.todayOrders ?? 0
  const totalProducts = stats?.totalProducts ?? 0
  const totalCustomers = stats?.totalCustomers ?? 0

  // Build SVG chart path from real data
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)
  const chartWidth = 800
  const chartHeight = 200
  const revenuePoints = chartData.map((d, i) => {
    const x = chartData.length > 1 ? (i / (chartData.length - 1)) * chartWidth : chartWidth / 2
    const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 20) - 10
    return `${x},${y}`
  })
  const revenuePath = revenuePoints.length > 0 ? `M${revenuePoints.join(' L')}` : ''
  const areaPath = revenuePath ? `${revenuePath} L${chartWidth},${chartHeight} L0,${chartHeight} Z` : ''

  return (
    <DashboardLayout title="Tổng quan" breadcrumb={[{ label: 'Tổng quan' }]}>
      <div className="flex flex-col gap-8 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Báo cáo tổng quan</h1>
            <p className="text-slate-500 font-medium">Dữ liệu thời gian thực từ hệ thống.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 font-display">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Hôm nay
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">LIVE</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Doanh thu Hôm nay</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white font-display">
              {revenue.toLocaleString('vi-VN')}đ
            </h3>
          </div>

          {/* Orders */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/10">LIVE</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Đơn hàng Hôm nay</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white font-display">
              {orders.toLocaleString()}
            </h3>
          </div>

          {/* Products */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10">LIVE</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Tổng Sản phẩm</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white font-display">
              {totalProducts.toLocaleString()}
            </h3>
          </div>

          {/* Customers */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">group</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10">LIVE</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Tổng Khách hàng</p>
            <h3 className="text-2xl font-black tracking-tight mt-1 text-slate-900 dark:text-white font-display">
              {totalCustomers.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Chart + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-display">
                Doanh thu 7 ngày qua
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-display">Doanh thu</span>
              </div>
            </div>
            <div className="h-64 relative w-full overflow-hidden">
              {chartData.length > 0 ? (
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1c43a6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#1c43a6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {areaPath && <path d={areaPath} fill="url(#primaryGradient)" />}
                  {revenuePath && (
                    <path d={revenuePath} fill="none" stroke="#1c43a6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                  )}
                  {revenuePoints.map((pt, i) => {
                    const [cx, cy] = pt.split(',').map(Number)
                    return <circle key={i} cx={cx} cy={cy} r="5" fill="white" stroke="#1c43a6" strokeWidth="3" />
                  })}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm font-bold">Chưa có dữ liệu biểu đồ</div>
              )}
              <div className="flex justify-between mt-4 px-2">
                {chartData.map((d, i) => (
                  <span key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">
                    {new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-display">Top Bán chạy</h2>
            </div>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <div className="text-sm text-slate-400 font-bold text-center py-8">Chưa có dữ liệu bán hàng</div>
              ) : (
                topProducts.map((prod, i) => (
                  <div key={prod.productId} className="flex items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-900/50 p-2 -mx-2 rounded-2xl transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate font-display">{prod.productName}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5 font-display">Đã bán {prod.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white font-display">
                        {prod.revenue >= 1000000 ? `${(prod.revenue / 1000000).toFixed(1)}M` : `${prod.revenue.toLocaleString()}đ`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-display">Cảnh báo Tồn kho</h2>
            {alerts.length > 0 && (
              <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ring-1 ring-rose-500/20 font-display">
                {alerts.length} sản phẩm
              </span>
            )}
          </div>
          {alerts.length === 0 ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 text-sm font-bold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400">
              ✅ Kho đang ổn định, không có mặt hàng cảnh báo.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {alerts.map((alert) => {
                const pct = alert.minQty > 0 ? Math.min((alert.currentQty / alert.minQty) * 100, 100) : 0
                const isCritical = pct < 30
                return (
                  <div key={alert.productId} className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                    isCritical
                      ? 'border-rose-100 dark:border-rose-500/20 bg-rose-50/30 dark:bg-rose-500/5'
                      : 'border-amber-100 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">{alert.productName}</h4>
                      <span className={`text-[11px] font-black uppercase tracking-widest font-display ${isCritical ? 'text-rose-600' : 'text-amber-600'}`}>
                        Còn {alert.currentQty}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/60 dark:bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2.5 font-display">
                      Ngưỡng tối thiểu: <span className="text-slate-700 dark:text-slate-300">{alert.minQty}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
