import { useEffect, useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { debtService } from '../services/debtService'
import type { DebtItem, DebtSummary } from '../services/debtService'
import { commissionPayableService } from '../services/commissionPayableService'
import type { CommissionPayableItem, CommissionPayableSummary } from '../services/commissionPayableService'

type TabType = 'CUSTOMER' | 'SUPPLIER' | 'COMMISSION'

const DebtPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('CUSTOMER')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<DebtSummary>({
    totalReceivable: 0,
    totalPayable: 0,
    overdueAmount: 0,
    overdueCount: 0,
    receivableChangePercent: 0,
    payableChangePercent: 0,
    liquidityRatio: '0',
  })
  const [commissionSummary, setCommissionSummary] = useState<CommissionPayableSummary>({
    totalAccrued: 0,
    totalPaid: 0,
    totalRemaining: 0,
    unpaidCount: 0,
  })
  const [customerDebts, setCustomerDebts] = useState<DebtItem[]>([])
  const [supplierDebts, setSupplierDebts] = useState<DebtItem[]>([])
  const [commissionItems, setCommissionItems] = useState<CommissionPayableItem[]>([])

  const loadData = async () => {
    setLoading(true)
    try {
      const [debtSummary, customerDebtItems, supplierDebtItems, commissionSummaryData, commissionData] = await Promise.all([
        debtService.getSummary(),
        debtService.getAll('customer'),
        debtService.getAll('supplier'),
        commissionPayableService.getSummary(),
        commissionPayableService.getAll(),
      ])

      setSummary(debtSummary)
      setCustomerDebts(customerDebtItems)
      setSupplierDebts(supplierDebtItems)
      setCommissionSummary(commissionSummaryData)
      setCommissionItems(commissionData)
    } catch (err) {
      console.error('Failed to load debt data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const payCommission = async (item: CommissionPayableItem) => {
    const method = (window.prompt('Phương thức thanh toán hoa hồng: cash hoặc transfer', 'cash') || 'cash').toLowerCase()
    if (!['cash', 'transfer'].includes(method)) return
    if (!window.confirm(`Xác nhận chi ${item.remainingAmount.toLocaleString('vi-VN')}đ cho ${item.customerName}?`)) return

    try {
      await commissionPayableService.pay(item.id, {
        amount: item.remainingAmount,
        method,
        note: `Chi hoa hồng cho ${item.customerName} từ đơn ${item.orderNumber}`,
      })
      await loadData()
    } catch (err) {
      console.error('Failed to pay commission:', err)
    }
  }

  return (
    <DashboardLayout title="Đối soát Công nợ & Hoa hồng" breadcrumb={[{ label: 'Sổ quỹ' }, { label: 'Công nợ & Hoa hồng' }]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Đối soát Công nợ & Hoa hồng</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Theo dõi công nợ phải thu, phải trả và khoản hoa hồng phải thanh toán cho nhóm khách có chiết khấu ẩn.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Nợ phải thu" value={summary.totalReceivable} tone="emerald" icon="account_balance_wallet" />
          <SummaryCard label="Nợ phải trả" value={summary.totalPayable} tone="rose" icon="payments" />
          <SummaryCard label="Hoa hồng chưa chi" value={commissionSummary.totalRemaining} tone="amber" icon="sell" />
          <SummaryCard label="Khoản hoa hồng mở" value={commissionSummary.unpaidCount} tone="primary" icon="receipt_long" isCount />
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
          <div className="flex gap-2 border-b border-slate-100 p-3 dark:border-slate-800">
            {[
              { id: 'CUSTOMER', label: 'Công nợ khách hàng' },
              { id: 'SUPPLIER', label: 'Công nợ nhà cung cấp' },
              { id: 'COMMISSION', label: 'Hoa hồng khách thợ / đối tác' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
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
            {activeTab === 'COMMISSION' ? (
              <CommissionTable items={commissionItems} loading={loading} onPay={payCommission} />
            ) : (
              <DebtTable items={activeTab === 'CUSTOMER' ? customerDebts : supplierDebts} loading={loading} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

const SummaryCard = ({
  label,
  value,
  tone,
  icon,
  isCount = false,
}: {
  label: string
  value: number
  tone: 'emerald' | 'rose' | 'amber' | 'primary'
  icon: string
  isCount?: boolean
}) => {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    primary: 'bg-primary/10 text-primary border-primary/10',
  }

  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
      <div className="flex items-center gap-3">
        <div className={`flex size-11 items-center justify-center rounded-2xl border ${tones[tone]}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {isCount ? value.toLocaleString('vi-VN') : `${value.toLocaleString('vi-VN')}đ`}
          </p>
        </div>
      </div>
    </div>
  )
}

const DebtTable = ({ items, loading }: { items: DebtItem[]; loading: boolean }) => {
  if (loading) {
    return <div className="py-12 text-center text-sm font-bold text-slate-400">Đang tải dữ liệu...</div>
  }

  if (items.length === 0) {
    return <div className="py-12 text-center text-sm font-bold text-slate-400">Không có dữ liệu công nợ.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Đối tượng</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Mã</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Số dư</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hạn thanh toán</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 font-black text-slate-500 dark:bg-slate-800">
                    {item.avatarLetters}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{item.customerName || item.supplierName}</p>
                    <p className="text-[11px] font-bold text-slate-400">{item.customerPhone || item.supplierPhone || '—'}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm font-bold text-slate-500">{item.customerId || item.supplierId || '—'}</td>
              <td className="px-4 py-4 text-right text-sm font-black text-slate-900 dark:text-white">{item.totalDebt.toLocaleString('vi-VN')}đ</td>
              <td className="px-4 py-4 text-sm font-bold text-slate-500">{item.dueDate}</td>
              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const CommissionTable = ({
  items,
  loading,
  onPay,
}: {
  items: CommissionPayableItem[]
  loading: boolean
  onPay: (item: CommissionPayableItem) => void
}) => {
  if (loading) {
    return <div className="py-12 text-center text-sm font-bold text-slate-400">Đang tải dữ liệu...</div>
  }

  if (items.length === 0) {
    return <div className="py-12 text-center text-sm font-bold text-slate-400">Chưa phát sinh khoản hoa hồng nào.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nhóm</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn hàng</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Hoa hồng</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Còn phải trả</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Trạng thái</th>
            <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-4">
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{item.customerName}</p>
                  <p className="text-[11px] font-bold text-slate-400">{item.customerPhone || '—'} • {item.accruedAt}</p>
                </div>
              </td>
              <td className="px-4 py-4 text-sm font-bold text-slate-500">{item.customerGroupName || '—'}</td>
              <td className="px-4 py-4">
                <p className="text-sm font-black text-slate-900 dark:text-white">{item.orderNumber}</p>
                <p className="text-[11px] font-bold text-slate-400">{item.commissionPercent}% trên {item.baseAmount.toLocaleString('vi-VN')}đ</p>
              </td>
              <td className="px-4 py-4 text-right text-sm font-black text-amber-600">{item.commissionAmount.toLocaleString('vi-VN')}đ</td>
              <td className="px-4 py-4 text-right text-sm font-black text-slate-900 dark:text-white">{item.remainingAmount.toLocaleString('vi-VN')}đ</td>
              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-4 text-right">
                {item.status === 'PAID' ? (
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Đã chi</span>
                ) : (
                  <button
                    onClick={() => onPay(item)}
                    className="rounded-xl bg-primary/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    Chi hoa hồng
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const StatusBadge = ({ status }: { status: string }) => {
  const labelMap: Record<string, string> = {
    PAID: 'Đã thanh toán',
    UNPAID: 'Chưa thanh toán',
    PARTIALLY_PAID: 'Thanh toán một phần',
    OVERDUE: 'Quá hạn',
    DUE_SOON: 'Sắp đến hạn',
    ON_TIME: 'Trong hạn',
  }

  const toneMap: Record<string, string> = {
    PAID: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    UNPAID: 'bg-rose-50 text-rose-600 border-rose-100',
    PARTIALLY_PAID: 'bg-amber-50 text-amber-600 border-amber-100',
    OVERDUE: 'bg-rose-50 text-rose-600 border-rose-100',
    DUE_SOON: 'bg-amber-50 text-amber-600 border-amber-100',
    ON_TIME: 'bg-slate-100 text-slate-500 border-slate-200',
  }

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${toneMap[status] || toneMap.ON_TIME}`}>
      {labelMap[status] || status}
    </span>
  )
}

export default DebtPage
