import { useState } from 'react'
import type { PricingStrategy } from '../types/pricing'
import { calculatePrices, validatePrices, formatPrice } from '../utils/priceCalculator'

const pricingStrategies: PricingStrategy[] = [
  { id: 'strategy-1', name: 'Tiêu chuẩn', description: 'Lợi nhuận 30% cho bán lẻ, giảm 10% cho bán sỉ', retailMarkupPercent: 30, wholesaleDiscountPercent: 10, isDefault: true },
  { id: 'strategy-2', name: 'Cao cấp', description: 'Lợi nhuận 50% cho bán lẻ, giảm 8% cho bán sỉ', retailMarkupPercent: 50, wholesaleDiscountPercent: 8, isDefault: false },
  { id: 'strategy-3', name: 'Cạnh tranh', description: 'Lợi nhuận 20% cho bán lẻ, giảm 15% cho bán sỉ', retailMarkupPercent: 20, wholesaleDiscountPercent: 15, isDefault: false },
  { id: 'strategy-4', name: 'Khuyến mãi', description: 'Lợi nhuận 25% cho bán lẻ, giảm 20% cho bán sỉ', retailMarkupPercent: 25, wholesaleDiscountPercent: 20, isDefault: false },
]

interface PriceManagerProps {
  productName: string
  initialImportPrice?: number
  initialRetailPrice?: number
  initialWholesalePrice?: number
  onSave: (prices: { importPrice: number; retailPrice: number; wholesalePrice: number }) => void
  onCancel: () => void
}

export const PriceManager = ({
  productName,
  initialImportPrice = 0,
  initialRetailPrice = 0,
  initialWholesalePrice = 0,
  onSave,
  onCancel,
}: PriceManagerProps) => {
  const [importPrice, setImportPrice] = useState(initialImportPrice)
  const [retailPrice, setRetailPrice] = useState(initialRetailPrice)
  const [wholesalePrice, setWholesalePrice] = useState(initialWholesalePrice)
  const [selectedStrategy, setSelectedStrategy] = useState<PricingStrategy | null>(null)
  const [useStrategy, setUseStrategy] = useState(false)

  let displayRetailPrice = retailPrice
  let displayWholesalePrice = wholesalePrice

  if (useStrategy && selectedStrategy && importPrice > 0) {
    const calculated = calculatePrices(importPrice, selectedStrategy)
    displayRetailPrice = calculated.retailPrice
    displayWholesalePrice = calculated.wholesalePrice
  }

  const handleSave = () => {
    const validation = validatePrices(importPrice, displayRetailPrice, displayWholesalePrice)
    if (!validation.valid) {
      alert(validation.errors.join('\n'))
      return
    }
    onSave({ importPrice, retailPrice: displayRetailPrice, wholesalePrice: displayWholesalePrice })
  }

  const retailMargin = displayRetailPrice - importPrice
  const retailMarginPercent = importPrice > 0 ? ((retailMargin / importPrice) * 100).toFixed(2) : 0
  const wholesaleMargin = displayWholesalePrice - importPrice
  const wholesaleMarginPercent = importPrice > 0 ? ((wholesaleMargin / importPrice) * 100).toFixed(2) : 0
  const wholesaleDiscount = displayRetailPrice - displayWholesalePrice
  const wholesaleDiscountPercent = displayRetailPrice > 0 ? ((wholesaleDiscount / displayRetailPrice) * 100).toFixed(2) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black mb-1">Quản lý giá bán</h2>
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
          {/* Strategy Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="use-strategy"
                checked={useStrategy}
                onChange={(e) => setUseStrategy(e.target.checked)}
                className="size-4 rounded border-slate-300"
              />
              <label htmlFor="use-strategy" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Sử dụng chiến lược định giá có sẵn
              </label>
            </div>

            {useStrategy && (
              <div className="grid grid-cols-2 gap-3">
                {pricingStrategies.map((strategy) => (
                  <button
                    key={strategy.id}
                    onClick={() => setSelectedStrategy(strategy)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${
                      selectedStrategy?.id === strategy.id
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {strategy.name}
                    </p>
                    <p className="text-xs text-slate-500">{strategy.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Inputs */}
          <div className="space-y-4">
            {/* Import Price */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Giá nhập (Đơn giá nhập)
              </label>
              <input
                type="number"
                value={importPrice || ''}
                onChange={(e) => setImportPrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">Giá nhập từ nhà cung cấp</p>
            </div>

            {/* Retail Price */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Giá bán lẻ
              </label>
              <input
                type="number"
                value={displayRetailPrice || ''}
                onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
                disabled={useStrategy}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              />
              {retailMargin > 0 && (
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Lợi nhuận:</span>
                  <span className="font-bold text-emerald-600">
                    +{formatPrice(retailMargin)} ({retailMarginPercent}%)
                  </span>
                </div>
              )}
            </div>

            {/* Wholesale Price */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Giá bán sỉ
              </label>
              <input
                type="number"
                value={displayWholesalePrice || ''}
                onChange={(e) => setWholesalePrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
                disabled={useStrategy}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
              />
              {wholesaleMargin > 0 && (
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lợi nhuận:</span>
                    <span className="font-bold text-emerald-600">
                      +{formatPrice(wholesaleMargin)} ({wholesaleMarginPercent}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Giảm so với giá lẻ:</span>
                    <span className="font-bold text-amber-600">
                      -{formatPrice(wholesaleDiscount)} ({wholesaleDiscountPercent}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price Comparison */}
          {importPrice > 0 && displayRetailPrice > 0 && displayWholesalePrice > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-3">So sánh giá</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Giá nhập</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{formatPrice(importPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Giá bán lẻ</span>
                  <span className="text-sm font-bold text-blue-600">{formatPrice(displayRetailPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Giá bán sỉ</span>
                  <span className="text-sm font-bold text-amber-600">{formatPrice(displayWholesalePrice)}</span>
                </div>
              </div>
            </div>
          )}
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
            onClick={handleSave}
            className="flex-1 rounded-xl bg-emerald-500 py-3 font-black text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25"
          >
            Lưu giá
          </button>
        </div>
      </div>
    </div>
  )
}
