import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { accountService } from '../services/accountService'
import { storeService } from '../services/storeService'
import type { BillingStatus } from '../types/account'

// ── Sub-components ──────────────────────────────────────────────────────────

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{value}</p>
  </div>
)

const UsageStat = ({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string
}) => (
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-primary text-lg shrink-0">{icon}</span>
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}: <span className="font-bold text-slate-900 dark:text-white">{value}</span>
    </span>
  </div>
)

const billingStatusConfig: Record<
  BillingStatus,
  { label: string; className: string }
> = {
  success: {
    label: 'Thành công',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  pending: {
    label: 'Chờ thanh toán',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  failed: {
    label: 'Thất bại',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
}

// ── Edit Modal ───────────────────────────────────────────────────────────────

interface EditStoreModalProps {
  onClose: () => void
}

const EditStoreModal = ({ onClose, storeData }: EditStoreModalProps & { storeData: { name: string; slug: string; address: string; phone: string; email: string; businessType: string } }) => {
  const store = storeData
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Chỉnh sửa thông tin cửa hàng</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-4">
          {[
            { id: 'name', label: 'Tên cửa hàng', defaultValue: store.name },
            { id: 'slug', label: 'Mã định danh (Slug)', defaultValue: store.slug },
            { id: 'address', label: 'Địa chỉ', defaultValue: store.address },
            { id: 'phone', label: 'Số điện thoại', defaultValue: store.phone },
            { id: 'email', label: 'Email liên hệ', defaultValue: store.email },
            { id: 'businessType', label: 'Loại hình kinh doanh', defaultValue: store.businessType },
          ].map((field) => (
            <div key={field.id}>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                {field.label}
              </label>
              <input
                type="text"
                defaultValue={field.defaultValue}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const AccountPage = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const navigate = useNavigate()
  const [store, setStore] = useState({ name: '', slug: '', address: '', phone: '', email: '', businessType: '' })
  const [plan] = useState({ name: 'Gói Chuyên Nghiệp' as const, status: 'active' as const, expiryDate: '', branches: { used: 0, total: 0 }, staffAccounts: { used: 0, total: 0 }, storage: { usedGb: 0, totalGb: 0 } })
  const [billings] = useState<{ id: string; date: string; invoiceId: string; planName: string; amount: number; status: BillingStatus }[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [acct, storeData] = await Promise.all([accountService.get(), storeService.getMyStore()])
        setStore({
          name: storeData.name || acct.fullName || '',
          slug: storeData.slug || '',
          address: storeData.address || '',
          phone: storeData.phone || acct.phone || '',
          email: storeData.email || acct.email || '',
          businessType: storeData.businessType || '',
        })
      } catch (err) {
        console.error('Failed to load account:', err)
      }
    }
    load()
  }, [])

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('vi-VN') + 'đ'

  return (
    <DashboardLayout
      title="Quản lý Tài khoản & Gói dịch vụ"
      breadcrumb={[{ label: 'Cấu hình' }, { label: 'Tài khoản & Gói dịch vụ' }]}
    >
      <div className="flex flex-col gap-8 pb-12 animate-fade-in w-full">

        {/* ── Section 1: Store Info ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Thông tin tài khoản &amp; Cửa hàng
            </h3>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Chỉnh sửa
            </button>
          </div>

          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <InfoField label="Tên cửa hàng" value={store.name} />
                <InfoField label="Mã định danh (Slug)" value={store.slug} />
                <InfoField label="Địa chỉ" value={store.address} />
              </div>
              <div className="space-y-5">
                <InfoField label="Số điện thoại" value={store.phone} />
                <InfoField label="Email liên hệ" value={store.email} />
                <InfoField label="Loại hình kinh doanh" value={store.businessType} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: Service Plan ── */}
        <section>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
            Thông tin Gói dịch vụ hiện tại
          </h3>
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
            {/* Decorative icon */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
              <span className="material-symbols-outlined text-[120px] text-primary">workspace_premium</span>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4">
                {/* Plan badge + status */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-black rounded-full uppercase tracking-wider">
                    {plan.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Đang hoạt động
                  </span>
                </div>

                {/* Usage stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                  <UsageStat icon="event" label="Ngày hết hạn" value={plan.expiryDate} />
                  <UsageStat
                    icon="storefront"
                    label="Chi nhánh"
                    value={`${plan.branches.used} / ${plan.branches.total}`}
                  />
                  <UsageStat
                    icon="person"
                    label="Tài khoản nhân viên"
                    value={`${plan.staffAccounts.used} / ${plan.staffAccounts.total}`}
                  />
                  <UsageStat
                    icon="cloud_done"
                    label="Dung lượng lưu trữ"
                    value={`${plan.storage.usedGb}GB / ${plan.storage.totalGb}GB`}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
                  Gia hạn
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                  Nâng cấp gói ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Billing History ── */}
        <section>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
            Lịch sử thanh toán
          </h3>
          <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {['Ngày giao dịch', 'Mã đơn hàng', 'Gói dịch vụ', 'Số tiền', 'Trạng thái', 'Hành động'].map(
                      (col, i) => (
                        <th
                          key={col}
                          className={`px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {billings.map((row) => {
                    const statusCfg = billingStatusConfig[row.status]
                    const canDownload = row.status === 'success'
                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{row.date}</td>
                        <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {row.invoiceId}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{row.planName}</td>
                        <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">
                          {formatCurrency(row.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusCfg.className}`}
                          >
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            disabled={!canDownload}
                            className={`flex items-center gap-1.5 justify-end ml-auto text-sm font-semibold transition-colors ${
                              canDownload
                                ? 'text-primary hover:text-primary/70'
                                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">download</span>
                            Tải hóa đơn
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
              <p className="text-sm text-slate-500">Hiển thị {billings.length} giao dịch gần nhất</p>
              <button className="text-primary hover:underline text-sm font-bold transition-all">
                Xem toàn bộ lịch sử
              </button>
            </div>
          </div>
        </section>

        {/* ── Support Banner ── */}
        <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-xl font-black text-white">Bạn cần hỗ trợ về thanh toán?</h4>
            <p className="text-slate-400 text-sm">Đội ngũ kỹ thuật của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="tel:19001234"
              className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              1900 1234
            </a>
            <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
              Chat ngay
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-slate-400 pb-4">
          © 2024 CloudPOS SaaS. Toàn bộ bản quyền được bảo lưu.
        </footer>
      </div>

      {showEditModal && <EditStoreModal onClose={() => setShowEditModal(false)} storeData={store} />}
    </DashboardLayout>
  )
}

export default AccountPage
