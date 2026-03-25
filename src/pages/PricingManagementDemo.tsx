import { useState } from 'react'
import { PriceManager } from '../components/PriceManager'
import { inventoryValues, getInventorySummary } from '../mock/pricing'
import { formatPrice, calculateInventoryValue } from '../utils/priceCalculator'
import type { InventoryValue } from '../types/pricing'

const PricingManagementDemo = () => {
  const [inventory, setInventory] = useState<InventoryValue[]>(inventoryValues)
  const [managingProduct, setManagingProduct] = useState<InventoryValue | null>(null)
  const summary = getInventorySummary()

  const handleSavePrices = (prices: { importPrice: number; retailPrice: number; wholesalePrice: number }) => {
    if (!managingProduct) return

    const calculated = calculateInventoryValue(
      managingProduct.stockQuantity,
      prices.importPrice,
      prices.retailPrice,
      prices.wholesalePrice
    )

    const updated: InventoryValue = {
      ...managingProduct,
      importPrice: prices.importPrice,
      retailPrice: prices.retailPrice,
      wholesalePrice: prices.wholesalePrice,
      ...calculated,
    }

    setInventory(inventory.map((inv) => (inv.productId === managingProduct.productId ? updated : inv)))
    setManagingProduct(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Quản lý Giá cả & Giá trị Tồn kho
          </h1>
          <p className="text-slate-500 font-medium">
            Quản lý giá nhập, giá bán lẻ, giá bán sỉ và tính toán giá trị tồn kho tự động
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6">
            <div className="size-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-2xl">payments</span>
            </div>
            <h3 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-2">
              3 loại giá
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Giá nhập, giá bán lẻ, giá bán sỉ được quản lý riêng biệt
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-6">
            <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-2xl">calculate</span>
            </div>
            <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100 mb-2">
              Tính toán tự động
            </h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Tự động tính giá trị tồn kho = Số lượng × Đơn giá
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6">
            <div className="size-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-2xl">trending_up</span>
            </div>
            <h3 className="text-lg font-black text-amber-900 dark:text-amber-100 mb-2">
              Lợi nhuận rõ ràng
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Hiển thị % lợi nhuận cho từng loại giá bán
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-slate-400">inventory_2</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tổng sản phẩm</p>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{summary.totalProducts}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-blue-500">shopping_bag</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giá trị nhập</p>
            </div>
            <p className="text-2xl font-black text-blue-600">{formatPrice(summary.totalImportValue)}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-emerald-500">sell</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giá trị bán lẻ</p>
            </div>
            <p className="text-2xl font-black text-emerald-600">{formatPrice(summary.totalRetailValue)}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-amber-500">local_shipping</span>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Giá trị bán sỉ</p>
            </div>
            <p className="text-2xl font-black text-amber-600">{formatPrice(summary.totalWholesaleValue)}</p>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
            <h2 className="text-2xl font-black mb-2">Danh sách hàng tồn kho</h2>
            <p className="text-sm opacity-90">Quản lý giá và xem giá trị tồn kho theo từng loại giá</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">
                    Tồn kho
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">
                    Giá nhập
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">
                    Giá bán lẻ
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">
                    Giá bán sỉ
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-500">
                    Giá trị tồn
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-slate-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {inventory.map((inv) => (
                  <tr key={inv.productId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{inv.productName}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {inv.stockQuantity} {inv.unitName}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        {formatPrice(inv.importPrice)}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        = {formatPrice(inv.totalImportValue)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-bold text-blue-600">{formatPrice(inv.retailPrice)}</p>
                      <p className="text-xs text-emerald-600 mt-1">
                        +{inv.retailMarginPercent}%
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-bold text-amber-600">{formatPrice(inv.wholesalePrice)}</p>
                      <p className="text-xs text-emerald-600 mt-1">
                        +{inv.wholesaleMarginPercent}%
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">
                          Lẻ: <span className="font-bold text-blue-600">{formatPrice(inv.totalRetailValue)}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Sỉ: <span className="font-bold text-amber-600">{formatPrice(inv.totalWholesaleValue)}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setManagingProduct(inv)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-bold"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                        Sửa giá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profit Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-6">
            <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">trending_up</span>
              Lợi nhuận tiềm năng (Bán lẻ)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-700 dark:text-emerald-300">Tổng giá trị bán lẻ</span>
                <span className="text-lg font-black text-emerald-600">
                  {formatPrice(summary.totalRetailValue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-700 dark:text-emerald-300">Tổng giá trị nhập</span>
                <span className="text-lg font-black text-slate-600">
                  -{formatPrice(summary.totalImportValue)}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <span className="text-base font-bold text-emerald-900 dark:text-emerald-100">
                  Lợi nhuận nếu bán hết
                </span>
                <span className="text-2xl font-black text-emerald-600">
                  {formatPrice(summary.totalPotentialRetailProfit)}
                </span>
              </div>
              <p className="text-xs text-emerald-600 text-center">
                Lợi nhuận trung bình: {summary.averageRetailMarginPercent}%
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6">
            <h3 className="text-lg font-black text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">local_shipping</span>
              Lợi nhuận tiềm năng (Bán sỉ)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700 dark:text-amber-300">Tổng giá trị bán sỉ</span>
                <span className="text-lg font-black text-amber-600">
                  {formatPrice(summary.totalWholesaleValue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700 dark:text-amber-300">Tổng giá trị nhập</span>
                <span className="text-lg font-black text-slate-600">
                  -{formatPrice(summary.totalImportValue)}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-amber-200 dark:border-amber-800 flex items-center justify-between">
                <span className="text-base font-bold text-amber-900 dark:text-amber-100">
                  Lợi nhuận nếu bán hết
                </span>
                <span className="text-2xl font-black text-amber-600">
                  {formatPrice(summary.totalPotentialWholesaleProfit)}
                </span>
              </div>
              <p className="text-xs text-amber-600 text-center">
                Lợi nhuận trung bình: {summary.averageWholesaleMarginPercent}%
              </p>
            </div>
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">lightbulb</span>
            Điểm quan trọng
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="space-y-2">
              <p className="font-bold">✅ Thống nhất đơn giá:</p>
              <ul className="space-y-1 ml-4">
                <li>• Giá nhập = Giá tồn kho</li>
                <li>• Giá trị tồn = Số lượng × Giá nhập</li>
                <li>• Tính toán tự động, chính xác</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold">✅ Phân loại giá rõ ràng:</p>
              <ul className="space-y-1 ml-4">
                <li>• Giá bán lẻ: Lợi nhuận cao hơn</li>
                <li>• Giá bán sỉ: Giảm 8-20% so với lẻ</li>
                <li>• Linh hoạt theo chiến lược kinh doanh</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Price Manager Modal */}
      {managingProduct && (
        <PriceManager
          productName={managingProduct.productName}
          initialImportPrice={managingProduct.importPrice}
          initialRetailPrice={managingProduct.retailPrice}
          initialWholesalePrice={managingProduct.wholesalePrice}
          onSave={handleSavePrices}
          onCancel={() => setManagingProduct(null)}
        />
      )}
    </div>
  )
}

export default PricingManagementDemo
