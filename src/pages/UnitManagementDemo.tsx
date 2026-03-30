import { useState } from 'react'
import { UnitConversionManager } from '../components/UnitConversionManager'
import { UnitSelector } from '../components/UnitSelector'
import type { UnitConversion } from '../types/unit'
import { unitConversions, units } from '../mock/units'
import { DashboardLayout } from '../layouts/DashboardLayout'

interface Product {
  id: string
  name: string
  baseUnitId: string
  conversions: UnitConversion[]
}

const UnitManagementDemo = () => {
  // Sample products
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod-coca',
      name: 'Coca Cola',
      baseUnitId: 'unit-4', // Lon
      conversions: unitConversions.filter((c) => c.productId === 'prod-coca'),
    },
    {
      id: 'prod-pepsi',
      name: 'Pepsi',
      baseUnitId: 'unit-5', // Chai
      conversions: unitConversions.filter((c) => c.productId === 'prod-pepsi'),
    },
    {
      id: 'prod-rice',
      name: 'Gạo ST25',
      baseUnitId: 'unit-9', // Kg
      conversions: unitConversions.filter((c) => c.productId === 'prod-rice'),
    },
  ])

  const [managingProduct, setManagingProduct] = useState<Product | null>(null)

  // Import order state
  const [importOrders, setImportOrders] = useState<
    Array<{
      productId: string
      quantity: number
      unitId: string
      baseQuantity: number
    }>
  >([
    { productId: 'prod-coca', quantity: 5, unitId: 'unit-6', baseQuantity: 120 }, // 5 thùng = 120 lon
    { productId: 'prod-pepsi', quantity: 10, unitId: 'unit-6', baseQuantity: 200 }, // 10 thùng = 200 chai
    { productId: 'prod-rice', quantity: 3, unitId: 'unit-15', baseQuantity: 150 }, // 3 bao = 150 kg
  ])

  const handleSaveConversions = (conversions: UnitConversion[]) => {
    if (!managingProduct) return

    setProducts(
      products.map((p) =>
        p.id === managingProduct.id ? { ...p, conversions } : p
      )
    )
    setManagingProduct(null)
  }

  const handleUnitChange = (
    index: number,
    unitId: string,
    baseQuantity: number
  ) => {
    const updated = [...importOrders]
    updated[index] = { ...updated[index], unitId, baseQuantity }
    setImportOrders(updated)
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const updated = [...importOrders]
    updated[index] = { ...updated[index], quantity }
    setImportOrders(updated)
  }

  const getProductById = (id: string) => products.find((p) => p.id === id)
  const getUnitName = (unitId: string) =>
    units.find((u) => u.id === unitId)?.name || unitId

  const totalBaseQuantity = (productId: string) => {
    return importOrders
      .filter((o) => o.productId === productId)
      .reduce((sum, o) => sum + o.baseQuantity, 0)
  }

  return (
    <DashboardLayout
      title="Đơn vị & Quy đổi"
      breadcrumb={[
        { label: 'Hàng hóa' },
        { label: 'Đơn vị & Quy đổi' },
      ]}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Quản lý Đơn vị tính & Quy đổi
          </h1>
          <p className="text-slate-500 font-medium">
            Cấu hình đơn vị tính và tự động quy đổi khi nhập/xuất hàng
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6">
            <div className="size-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-2xl">
                straighten
              </span>
            </div>
            <h3 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-2">
              Đa dạng đơn vị
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Hỗ trợ nhiều đơn vị: thùng, lốc, lon, chai, kg, gói, hộp, bao...
            </p>
          </div>

          <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-6">
            <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-2xl">
                swap_horiz
              </span>
            </div>
            <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-100 mb-2">
              Quy đổi tự động
            </h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Tự động tính toán số lượng khi chuyển đổi giữa các đơn vị
            </p>
          </div>

          <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-6">
            <div className="size-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-white text-2xl">
                save
              </span>
            </div>
            <h3 className="text-lg font-black text-amber-900 dark:text-amber-100 mb-2">
              Lưu cấu hình
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Cấu hình một lần, sử dụng mãi mãi. Không cần nhập lại
            </p>
          </div>
        </div>

        {/* Product Configuration */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-primary to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-2">
                  1. Cấu hình đơn vị cho sản phẩm
                </h2>
                <p className="text-sm opacity-90">
                  Thiết lập quy đổi đơn vị cho từng sản phẩm
                </p>
              </div>
              <button
                onClick={() => alert('Chức năng thêm sản phẩm mới - Sẽ mở form nhập thông tin')}
                className="px-4 py-2.5 rounded-xl bg-white text-primary font-bold text-sm hover:bg-white/90 transition-all shadow-lg flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Thêm sản phẩm
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-primary transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Đơn vị cơ bản: {getUnitName(product.baseUnitId)}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                      {product.conversions.length} quy đổi
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    {product.conversions.slice(0, 2).map((conv) => (
                      <div
                        key={conv.id}
                        className="text-xs bg-slate-50 dark:bg-slate-800 rounded-lg p-2"
                      >
                        <p className="font-bold text-slate-700 dark:text-slate-300">
                          1 {getUnitName(conv.fromUnitId)} ={' '}
                          {conv.conversionRate} {getUnitName(conv.toUnitId)}
                        </p>
                      </div>
                    ))}
                    {product.conversions.length > 2 && (
                      <p className="text-xs text-slate-400 text-center">
                        +{product.conversions.length - 2} quy đổi khác
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setManagingProduct(product)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary/10 text-primary py-2 font-bold text-sm hover:bg-primary/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">
                      settings
                    </span>
                    Cấu hình
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Import Order Demo */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-linear-to-r from-emerald-500 to-green-600 p-6 text-white">
            <h2 className="text-2xl font-black mb-2">
              2. Nhập hàng với quy đổi tự động
            </h2>
            <p className="text-sm opacity-90">
              Chọn đơn vị nhập hàng, hệ thống tự động quy đổi về đơn vị cơ bản
            </p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">
                      Sản phẩm
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">
                      Số lượng nhập
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">
                      Đơn vị nhập
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-500">
                      Quy đổi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {importOrders.map((order, index) => {
                    const product = getProductById(order.productId)
                    if (!product) return null

                    return (
                      <tr
                        key={index}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Đơn vị cơ bản: {getUnitName(product.baseUnitId)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            value={order.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                index,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            min="0"
                            step="0.01"
                            className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <UnitSelector
                            productId={product.id}
                            selectedUnitId={order.unitId}
                            quantity={order.quantity}
                            conversions={product.conversions}
                            baseUnitId={product.baseUnitId}
                            onChange={(unitId, baseQuantity) =>
                              handleUnitChange(index, unitId, baseQuantity)
                            }
                            className="w-64"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-500">
                              check_circle
                            </span>
                            <div>
                              <p className="text-sm font-black text-emerald-600">
                                {order.baseQuantity}{' '}
                                {getUnitName(product.baseUnitId)}
                              </p>
                              <p className="text-xs text-slate-500">
                                Tồn kho sẽ tăng
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6">
          <h3 className="text-lg font-black text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">inventory</span>
            Tổng kết tồn kho sau nhập
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {products.map((product) => {
              const total = totalBaseQuantity(product.id)
              return (
                <div
                  key={product.id}
                  className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-4"
                >
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
                    {product.name}
                  </p>
                  <p className="text-2xl font-black text-purple-600">
                    {total} {getUnitName(product.baseUnitId)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">star</span>
            Lợi ích chính
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="space-y-2">
              <p className="font-bold">✅ Tính toán chính xác:</p>
              <ul className="space-y-1 ml-4">
                <li>• Tự động quy đổi về đơn vị cơ bản</li>
                <li>• Tồn kho luôn chính xác</li>
                <li>• Tránh sai sót khi tính toán thủ công</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold">✅ Tiết kiệm thời gian:</p>
              <ul className="space-y-1 ml-4">
                <li>• Cấu hình một lần, dùng mãi mãi</li>
                <li>• Không cần nhập lại quy đổi</li>
                <li>• Nhập hàng nhanh chóng, linh hoạt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Conversion Manager Modal */}
      {managingProduct && (
        <UnitConversionManager
          productId={managingProduct.id}
          productName={managingProduct.name}
          existingConversions={managingProduct.conversions}
          onSave={handleSaveConversions}
          onCancel={() => setManagingProduct(null)}
        />
      )}
    </DashboardLayout>
  )
}

export default UnitManagementDemo
