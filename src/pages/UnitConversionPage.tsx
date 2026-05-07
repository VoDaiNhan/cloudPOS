import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { unitConversionService, unitService, type UnitConversion, type UnitItem } from '../services/unitService'

const UnitConversionPage = () => {
  const [units, setUnits] = useState<UnitItem[]>([])
  const [conversions, setConversions] = useState<UnitConversion[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const largeUnitsList = units.filter(u => !u.isBase)
  const smallUnitsList = units.filter(u => u.isBase)

  const [fromUnit, setFromUnit] = useState(largeUnitsList[0]?.id || '')
  const [toUnit, setToUnit] = useState(smallUnitsList[0]?.id || '')
  const [conversionRate, setConversionRate] = useState<number | ''>(24)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError('')
      try {
        const [unitData, conversionData] = await Promise.all([
          unitService.getAll(),
          unitConversionService.getAll(),
        ])
        setUnits(unitData)
        setConversions(conversionData)
        const large = unitData.find(u => !u.isBase)
        const small = unitData.find(u => u.isBase)
        if (large) setFromUnit(large.id)
        if (small) setToUnit(small.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu đơn vị tính.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const handleFromUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFrom = e.target.value
    setFromUnit(newFrom)
    if (newFrom === toUnit) {
      const nextUnit = smallUnitsList.find(u => u.id !== newFrom)
      if (nextUnit) setToUnit(nextUnit.id)
    }
  }

  const getUnitName = (id: string) => {
    return units.find((u) => u.id === id)?.name || id
  }

  const getShortName = (id: string) => {
    const short = units.find((u) => u.id === id)?.name || id
    return short.substring(0, 2).toUpperCase()
  }

  const getBgColor = (index: number) => {
    const colors = [
      'bg-blue-50 text-blue-700',
      'bg-emerald-50 text-emerald-700',
      'bg-orange-50 text-orange-700',
      'bg-purple-50 text-purple-700',
      'bg-rose-50 text-rose-700',
    ]
    return colors[index % colors.length]
  }

  const handleOpenAddModal = () => {
    setEditingId(null)
    setFromUnit(largeUnitsList[0]?.id || '')
    setToUnit(smallUnitsList[0]?.id || '')
    setConversionRate(24)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (conv: UnitConversion) => {
    setEditingId(conv.id)
    setFromUnit(conv.fromUnitId)
    setToUnit(conv.toUnitId)
    setConversionRate(conv.rate)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) {
      try {
        await unitConversionService.delete(id)
        setConversions(prev => prev.filter(c => c.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể xóa quy tắc quy đổi.')
      }
    }
  }

  const handleSave = async () => {
    const rate = typeof conversionRate === 'number' ? conversionRate : 1
    setError('')
    try {
      if (editingId) {
        await unitConversionService.delete(editingId)
      }
      const saved = await unitConversionService.create({
        fromUnitId: fromUnit,
        toUnitId: toUnit,
        rate,
      })
      setConversions(prev => editingId ? [...prev.filter(c => c.id !== editingId), saved] : [...prev, saved])
      setIsModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu quy tắc quy đổi.')
    }
  }

  return (
    <DashboardLayout title="Quản lý Quy đổi" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Đơn vị tính' }]}>
      <div className="bg-surface-container-low min-h-[calc(100vh-8rem)] rounded-xl -mt-8 -mx-8 px-10 pt-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
              Quản lý Đơn vị tính & Quy đổi
            </h2>
            <p className="text-on-surface-variant text-sm max-w-xl leading-relaxed">
              Thiết lập các quy tắc chuyển đổi giữa các đơn vị đo lường khác nhau để tự động hóa quá trình nhập xuất kho và bán hàng.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            disabled={units.length < 2}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg ghost-shadow hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Thêm quy tắc mới
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl overflow-hidden ghost-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                    Đơn vị lớn
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                    Đơn vị nhỏ
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                    Tỷ lệ quy đổi
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Đang tải dữ liệu đơn vị tính...
                    </td>
                  </tr>
                ) : conversions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Chưa có quy tắc nào. Vui lòng bấm "Thêm quy tắc mới".
                    </td>
                  </tr>
                ) : (
                  conversions.map((conv, index) => {
                    const fromUnitId = conv.fromUnitId
                    const toUnitId = conv.toUnitId
                    const rate = conv.rate
                    const fromName = getUnitName(fromUnitId)
                    const toName = getUnitName(toUnitId)
                    const shortFrom = getShortName(fromUnitId)

                    return (
                      <tr
                        key={conv.id}
                        className="hover:bg-surface-container-highest transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${getBgColor(index)}`}
                            >
                              {shortFrom}
                            </div>
                            <span className="text-sm font-semibold text-on-surface">
                              {fromName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface-variant">
                          {toName}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                            1 {fromName} = {rate} {toName}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-secondary-container text-on-secondary-container">
                            Hoạt động
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpenEditModal(conv)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(conv.id)}
                              className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl overflow-hidden ghost-shadow relative animate-fade-in">
              <div className="px-8 py-6 flex justify-between items-center border-b border-surface-container">
                <h3 className="text-xl font-bold text-on-surface">
                  {editingId ? 'Chỉnh sửa quy tắc' : 'Thêm quy tắc quy đổi'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-1 space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant block">
                      Đơn vị lớn
                    </label>
                    <div className="relative">
                      <select 
                        value={fromUnit}
                        onChange={handleFromUnitChange}
                        className="w-full appearance-none bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none pr-10 text-on-surface"
                      >
                        {largeUnitsList.map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant block">
                      Đơn vị nhỏ
                    </label>
                    <div className="relative">
                      <select 
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full appearance-none bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none pr-10 text-on-surface"
                      >
                         {smallUnitsList.filter(u => u.id !== fromUnit).map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2 pt-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant block">
                      Số lượng quy đổi
                    </label>
                   <div className="relative group">
                      <input
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 text-2xl font-black text-primary-container focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                        type="number"
                        value={conversionRate}
                        onChange={(e) => setConversionRate(e.target.value === '' ? '' : Number(e.target.value))}
                        min="1"
                      />
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300"></div>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {getUnitName(toUnit)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic mt-1">
                      Gợi ý: 1 {getUnitName(fromUnit)} tương ứng với {conversionRate || 0} {getUnitName(toUnit)} sản phẩm.
                    </p>
                  </div>
                </div>

                <div className="bg-primary-fixed/20 p-4 rounded-lg border border-primary-fixed flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded shadow-sm text-xs font-bold text-primary">
                      1 {getUnitName(fromUnit)}
                    </div>
                    <span className="material-symbols-outlined text-primary/60">arrow_forward</span>
                    <div className="bg-white p-2 rounded shadow-sm text-xs font-bold text-primary">
                      {conversionRate || 0} {getUnitName(toUnit)}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
              </div>

              <div className="px-8 py-6 bg-surface-container-low flex gap-3 justify-end border-t border-surface-container">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-slate-200/50 rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                   onClick={handleSave}
                  className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  {editingId ? 'Cập nhật' : 'Lưu cấu hình'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </DashboardLayout>
  )
}

export default UnitConversionPage
