import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import VoiceOverlay from '../components/VoiceOverlay'

interface ImportItem {
  id: string
  name: string
  sku: string
  unit: string
  unitOptions: string[]
  quantity: number
  conversionRate: number
  conversionUnit: string
  unitPrice: number
  expiryDate: string
  batchNumber: string
}

const defaultItems: ImportItem[] = [
  {
    id: '1',
    name: 'Sữa tươi TH True Milk 1L',
    sku: 'Milk-001',
    unit: 'Thùng (12 hộp)',
    unitOptions: ['Thùng (12 hộp)', 'Vỉ (4 hộp)', 'Hộp'],
    quantity: 10,
    conversionRate: 12,
    conversionUnit: 'hộp',
    unitPrice: 340000,
    expiryDate: '2024-12-31',
    batchNumber: 'BATCH-202',
  },
  {
    id: '2',
    name: 'Gạo ST25 Túi 5kg',
    sku: 'Rice-ST25',
    unit: 'Bao (10 túi)',
    unitOptions: ['Bao (10 túi)', 'Túi'],
    quantity: 5,
    conversionRate: 10,
    conversionUnit: 'túi',
    unitPrice: 1450000,
    expiryDate: '2025-06-20',
    batchNumber: 'L-G25-01',
  },
]

const suppliers = [
  'Công ty TNHH Thực phẩm Sạch',
  'Nhà máy Sữa ABC',
  'Nông trại VietGAP',
  'Đại lý Gạo Miền Tây',
]

const ImportOrderPage = () => {
  const navigate = useNavigate()
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [importDate, setImportDate] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
  })
  const [items, setItems] = useState<ImportItem[]>(defaultItems)
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)

  const orderCode = `PNK-${importDate.replace(/-/g, '')}-001`

  // Update item field
  const updateItem = useCallback((id: string, field: keyof ImportItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }, [])

  // Remove item
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Add new empty item
  const addItem = useCallback(() => {
    const newItem: ImportItem = {
      id: Date.now().toString(),
      name: '',
      sku: '',
      unit: 'Cái',
      unitOptions: ['Cái', 'Hộp', 'Thùng'],
      quantity: 1,
      conversionRate: 1,
      conversionUnit: 'cái',
      unitPrice: 0,
      expiryDate: '',
      batchNumber: '',
    }
    setItems((prev) => [...prev, newItem])
  }, [])

  // Voice result handler — adds a mock product
  const handleVoiceResult = useCallback(() => {
    const voiceItem: ImportItem = {
      id: Date.now().toString(),
      name: 'Nước mắm Phú Quốc 500ml',
      sku: 'NM-PQ500',
      unit: 'Thùng (24 chai)',
      unitOptions: ['Thùng (24 chai)', 'Chai'],
      quantity: 3,
      conversionRate: 24,
      conversionUnit: 'chai',
      unitPrice: 890000,
      expiryDate: '2026-06-15',
      batchNumber: 'NM-2025-03',
    }
    setItems((prev) => [...prev, voiceItem])
  }, [])

  // Calculations
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items]
  )
  const discount = 0
  const vatRate = 10
  const vatAmount = Math.round((subtotal - discount) * vatRate / 100)
  const grandTotal = subtotal - discount + vatAmount

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Import order saved:', { selectedSupplier, orderCode, importDate, items, note, grandTotal })
    setIsLoading(false)
    navigate('/suppliers')
  }

  return (
    <DashboardLayout title="Tạo phiếu nhập kho" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Nhập kho' }]}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Tạo Phiếu Nhập Kho
          </h2>
        </div>
      </div>

      <div className="space-y-6 max-w-6xl">
        {/* ── General Info ── */}
        <section className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Thông tin chung</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nhà cung cấp <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:ring-2 focus:ring-primary/20 py-3.5"
              >
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã phiếu</label>
              <input
                type="text"
                value={orderCode}
                readOnly
                className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-900 text-sm text-slate-400 font-bold cursor-not-allowed py-3.5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ngày nhập kho</label>
              <input
                type="date"
                value={importDate}
                onChange={(e) => setImportDate(e.target.value)}
                className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-900 text-sm font-bold focus:ring-2 focus:ring-primary/20 py-3.5"
              />
            </div>
          </div>
        </section>

        {/* ── Product Table ── */}
        <section className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm relative">
          <VoiceOverlay
            isOpen={voiceOpen}
            onClose={() => setVoiceOpen(false)}
            subtitle="Đọc tên sản phẩm và số lượng để thêm nhanh"
            onResult={handleVoiceResult}
            simulatedResult="Nước mắm Phú Quốc 500ml, 3 thùng"
          />
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Danh sách sản phẩm nhập</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVoiceOpen(true)}
                className="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all border border-orange-100 shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">mic</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <p className="font-black mb-1 uppercase tracking-widest">Lệnh giọng nói (Thử nghiệm)</p>
                  <p className="text-slate-300 italic">"Đọc tên sản phẩm và số lượng để thêm nhanh"</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                </div>
              </button>
              <button
                onClick={addItem}
                className="bg-primary/10 text-primary px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Thêm sản phẩm
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Số lượng</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quy đổi</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Đơn giá</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn SD / Lô</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thành tiền</th>
                  <th className="px-4 py-4 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-5">
                      {item.name ? (
                        <>
                          <div className="text-sm font-black text-slate-900 dark:text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">SKU: {item.sku}</div>
                        </>
                      ) : (
                        <input
                          type="text"
                          placeholder="Tên sản phẩm"
                          className="w-full border-none bg-transparent p-0 text-sm font-bold focus:ring-0 placeholder:text-slate-300"
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        />
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        className="w-full border-none bg-transparent p-0 text-sm font-bold focus:ring-0"
                      >
                        {item.unitOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-5">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-2.5 text-sm text-center font-black focus:ring-2 focus:ring-primary/20"
                      />
                    </td>
                    <td className="px-4 py-5">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-500">
                        {item.quantity * item.conversionRate} {item.conversionUnit}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <input
                        type="text"
                        value={item.unitPrice.toLocaleString('vi-VN')}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '')
                          updateItem(item.id, 'unitPrice', Number(raw))
                        }}
                        className="w-full border-none bg-transparent p-0 text-sm font-black focus:ring-0"
                      />
                    </td>
                    <td className="px-4 py-5 space-y-2">
                      <input
                        type="date"
                        value={item.expiryDate}
                        onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                        className="block w-full text-[11px] bg-slate-50 dark:bg-slate-900 border-none rounded-lg p-2 font-bold focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="text"
                        value={item.batchNumber}
                        onChange={(e) => updateItem(item.id, 'batchNumber', e.target.value)}
                        placeholder="Số lô"
                        className="block w-full text-[11px] bg-slate-50 dark:bg-slate-900 border-none rounded-lg p-2 font-bold focus:ring-2 focus:ring-primary/20 placeholder:text-slate-300"
                      />
                    </td>
                    <td className="px-4 py-5 text-right">
                      <div className="text-sm font-black text-primary">
                        {(item.quantity * item.unitPrice).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-300 dark:text-slate-600">
                      <span className="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>
                      <p className="text-sm font-bold">Chưa có sản phẩm nào</p>
                      <p className="text-xs text-slate-400 mt-1">Nhấn "Thêm sản phẩm" để bắt đầu</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Notes + Summary ── */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Notes */}
          <div className="flex-1">
            <section className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-8 h-full shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Ghi chú phiếu nhập</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-primary/20 resize-none p-5 placeholder:text-slate-400"
                placeholder="Nhập ghi chú hoặc hướng dẫn nhận hàng..."
                rows={4}
              />
            </section>
          </div>

          {/* Totals */}
          <div className="w-full md:w-96">
            <section className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold">Tạm tính ({items.length} mặt hàng)</span>
                <span className="font-black text-slate-900 dark:text-white">{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold">Chiết khấu</span>
                <span className="font-black text-rose-500">-{discount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold">Thuế GTGT ({vatRate}%)</span>
                <span className="font-black text-slate-900 dark:text-white">{vatAmount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-base font-black text-slate-900 dark:text-white">Tổng tiền nhập</span>
                <span className="text-2xl font-black text-primary tracking-tight">{grandTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            </section>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-3 pt-4 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-10 py-3.5 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                Đang lưu...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Lưu phiếu nhập
              </>
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ImportOrderPage
