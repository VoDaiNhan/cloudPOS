import { useState, useMemo } from 'react'
import type { Unit, UnitConversion, ConversionTemplate } from '../types/unit'
import { units, conversionTemplates } from '../mock/units'

interface UnitConversionManagerProps {
  productId: string
  productName: string
  existingConversions?: UnitConversion[]
  onSave: (conversions: UnitConversion[]) => void
  onCancel: () => void
}

export const UnitConversionManager = ({
  productId,
  productName,
  existingConversions = [],
  onSave,
  onCancel,
}: UnitConversionManagerProps) => {
  const [conversions, setConversions] = useState<UnitConversion[]>(existingConversions)
  const [showTemplates, setShowTemplates] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  
  // New conversion form
  const [fromUnitId, setFromUnitId] = useState('')
  const [toUnitId, setToUnitId] = useState('')
  const [rate, setRate] = useState('')

  // Get base units (smallest units)
  const baseUnits = useMemo(() => units.filter(u => u.isBaseUnit), [])
  const largerUnits = useMemo(() => units.filter(u => !u.isBaseUnit), [])

  const addConversion = () => {
    if (!fromUnitId || !toUnitId || !rate || parseFloat(rate) <= 0) {
      alert('Vui lòng điền đầy đủ thông tin quy đổi')
      return
    }

    const newConversion: UnitConversion = {
      id: `conv-${Date.now()}`,
      productId,
      fromUnitId,
      toUnitId,
      conversionRate: parseFloat(rate),
      isDefault: conversions.length === 0, // First one is default
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (editingIndex !== null) {
      // Update existing
      const updated = [...conversions]
      updated[editingIndex] = newConversion
      setConversions(updated)
      setEditingIndex(null)
    } else {
      // Add new
      setConversions([...conversions, newConversion])
    }

    // Reset form
    setFromUnitId('')
    setToUnitId('')
    setRate('')
  }

  const removeConversion = (index: number) => {
    setConversions(conversions.filter((_, i) => i !== index))
  }

  const editConversion = (index: number) => {
    const conv = conversions[index]
    setFromUnitId(conv.fromUnitId)
    setToUnitId(conv.toUnitId)
    setRate(conv.conversionRate.toString())
    setEditingIndex(index)
  }

  const setDefaultConversion = (index: number) => {
    setConversions(
      conversions.map((c, i) => ({
        ...c,
        isDefault: i === index,
      }))
    )
  }

  const applyTemplate = (template: ConversionTemplate) => {
    const newConversions: UnitConversion[] = template.conversions.map((tc, index) => {
      const fromUnit = units.find(u => u.name === tc.fromUnit)
      const toUnit = units.find(u => u.name === tc.toUnit)
      
      if (!fromUnit || !toUnit) return null

      return {
        id: `conv-${Date.now()}-${index}`,
        productId,
        fromUnitId: fromUnit.id,
        toUnitId: toUnit.id,
        conversionRate: tc.rate,
        isDefault: index === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }).filter(Boolean) as UnitConversion[]

    setConversions(newConversions)
    setShowTemplates(false)
  }

  const getUnitName = (unitId: string) => {
    return units.find(u => u.id === unitId)?.name || unitId
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black mb-1">Quản lý đơn vị tính & Quy đổi</h2>
              <p className="text-sm opacity-90">Sản phẩm: {productName}</p>
            </div>
            <button
              onClick={onCancel}
              className="size-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Templates */}
          <div>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              {showTemplates ? 'Ẩn mẫu nhanh' : 'Sử dụng mẫu có sẵn'}
            </button>

            {showTemplates && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {conversionTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="text-left p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {template.name}
                    </p>
                    <p className="text-xs text-slate-500">{template.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Conversion Form */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_circle</span>
              {editingIndex !== null ? 'Chỉnh sửa quy đổi' : 'Thêm quy đổi mới'}
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Đơn vị lớn
                </label>
                <select
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                >
                  <option value="">Chọn đơn vị</option>
                  <optgroup label="Đơn vị lớn">
                    {largerUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Đơn vị nhỏ
                </label>
                <select
                  value={toUnitId}
                  onChange={(e) => setToUnitId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                >
                  <option value="">Chọn đơn vị</option>
                  <optgroup label="Đơn vị cơ bản">
                    {baseUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Tỷ lệ quy đổi
                </label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="24"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
              </div>
            </div>

            {fromUnitId && toUnitId && rate && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  1 {getUnitName(fromUnitId)} = {rate} {getUnitName(toUnitId)}
                </p>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={addConversion}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 font-black text-white hover:bg-primary/90 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-base">
                  {editingIndex !== null ? 'check' : 'add'}
                </span>
                {editingIndex !== null ? 'Cập nhật' : 'Thêm quy đổi'}
              </button>
              {editingIndex !== null && (
                <button
                  onClick={() => {
                    setEditingIndex(null)
                    setFromUnitId('')
                    setToUnitId('')
                    setRate('')
                  }}
                  className="px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-black text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
                >
                  Hủy
                </button>
              )}
            </div>
          </div>

          {/* Conversions List */}
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">swap_horiz</span>
              Danh sách quy đổi ({conversions.length})
            </h3>

            {conversions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                <p className="text-sm font-bold">Chưa có quy đổi nào</p>
                <p className="text-xs mt-1">Thêm quy đổi hoặc chọn mẫu có sẵn</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversions.map((conv, index) => (
                  <div
                    key={conv.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      conv.isDefault
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {conv.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest">
                          Mặc định
                        </span>
                      )}
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        1 {getUnitName(conv.fromUnitId)} = {conv.conversionRate} {getUnitName(conv.toUnitId)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {!conv.isDefault && (
                        <button
                          onClick={() => setDefaultConversion(index)}
                          className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                          title="Đặt làm mặc định"
                        >
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                      )}
                      <button
                        onClick={() => editConversion(index)}
                        className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-all"
                        title="Chỉnh sửa"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => removeConversion(index)}
                        className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 py-3 font-black text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(conversions)}
            className="flex-1 rounded-xl bg-primary py-3 font-black text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  )
}
