import { useState } from 'react'
import { createPortal } from 'react-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { unitConversions, units } from '../mock/units'

const UnitConversionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fromUnit, setFromUnit] = useState(units[0]?.id || '')
  const [toUnit, setToUnit] = useState(units[1]?.id || '')
  const [conversionRate, setConversionRate] = useState<number | ''>(24)

  const getUnitName = (id: string) => {
    return units.find((u) => u.id === id)?.name || id
  }

  const getShortName = (id: string) => {
    const short = units.find((u) => u.id === id)?.shortName || id
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

  return (
    <DashboardLayout title="Quản lý Quy đổi đơn vị tính" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Đơn vị tính' }]}>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Quản lý Đơn vị tính & Quy đổi
          </h2>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            Thiết lập các quy tắc chuyển đổi giữa các đơn vị đo lường khác nhau để tự động hóa quá trình nhập xuất kho và bán hàng.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-br from-primary to-blue-800 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Thêm quy tắc mới
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Tên đơn vị
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Đơn vị cơ bản
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Đơn vị quy đổi
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Tỷ lệ quy đổi
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {unitConversions.map((conv, index) => {
                const fromName = getUnitName(conv.fromUnitId)
                const toName = getUnitName(conv.toUnitId)
                const shortFrom = getShortName(conv.fromUnitId)

                return (
                  <tr
                    key={conv.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${getBgColor(index)}`}
                        >
                          {shortFrom}
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {fromName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-900 dark:text-white">
                      {fromName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">
                      {toName}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                        1 {fromName} = {conv.conversionRate} {toName}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {conv.isDefault ? 'Mặc định' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thêm quy tắc quy đổi</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Đơn vị lớn
                  </label>
                  <div className="relative">
                    <select 
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none pr-10"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="col-span-1 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Đơn vị nhỏ
                  </label>
                  <div className="relative">
                    <select 
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none pr-10"
                    >
                       {units.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="col-span-2 space-y-2 pt-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                    Số lượng quy đổi
                  </label>
                 <div className="relative group">
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-4 text-2xl font-black text-primary focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                      type="number"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(e.target.value === '' ? '' : Number(e.target.value))}
                      min="1"
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300 rounded-b-xl"></div>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {getUnitName(toUnit)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-1">
                    Gợi ý: 1 {getUnitName(fromUnit)} tương ứng với {conversionRate || 0} {getUnitName(toUnit)} sản phẩm.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100/50 dark:border-blue-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm text-xs font-bold text-primary dark:text-blue-400">
                    1 {getUnitName(fromUnit)}
                  </div>
                  <span className="material-symbols-outlined text-blue-300 dark:text-blue-700">arrow_forward</span>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm text-xs font-bold text-primary dark:text-blue-400">
                    {conversionRate || 0} {getUnitName(toUnit)}
                  </div>
                </div>
                <span className="material-symbols-outlined text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3 justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                 onClick={() => setIsModalOpen(false)}
                className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </DashboardLayout>
  )
}

export default UnitConversionPage
