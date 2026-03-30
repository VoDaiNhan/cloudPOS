import { useState, useEffect } from 'react'
import type { Batch, BatchAllocation } from '../types/batch'
import { allocateBatches, calculateDaysUntilExpiry } from '../utils/batchAllocator'

interface BatchSelectorProps {
  productId: string
  productName: string
  batches: Batch[]
  requestedQuantity: number
  onSelect: (allocations: BatchAllocation[]) => void
  onCancel: () => void
  strategy?: 'FEFO' | 'FIFO' | 'MANUAL'
}

export const BatchSelector = ({
  productId,
  productName,
  batches,
  requestedQuantity,
  onSelect,
  onCancel,
  strategy = 'FEFO',
}: BatchSelectorProps) => {
  const [allocations, setAllocations] = useState<BatchAllocation[]>([])
  const [manualSelections, setManualSelections] = useState<Map<string, number>>(new Map())

  // Auto-allocate on mount (for FEFO/FIFO)
  useEffect(() => {
    if (strategy !== 'MANUAL') {
      const allocated = allocateBatches(batches, requestedQuantity, strategy)
      setAllocations(allocated)
    }
  }, [batches, requestedQuantity, strategy])

  const handleManualQuantityChange = (batchId: string, quantity: number) => {
    const newSelections = new Map(manualSelections)
    if (quantity > 0) {
      newSelections.set(batchId, quantity)
    } else {
      newSelections.delete(batchId)
    }
    setManualSelections(newSelections)

    // Update allocations
    const newAllocations: BatchAllocation[] = []
    newSelections.forEach((qty, bId) => {
      const batch = batches.find((b) => b.id === bId)
      if (batch) {
        newAllocations.push({
          batchId: batch.id,
          batchNumber: batch.batchNumber,
          expiryDate: batch.expiryDate,
          quantity: qty,
          availableQuantity: batch.availableQuantity,
          daysUntilExpiry: calculateDaysUntilExpiry(batch.expiryDate),
          priority: 0,
        })
      }
    })
    setAllocations(newAllocations)
  }

  const totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.quantity, 0)
  const isFullyAllocated = totalAllocated >= requestedQuantity
  const isOverAllocated = totalAllocated > requestedQuantity

  const getExpiryColor = (days: number) => {
    if (days < 0) return 'text-rose-600'
    if (days <= 7) return 'text-orange-600'
    if (days <= 30) return 'text-amber-600'
    return 'text-emerald-600'
  }

  const getExpiryBg = (days: number) => {
    if (days < 0) return 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'
    if (days <= 7) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
    if (days <= 30) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-black mb-1">Chọn lô hàng để xuất</h2>
              <p className="text-sm opacity-90">Sản phẩm: {productName}</p>
            </div>
            <button
              onClick={onCancel}
              className="size-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Strategy Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-widest">
              Chiến lược: {strategy}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black">
              Cần xuất: {requestedQuantity} sản phẩm
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Allocation Summary */}
          <div className={`rounded-xl border-2 p-4 ${
            isOverAllocated
              ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'
              : isFullyAllocated
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-2xl ${
                  isOverAllocated ? 'text-rose-600' : isFullyAllocated ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {isOverAllocated ? 'error' : isFullyAllocated ? 'check_circle' : 'warning'}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {isOverAllocated
                      ? 'Đã chọn quá số lượng cần xuất'
                      : isFullyAllocated
                      ? 'Đã chọn đủ số lượng'
                      : 'Chưa đủ số lượng'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Đã chọn: {totalAllocated} / {requestedQuantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {totalAllocated}
                </p>
                <p className="text-xs text-slate-500">từ {allocations.length} lô</p>
              </div>
            </div>
          </div>

          {/* Batch List */}
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              Danh sách lô hàng ({batches.length})
            </h3>

            <div className="space-y-3">
              {batches.map((batch, index) => {
                const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiryDate)
                const allocation = allocations.find((a) => a.batchId === batch.id)
                const isAllocated = !!allocation

                return (
                  <div
                    key={batch.id}
                    className={`rounded-xl border-2 p-4 transition-all ${
                      isAllocated
                        ? 'border-primary bg-primary/5'
                        : batch.isBlocked
                        ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-50'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {isAllocated && (
                            <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black">
                              {allocation.priority || index + 1}
                            </span>
                          )}
                          <p className="font-black text-slate-900 dark:text-white">
                            Lô: {batch.batchNumber}
                          </p>
                          {batch.isBlocked && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-[9px] font-black uppercase">
                              Đã chặn
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>Nhập: {new Date(batch.importDate).toLocaleDateString('vi-VN')}</span>
                          <span>•</span>
                          <span>Tồn: {batch.availableQuantity} {batch.unitName}</span>
                        </div>
                      </div>

                      <div className={`text-right px-3 py-1.5 rounded-lg border ${getExpiryBg(daysUntilExpiry)}`}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                          Hạn sử dụng
                        </p>
                        <p className={`text-sm font-black ${getExpiryColor(daysUntilExpiry)}`}>
                          {new Date(batch.expiryDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                          {daysUntilExpiry < 0
                            ? `Hết hạn ${Math.abs(daysUntilExpiry)} ngày`
                            : `Còn ${daysUntilExpiry} ngày`}
                        </p>
                      </div>
                    </div>

                    {/* Allocation Input */}
                    {strategy === 'MANUAL' ? (
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-slate-600 dark:text-slate-400">
                          Số lượng xuất:
                        </label>
                        <input
                          type="number"
                          value={manualSelections.get(batch.id) || ''}
                          onChange={(e) =>
                            handleManualQuantityChange(batch.id, parseFloat(e.target.value) || 0)
                          }
                          max={batch.availableQuantity}
                          min="0"
                          disabled={batch.isBlocked}
                          placeholder="0"
                          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800"
                        />
                        <span className="text-sm text-slate-500">/ {batch.availableQuantity}</span>
                      </div>
                    ) : (
                      isAllocated && (
                        <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3">
                          <span className="text-sm font-bold text-primary">
                            Xuất từ lô này:
                          </span>
                          <span className="text-lg font-black text-primary">
                            {allocation.quantity} {batch.unitName}
                          </span>
                        </div>
                      )
                    )}

                    {batch.isBlocked && batch.blockReason && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded-lg p-2">
                        <span className="material-symbols-outlined text-sm">block</span>
                        <span>{batch.blockReason}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
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
            onClick={() => onSelect(allocations)}
            disabled={!isFullyAllocated || isOverAllocated}
            className="flex-1 rounded-xl bg-primary py-3 font-black text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Xác nhận xuất hàng
          </button>
        </div>
      </div>
    </div>
  )
}
