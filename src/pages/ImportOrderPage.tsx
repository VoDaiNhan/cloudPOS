import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import VoiceOverlay from '../components/VoiceOverlay'
import { useProductStore } from '../store/productStore'
import type { Product } from '../types/product'
import type { ImportItem } from '../types/importOrder'
import { mockSuppliers, mockDefaultImportItems } from '../mock/importOrders'
import { standardUnits as units, sampleConversions as unitConversions } from '../mock/units'

const ImportOrderPage = () => {
  const navigate = useNavigate()
  const { products, importStocks } = useProductStore()
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [importDate, setImportDate] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
  })
  const [items, setItems] = useState<ImportItem[]>(mockDefaultImportItems)
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)

  const orderCode = `PNK-${importDate.replace(/-/g, '')}-001`

  const productByCode = useMemo(
    () => new Map(products.map((product) => [product.code.toUpperCase(), product])),
    [products]
  )

  const buildUnitDataFromProduct = useCallback((product: Product) => {
    const baseUnit = product.baseUnit?.trim() || 'cái'
    const rates: Record<string, number> = { [baseUnit]: 1 }
    product.conversions?.forEach((conversion) => {
      if (!conversion.unitName?.trim()) return
      rates[conversion.unitName] = Math.max(1, Number(conversion.value) || 1)
    })

    const sortedUnits = Object.entries(rates)
      .sort((a, b) => b[1] - a[1])
      .map(([unitName]) => unitName)
    const selectedUnit = sortedUnits[0] || baseUnit

    const allUnits = Array.from(new Set([...sortedUnits, ...units.map(u => u.name)]))

    let initialRate = rates[selectedUnit] ?? 1
    let initialConversionUnit = baseUnit

    // If it's a 1:1 mapping (usually base unit), try to expand it globally
    if (initialRate === 1 && initialConversionUnit.toLowerCase() === selectedUnit.toLowerCase()) {
      const unitObj = units.find(u => u.name.toLowerCase() === selectedUnit.toLowerCase())
      if (unitObj) {
        const userConfiguredConv = unitConversions.find(c => c.fromUnit === unitObj.id)
        if (userConfiguredConv) {
          const toUnitObj = units.find(u => u.id === userConfiguredConv.toUnit)
          if (toUnitObj) {
            initialRate = userConfiguredConv.rate
            initialConversionUnit = toUnitObj.name
          }
        }
      }
      
      // generic fallback if still 1:1
      if (initialRate === 1 && initialConversionUnit.toLowerCase() === selectedUnit.toLowerCase()) {
        const genericFallback = sampleConversions.find(
          c => c.fromUnit.toLowerCase() === selectedUnit.toLowerCase()
        )
        if (genericFallback) {
          initialRate = genericFallback.rate
          initialConversionUnit = genericFallback.toUnit
        }
      }
    }

    return {
      unit: selectedUnit,
      unitOptions: allUnits,
      unitRates: rates,
      conversionRate: initialRate,
      conversionUnit: initialConversionUnit,
      unitPrice: Math.round(product.costPrice ?? product.price ?? 0),
    }
  }, [])

  const applyProductToItem = useCallback((item: ImportItem, product: Product): ImportItem => {
    const unitData = buildUnitDataFromProduct(product)
    return {
      ...item,
      linkedProductId: product.id,
      name: product.name,
      sku: product.code,
      ...unitData,
    }
  }, [buildUnitDataFromProduct])

  // Update item field
  const updateItem = useCallback((id: string, field: keyof ImportItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }, [])

  const updateItemSku = useCallback((id: string, rawSku: string) => {
    const sku = rawSku.trim().toUpperCase()
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        const matched = productByCode.get(sku)
        if (matched) {
          return applyProductToItem(item, matched)
        }

        return {
          ...item,
          linkedProductId: undefined,
          sku,
        }
      })
    )
  }, [applyProductToItem, productByCode])

  const selectProductForItem = useCallback((id: string, productId: string) => {
    if (!productId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, linkedProductId: undefined, name: '', sku: '' }
            : item
        )
      )
      return
    }

    const product = products.find((candidate) => candidate.id === productId)
    if (!product) return

    setItems((prev) =>
      prev.map((item) => (item.id === id ? applyProductToItem(item, product) : item))
    )
  }, [applyProductToItem, products])

  const updateItemUnit = useCallback((id: string, unit: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        let nextRate = item.unitRates[unit]
        let nextConversionUnit = item.conversionUnit

        if (nextRate === undefined || (nextRate === 1 && nextConversionUnit.toLowerCase() === unit.toLowerCase())) {
          // 1. Lookup globally configured conversions
          const unitObj = units.find(u => u.name.toLowerCase() === unit.toLowerCase())
          if (unitObj) {
            const userConfiguredConv = unitConversions.find(c => c.fromUnit === unitObj.id)
            if (userConfiguredConv) {
              const toUnitObj = units.find(u => u.id === userConfiguredConv.toUnit)
              if (toUnitObj) {
                nextRate = userConfiguredConv.rate
                nextConversionUnit = toUnitObj.name
              }
            }
          }

          // 2. Fallback to generic templates
          if (nextRate === undefined || (nextRate === 1 && nextConversionUnit.toLowerCase() === unit.toLowerCase())) {
            const genericFallback = sampleConversions.find(
              c => c.fromUnit.toLowerCase() === unit.toLowerCase()
            )
            if (genericFallback) {
              nextRate = genericFallback.rate
              nextConversionUnit = genericFallback.toUnit
            } else {
              if (nextRate === undefined) {
                nextRate = 1
                nextConversionUnit = item.linkedProductId ? item.conversionUnit : unit
              }
            }
          }
        }

        return {
          ...item,
          unit,
          conversionRate: nextRate,
          conversionUnit: nextConversionUnit,
        }
      })
    )
  }, [])


  // Remove item
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Add new empty item
  const addItem = useCallback(() => {
    const allUnits = units.map(u => u.name)
    const newItem: ImportItem = {
      id: Date.now().toString(),
      name: '',
      sku: '',
      unit: 'Cái',
      unitOptions: Array.from(new Set(['Cái', 'Hộp', 'Thùng', ...allUnits])),
      unitRates: {},
      quantity: 1,
      conversionRate: 1,
      conversionUnit: 'Cái',
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
      unit: 'Thùng',
      unitOptions: ['Thùng', 'Chai'],
      unitRates: {
        Thùng: 24,
        Chai: 1,
      },
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
  const totalConvertedUnits = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.conversionRate, 0),
    [items]
  )
  const discount = 0
  const vatRate = 10
  const vatAmount = Math.round((subtotal - discount) * vatRate / 100)
  const grandTotal = subtotal - discount + vatAmount

  const handleSave = async () => {
    const invalidItem = items.find(
      (item) =>
        !item.name.trim() ||
        !item.sku.trim() ||
        !item.batchNumber.trim() ||
        item.quantity <= 0 ||
        item.conversionRate <= 0
    )

    if (invalidItem) {
      alert('Mỗi dòng nhập phải có tên, mã SKU, số lô và số lượng hợp lệ để theo dõi FIFO/FEFO.')
      return
    }

    const invalidExpiry = items.find(
      (item) => item.expiryDate && item.expiryDate < importDate
    )

    if (invalidExpiry) {
      alert('Hạn sử dụng không được sớm hơn ngày nhập kho.')
      return
    }

    const seenBatches = new Set<string>()
    const duplicatedBatch = items.find((item) => {
      const key = `${item.sku.trim().toUpperCase()}::${item.batchNumber.trim().toUpperCase()}`
      if (seenBatches.has(key)) return true
      seenBatches.add(key)
      return false
    })

    if (duplicatedBatch) {
      alert('Không thể lưu hai dòng trùng SKU và số lô trong cùng một phiếu nhập.')
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const normalizedItems = items.map((item) => ({
      ...item,
      sku: item.sku || `NEW-${Date.now()}-${item.id.slice(-4)}`,
      normalizedQuantity: item.quantity * item.conversionRate,
      normalizedUnit: item.conversionUnit,
    }))

    const result = importStocks(
      normalizedItems.map((item) => ({
        sku: item.sku,
        name: item.name,
        quantityInBaseUnit: item.normalizedQuantity,
        baseUnit: item.normalizedUnit,
        costPrice: item.unitPrice > 0 && item.conversionRate > 0 ? Math.round(item.unitPrice / item.conversionRate) : 0,
        batchNumber: item.batchNumber.trim(),
        expiryDate: item.expiryDate || undefined,
        receivedDate: importDate,
      }))
    )

    console.log('Import order saved:', {
      selectedSupplier,
      orderCode,
      importDate,
      items: normalizedItems,
      note,
      grandTotal,
    })
    setIsLoading(false)
    alert(`Đã nhập kho thành công. Cập nhật ${result.updated} sản phẩm, tạo mới ${result.created} sản phẩm.`)
    navigate('/inventory')
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

      <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50/80 p-5 text-sm text-amber-900 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-600">schedule</span>
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-amber-700">
              Quy tắc xuất kho theo date
            </p>
            <p className="font-medium leading-relaxed">
              CloudPOS sẽ ưu tiên <span className="font-black">FEFO</span> cho hàng có hạn sử dụng và
              <span className="font-black"> FIFO</span> cho hàng không theo dõi hạn. Vì vậy mỗi dòng nhập cần có số lô,
              ngày nhập và hạn dùng hợp lệ để tránh tồn đọng hàng cận date.
            </p>
          </div>
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
                {mockSuppliers.map((s) => (
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
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[250px] w-1/3">Sản phẩm</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[150px]">Đơn vị</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 min-w-[100px]">Số lượng</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[120px]">Quy đổi</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 min-w-[120px]">Đơn giá</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[140px]">Hạn SD / Lô</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thành tiền</th>
                  <th className="px-4 py-4 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <select
                          value={item.linkedProductId || ''}
                          onChange={(e) => selectProductForItem(item.id, e.target.value)}
                          className="w-full max-w-[300px] bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 truncate"
                        >
                          <option value="">Chọn từ danh sách tồn kho</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.code} - {product.name}
                            </option>
                          ))}
                        </select>

                        {item.linkedProductId ? (
                          <div className="min-w-0 max-w-[300px]">
                            <div className="text-sm font-black text-slate-900 dark:text-white truncate" title={item.name}>{item.name}</div>
                            <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5 truncate" title={`SKU: ${item.sku}`}>Đã liên kết tồn kho • SKU: {item.sku}</div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={item.name}
                              placeholder="Tên sản phẩm mới"
                              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 placeholder:text-slate-300"
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            />
                            <input
                              type="text"
                              value={item.sku}
                              placeholder="SKU (có thể để trống)"
                              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-2.5 text-sm font-bold uppercase focus:ring-2 focus:ring-primary/20 placeholder:text-slate-300"
                              onChange={(e) => updateItemSku(item.id, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="relative">
                        <select
                          value={item.unit}
                          onChange={(e) => updateItemUnit(item.id, e.target.value)}
                          className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-slate-900 border-none p-2.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 pr-8"
                        >
                          {item.unitOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
                          expand_more
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const parsed = Number(e.target.value)
                          updateItem(item.id, 'quantity', Number.isFinite(parsed) ? parsed : 0)
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-2.5 text-sm text-center font-black focus:ring-2 focus:ring-primary/20"
                      />
                    </td>
                    <td className="px-4 py-5">
                      <div className="space-y-2">
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/50 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-blue-700 dark:text-blue-400">
                              1 {item.unit || '?'}
                            </span>
                            <span className="material-symbols-outlined text-blue-300 dark:text-blue-700 text-sm">arrow_forward</span>
                            <span className="text-xs font-black text-blue-700 dark:text-blue-400">
                              {item.conversionRate} {item.conversionUnit}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1 mt-1">
                          Tổng: {(item.quantity * item.conversionRate).toLocaleString('vi-VN')} {item.conversionUnit}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <input
                        type="number"
                        min={0}
                        value={item.unitPrice}
                        onChange={(e) => {
                          const parsed = Number(e.target.value)
                          updateItem(item.id, 'unitPrice', Number.isFinite(parsed) ? Math.max(0, parsed) : 0)
                        }}
                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border-none p-2.5 text-sm font-black focus:ring-2 focus:ring-primary/20"
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
                <span className="text-slate-400 font-bold">Tổng SL quy đổi</span>
                <span className="font-black text-slate-900 dark:text-white">{totalConvertedUnits.toLocaleString('vi-VN')} đơn vị nhỏ</span>
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
