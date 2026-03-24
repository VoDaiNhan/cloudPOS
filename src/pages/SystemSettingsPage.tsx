import { useState, useRef } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import {
  mockStoreSettings,
  mockTaxSettings,
  mockPaymentMethods,
  mockDeviceSettings,
} from '../mock/settings'
import type { PaymentMethod, PaymentStatus } from '../types/settings'

// ── Helpers ──────────────────────────────────────────────────────────────────

const SectionHeader = ({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: React.ReactNode
}) => (
  <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/40 dark:bg-slate-900/30">
    <div>
      <h3 className="text-base font-black text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 mt-0.5">{description}</p>
    </div>
    {action}
  </div>
)

const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
    {children}
  </label>
)

const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
  />
)

// ── Toggle Switch ─────────────────────────────────────────────────────────────

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${
      checked ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
)

// ── Payment status badge / action ─────────────────────────────────────────────

const paymentAction: Record<PaymentStatus, React.ReactNode> = {
  on: (
    <span className="text-[11px] font-black text-primary px-3 py-1.5 bg-primary/10 rounded-full uppercase tracking-wider">
      Đang bật
    </span>
  ),
  configure: (
    <button className="text-[11px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-wider">
      Cấu hình
    </button>
  ),
  activate: (
    <button className="text-[11px] font-black text-primary px-3 py-1.5 border border-primary rounded-full hover:bg-primary hover:text-white transition-all uppercase tracking-wider">
      Kích hoạt
    </button>
  ),
}

// ── Section: Cửa hàng ────────────────────────────────────────────────────────

const StoreSection = ({ id }: { id: string }) => {
  const [form, setForm] = useState(mockStoreSettings)
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <section id={id} className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
      <SectionHeader
        title="Thông tin Cửa hàng"
        description="Cập nhật thông tin cơ bản và nhận diện thương hiệu của bạn."
        action={
          <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all shrink-0">
            Lưu thay đổi
          </button>
        }
      />
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Logo upload */}
          <div className="shrink-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Logo Cửa hàng</p>
            <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add_a_photo</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1">Tải ảnh lên</span>
            </div>
          </div>

          {/* Form fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <FormLabel>Tên cửa hàng</FormLabel>
              <FormInput value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <FormLabel>Số điện thoại</FormLabel>
              <FormInput value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <FormLabel>Địa chỉ</FormLabel>
              <FormInput value={form.address} onChange={(e) => set('address', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <FormLabel>Website</FormLabel>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm font-medium">
                  https://
                </span>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => set('website', e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: Thuế & Hóa đơn ──────────────────────────────────────────────────

const TaxSection = ({ id }: { id: string }) => {
  const [tax, setTax] = useState(mockTaxSettings)

  return (
    <section id={id} className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
      <SectionHeader
        title="Thuế & Hóa đơn"
        description="Thiết lập VAT và lựa chọn mẫu hóa đơn in cho khách hàng."
        action={
          <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all shrink-0">
            Lưu cài đặt
          </button>
        }
      />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* VAT config */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cấu hình VAT</h4>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Áp dụng thuế VAT</p>
              <p className="text-xs text-slate-500 mt-0.5">Tự động cộng VAT vào đơn hàng</p>
            </div>
            <Toggle checked={tax.vatEnabled} onChange={(v) => setTax((p) => ({ ...p, vatEnabled: v }))} />
          </div>

          <div>
            <FormLabel>Tỷ lệ VAT (%)</FormLabel>
            <FormInput
              type="number"
              min={0}
              max={100}
              value={tax.vatRate}
              onChange={(e) => setTax((p) => ({ ...p, vatRate: Number(e.target.value) }))}
              disabled={!tax.vatEnabled}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Receipt template */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mẫu hóa đơn</h4>
          <div className="grid grid-cols-2 gap-3">
            {/* Template A80 */}
            <button
              onClick={() => setTax((p) => ({ ...p, receiptTemplate: 'A80' }))}
              className={`relative border-2 rounded-xl p-3 cursor-pointer transition-all ${
                tax.receiptTemplate === 'A80'
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Preview */}
              <div className="aspect-[3/4] bg-white border border-slate-200 mb-2 rounded-lg shadow-sm p-2">
                <div className="w-full h-full border border-slate-100 bg-slate-50/80 p-2 space-y-1.5 overflow-hidden">
                  <div className="h-2 w-1/2 bg-slate-200 mx-auto rounded"></div>
                  <div className="h-1 w-full bg-slate-100 rounded"></div>
                  <div className="h-1 w-full bg-slate-100 rounded"></div>
                  <div className="pt-2 space-y-1">
                    <div className="flex justify-between"><div className="h-1 w-1/3 bg-slate-200 rounded"></div><div className="h-1 w-6 bg-slate-200 rounded"></div></div>
                    <div className="flex justify-between"><div className="h-1 w-2/5 bg-slate-200 rounded"></div><div className="h-1 w-6 bg-slate-200 rounded"></div></div>
                    <div className="flex justify-between"><div className="h-1 w-1/4 bg-slate-200 rounded"></div><div className="h-1 w-8 bg-slate-300 rounded"></div></div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-black text-center text-slate-600 dark:text-slate-300">Khổ 80mm (Mặc định)</p>
              {tax.receiptTemplate === 'A80' && (
                <span className="absolute top-1.5 right-1.5 material-symbols-outlined text-primary text-[18px]">check_circle</span>
              )}
            </button>

            {/* Template A5 */}
            <button
              onClick={() => setTax((p) => ({ ...p, receiptTemplate: 'A5' }))}
              className={`relative border-2 rounded-xl p-3 cursor-pointer transition-all ${
                tax.receiptTemplate === 'A5'
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-slate-50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-600 opacity-70'
              }`}
            >
              <div className="aspect-[3/4] bg-white border border-slate-200 mb-2 rounded-lg shadow-sm p-2">
                <div className="w-full h-full border border-slate-100 bg-slate-50/80 p-2 space-y-1.5 overflow-hidden">
                  <div className="h-1 w-1/4 bg-slate-200 rounded"></div>
                  <div className="h-2 w-1/2 bg-slate-200 mx-auto rounded"></div>
                  <div className="h-4 w-full bg-slate-100 rounded flex items-center justify-center">
                    <span className="text-[5px] text-slate-400 font-bold">LOGO</span>
                  </div>
                  <div className="pt-1 space-y-1">
                    <div className="flex justify-between"><div className="h-1 w-1/3 bg-slate-200 rounded"></div><div className="h-1 w-6 bg-slate-200 rounded"></div></div>
                    <div className="flex justify-between"><div className="h-1 w-2/5 bg-slate-200 rounded"></div><div className="h-1 w-8 bg-slate-300 rounded"></div></div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-black text-center text-slate-500">Khổ A5 (Ngang)</p>
              {tax.receiptTemplate === 'A5' && (
                <span className="absolute top-1.5 right-1.5 material-symbols-outlined text-primary text-[18px]">check_circle</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: Thanh toán ───────────────────────────────────────────────────────

const PaymentSection = ({ id }: { id: string }) => {
  const methods = mockPaymentMethods

  return (
    <section id={id} className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
      <SectionHeader
        title="Phương thức Thanh toán"
        description="Quản lý các hình thức thanh toán tại quầy."
        action={
          <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all shrink-0">
            Cập nhật
          </button>
        }
      />
      <div className="p-6 space-y-3">
        {methods.map((m: PaymentMethod) => (
          <div
            key={m.id}
            className={`flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl transition-all ${
              m.status === 'activate' ? 'opacity-60 grayscale' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full ${m.iconBg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${m.iconColor}`}>{m.icon}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{m.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
              </div>
            </div>
            {paymentAction[m.status]}
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Section: Thiết bị ─────────────────────────────────────────────────────────

const DeviceSection = ({ id }: { id: string }) => {
  const [device, setDevice] = useState(mockDeviceSettings)

  const printerStatusConfig = {
    ready: { label: 'Sẵn sàng', className: 'text-emerald-500' },
    offline: { label: 'Ngoại tuyến', className: 'text-slate-400' },
    error: { label: 'Lỗi kết nối', className: 'text-red-500' },
  }
  const pStatus = printerStatusConfig[device.printerStatus]

  return (
    <section id={id} className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
      <SectionHeader
        title="Thiết bị ngoại vi"
        description="Kết nối máy in hóa đơn, máy quét mã vạch và ngăn kéo đựng tiền."
        action={
          <button className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0">
            Kiểm tra kết nối
          </button>
        }
      />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Printer */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">print</span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Máy in hóa đơn</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Trạng thái:</span>
              <span className={`font-black flex items-center gap-1.5 ${pStatus.className}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {pStatus.label}
              </span>
            </div>
            <select
              value={device.printerModel}
              onChange={(e) => setDevice((p) => ({ ...p, printerModel: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            >
              {device.printerOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scanner */}
        <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">barcode_scanner</span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Máy quét mã vạch</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Kiểu kết nối:</span>
              <span className="font-black text-slate-900 dark:text-white">{device.scannerConnection}</span>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={device.scannerAutoEnter}
                onChange={(e) => setDevice((p) => ({ ...p, scannerAutoEnter: e.target.checked }))}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">
                Tự động xuống dòng sau khi quét
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type TabKey = 'store' | 'tax' | 'payment' | 'device'

const tabs: { key: TabKey; label: string; sectionId: string }[] = [
  { key: 'store',   label: 'Cửa hàng',       sectionId: 'section-store' },
  { key: 'tax',     label: 'Thuế & Hóa đơn', sectionId: 'section-tax' },
  { key: 'payment', label: 'Thanh toán',      sectionId: 'section-payment' },
  { key: 'device',  label: 'Thiết bị',        sectionId: 'section-device' },
]

const SystemSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('store')
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (tab: typeof tabs[number]) => {
    setActiveTab(tab.key)
    const el = document.getElementById(tab.sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <DashboardLayout
      title="Cài đặt hệ thống"
      breadcrumb={[{ label: 'Cấu hình' }, { label: 'Cài đặt hệ thống' }]}
    >
      <div ref={scrollRef} className="flex flex-col gap-8 w-full pb-12 animate-fade-in">
        {/* Tab nav */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => scrollToSection(tab)}
              className={`px-6 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        <StoreSection id="section-store" />
        <TaxSection id="section-tax" />
        <PaymentSection id="section-payment" />
        <DeviceSection id="section-device" />
      </div>
    </DashboardLayout>
  )
}

export default SystemSettingsPage
