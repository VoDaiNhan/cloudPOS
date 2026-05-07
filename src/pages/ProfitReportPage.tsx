import { useState, useEffect, useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { supplierService } from '../services/supplierService'
import { commissionPayableService } from '../services/commissionPayableService'
import type { Supplier } from '../types/supplier'
import type { CommissionPayableSummary } from '../services/commissionPayableService'

type TabType = 'OVERVIEW' | 'BY_SUPPLIER'

const fmt = (n: number) => `${n.toLocaleString('vi-VN')}đ`
const pct = (n: number) => `${n.toFixed(1)}%`

const ProfitReportPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [commissionSummary, setCommissionSummary] = useState<CommissionPayableSummary>({
    totalAccrued: 0, totalPaid: 0, totalRemaining: 0, unpaidCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [supplierData, commData] = await Promise.all([
          supplierService.getAll(),
          commissionPayableService.getSummary(),
        ])
        setSuppliers(supplierData)
        setCommissionSummary(commData)
      } catch (err) {
        console.error('Failed to load profit data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => {
    const totalImported = suppliers.reduce((s, v) => s + v.totalImported, 0)
    const totalDiscountSaved = suppliers.reduce((s, v) => s + v.totalDiscountSaved, 0)
    const totalActualPaid = suppliers.reduce((s, v) => s + v.actualTotalPaid, 0)
    const totalDebt = suppliers.reduce((s, v) => s + v.debt, 0)
    const avgDiscount = suppliers.length > 0
      ? suppliers.reduce((s, v) => s + v.discountPercent, 0) / suppliers.length
      : 0

    return {
      totalImported,
      totalDiscountSaved,
      totalActualPaid,
      totalDebt,
      avgDiscount,
      commissionPaid: commissionSummary.totalPaid,
      commissionPending: commissionSummary.totalRemaining,
    }
  }, [suppliers, commissionSummary])

  return (
    <DashboardLayout title="Báo cáo Lợi nhuận" breadcrumb={[{ label: 'Báo cáo' }, { label: 'Lợi nhuận & Chiết khấu NCC' }]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Phân tích Lợi nhuận & Chiết khấu</h1>
          <p className="text-sm font-medium text-slate-500">
            So sánh giá nhập ghi sổ vs giá thực trả NCC, theo dõi chiết khấu và tính lợi nhuận thực tế.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Tổng giá nhập (Ghi sổ)" value={fmt(stats.totalImported)} icon="inventory_2" tone="slate" subtitle="Giá trị hàng hóa trên sổ sách" />
          <SummaryCard label="Tổng tiền thực trả NCC" value={fmt(stats.totalActualPaid)} icon="payments" tone="primary" subtitle={`Sau chiết khấu TB ${pct(stats.avgDiscount)}`} />
          <SummaryCard label="Tiết kiệm từ CK nhà cung cấp" value={fmt(stats.totalDiscountSaved)} icon="savings" tone="emerald" subtitle="Chênh lệch giá sổ − giá thực trả" />
          <SummaryCard label="Hoa hồng phải chi (KH thợ)" value={fmt(stats.commissionPaid + stats.commissionPending)} icon="sell" tone="amber" subtitle={`Đã chi ${fmt(stats.commissionPaid)} • Còn lại ${fmt(stats.commissionPending)}`} />
        </div>

        {/* Profit Insight Banner */}
        <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50">
              <span className="material-symbols-outlined text-2xl">trending_up</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-800 dark:text-emerald-300">Phân tích nhanh</h3>
              <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Chiết khấu NCC giúp cửa hàng tiết kiệm <span className="font-black">{fmt(stats.totalDiscountSaved)}</span> trên tổng {fmt(stats.totalImported)} giá trị nhập.
                {stats.commissionPending > 0 && (
                  <> Tuy nhiên, còn <span className="font-black text-amber-700">{fmt(stats.commissionPending)}</span> hoa hồng chưa chi cho khách thợ – khoản này sẽ trừ vào lợi nhuận thực tế.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
          <div className="flex gap-2 border-b border-slate-100 p-3 dark:border-slate-800">
            {[
              { id: 'OVERVIEW' as TabType, label: 'Tổng quan chiết khấu NCC' },
              { id: 'BY_SUPPLIER' as TabType, label: 'Chi tiết theo NCC' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {loading ? (
              <div className="py-12 text-center text-sm font-bold text-slate-400">Đang tải dữ liệu...</div>
            ) : activeTab === 'OVERVIEW' ? (
              <OverviewTable suppliers={suppliers} />
            ) : (
              <SupplierDetailTable suppliers={suppliers} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// ── Summary Card ─────────────────────────────────
const SummaryCard = ({ label, value, icon, tone, subtitle }: {
  label: string; value: string; icon: string; tone: 'slate' | 'primary' | 'emerald' | 'amber'; subtitle?: string
}) => {
  const tones = {
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    primary: 'bg-primary/10 text-primary border-primary/10',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  }
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
      <div className="flex items-center gap-3">
        <div className={`flex size-11 items-center justify-center rounded-2xl border ${tones[tone]}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white truncate">{value}</p>
          {subtitle && <p className="mt-0.5 text-[11px] font-bold text-slate-400 truncate">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Overview Table ───────────────────────────────
const OverviewTable = ({ suppliers }: { suppliers: Supplier[] }) => {
  if (suppliers.length === 0) {
    return <div className="py-12 text-center text-sm font-bold text-slate-400">Chưa có dữ liệu nhà cung cấp.</div>
  }

  const totalImported = suppliers.reduce((s, v) => s + v.totalImported, 0)
  const totalActual = suppliers.reduce((s, v) => s + v.actualTotalPaid, 0)
  const totalSaved = suppliers.reduce((s, v) => s + v.totalDiscountSaved, 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">NCC</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nhóm hàng</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">CK (%)</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Giá nhập (Sổ)</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thực trả NCC</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Tiết kiệm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {suppliers.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-4">
                <p className="text-sm font-black text-slate-900 dark:text-white">{s.name}</p>
                <p className="text-[11px] font-bold text-slate-400">{s.code}</p>
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200">
                  {s.category}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className={`text-sm font-black ${s.discountPercent > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {s.discountPercent > 0 ? `${s.discountPercent}%` : '—'}
                </span>
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-slate-500">{fmt(s.totalImported)}</td>
              <td className="px-4 py-4 text-right text-sm font-black text-slate-900 dark:text-white">{fmt(s.actualTotalPaid)}</td>
              <td className="px-4 py-4 text-right">
                <span className={`text-sm font-black ${s.totalDiscountSaved > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {s.totalDiscountSaved > 0 ? fmt(s.totalDiscountSaved) : '—'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20">
            <td colSpan={3} className="px-4 py-4 text-sm font-black text-slate-900 dark:text-white uppercase">Tổng cộng</td>
            <td className="px-4 py-4 text-right text-sm font-black text-slate-500">{fmt(totalImported)}</td>
            <td className="px-4 py-4 text-right text-sm font-black text-slate-900 dark:text-white">{fmt(totalActual)}</td>
            <td className="px-4 py-4 text-right text-sm font-black text-emerald-600">{fmt(totalSaved)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

// ── Supplier Detail Table ────────────────────────
const SupplierDetailTable = ({ suppliers }: { suppliers: Supplier[] }) => {
  if (suppliers.length === 0) {
    return <div className="py-12 text-center text-sm font-bold text-slate-400">Chưa có dữ liệu.</div>
  }

  return (
    <div className="space-y-6">
      {suppliers.filter(s => s.discountPercent > 0).map((s) => {
        const savedPercent = s.totalImported > 0 ? (s.totalDiscountSaved / s.totalImported * 100) : 0
        return (
          <div key={s.id} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">{s.name}</h4>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{s.code} • {s.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600 border border-emerald-100">
                  CK {s.discountPercent}%
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <DetailCard label="Giá nhập ghi sổ" value={fmt(s.totalImported)} />
              <DetailCard label="Giá thực trả" value={fmt(s.actualTotalPaid)} highlight />
              <DetailCard label="Tiết kiệm CK" value={fmt(s.totalDiscountSaved)} tone="emerald" />
              <DetailCard label="% tiết kiệm thực tế" value={pct(savedPercent)} tone="emerald" />
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
              <span className="font-black">Cách tính:</span> Giá nhập {fmt(s.totalImported)} × (1 − {s.discountPercent}%) = Thực trả {fmt(s.actualTotalPaid)}.
              Cửa hàng tiết kiệm {fmt(s.totalDiscountSaved)} nhờ chiết khấu NCC.
              {s.debt > 0 && <> Công nợ hiện tại: <span className="font-black text-rose-500">{fmt(s.debt)}</span>.</>}
            </div>
          </div>
        )
      })}

      {suppliers.filter(s => s.discountPercent === 0).length > 0 && (
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-3">NCC chưa có chiết khấu</h4>
          <div className="space-y-2">
            {suppliers.filter(s => s.discountPercent === 0).map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                <div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{s.name}</span>
                  <span className="ml-2 text-[11px] font-bold text-slate-400">{s.code}</span>
                </div>
                <span className="text-sm font-bold text-slate-400">Nhập: {fmt(s.totalImported)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const DetailCard = ({ label, value, tone, highlight }: {
  label: string; value: string; tone?: 'emerald'; highlight?: boolean
}) => (
  <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    <p className={`mt-2 text-lg font-black ${
      tone === 'emerald' ? 'text-emerald-600' : highlight ? 'text-primary' : 'text-slate-900 dark:text-white'
    }`}>{value}</p>
  </div>
)

export default ProfitReportPage
