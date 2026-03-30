import { useState } from 'react'
import { BatchScanner } from '../components/BatchScanner'
import { BatchSelector } from '../components/BatchSelector'
import { ReturnOrderManager } from '../components/ReturnOrderManager'
import type { BatchScanResult, Batch, BatchAllocation, ReturnOrder } from '../types/batch'
import {
  batches as mockBatches,
  warehouseLocations,
  pickingStrategies,
  returnOrders as mockReturnOrders,
} from '../mock/batches'
import {
  calculateDaysUntilExpiry,
  getNearExpiryBatches,
  getExpiredBatches,
  getTotalAvailableQuantity,
} from '../utils/batchAllocator'

import { DashboardLayout } from '../layouts/DashboardLayout'

export const BatchManagementDemo = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'allocate' | 'return' | 'warehouse'>('scan')
  const [batches] = useState<Batch[]>(mockBatches)
  const [returnOrders, setReturnOrders] = useState<ReturnOrder[]>(mockReturnOrders)
  const [scanResult, setScanResult] = useState<BatchScanResult | null>(null)
  const [showBatchSelector, setShowBatchSelector] = useState(false)
  const [showReturnManager, setShowReturnManager] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string
    name: string
    batches: Batch[]
  } | null>(null)

  const handleScanSuccess = (result: BatchScanResult) => {
    setScanResult(result)
    console.log('Scan result:', result)
  }

  const handleScanError = (error: string) => {
    alert(error)
  }

  const handleOpenBatchSelector = (productId: string, productName: string) => {
    const productBatches = batches.filter((b) => b.productId === productId)
    setSelectedProduct({ id: productId, name: productName, batches: productBatches })
    setShowBatchSelector(true)
  }

  const handleBatchSelect = (allocations: BatchAllocation[]) => {
    console.log('Selected batches:', allocations)
    alert(
      `Đã chọn ${allocations.length} lô hàng, tổng số lượng: ${allocations.reduce(
        (sum, a) => sum + a.quantity,
        0
      )}`
    )
    setShowBatchSelector(false)
  }

  const handleReturnSubmit = (returnOrder: Partial<ReturnOrder>) => {
    const newReturn: ReturnOrder = {
      ...returnOrder,
      id: `return-${Date.now()}`,
      returnNumber: `RET-2024-${String(returnOrders.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdBy: 'demo-user',
      createdAt: new Date().toISOString(),
    } as ReturnOrder

    setReturnOrders([...returnOrders, newReturn])
    setShowReturnManager(false)
    alert('Đã tạo phiếu trả hàng thành công!')
  }

  const nearExpiryBatches = getNearExpiryBatches(batches)
  const expiredBatches = getExpiredBatches(batches)
  const activeBatches = batches.filter((b) => b.status === 'active' && !b.isBlocked)

  // Group batches by product
  const productGroups = batches.reduce((acc, batch) => {
    if (!acc[batch.productId]) {
      acc[batch.productId] = {
        productId: batch.productId,
        productName: batch.productName,
        batches: [],
        totalQuantity: 0,
      }
    }
    acc[batch.productId].batches.push(batch)
    acc[batch.productId].totalQuantity += batch.availableQuantity
    return acc
  }, {} as Record<string, { productId: string; productName: string; batches: Batch[]; totalQuantity: number }>)

  const tabs = [
    { id: 'scan', label: 'Quét mã vạch', icon: 'qr_code_scanner' },
    { id: 'allocate', label: 'Phân bổ lô hàng', icon: 'inventory_2' },
    { id: 'return', label: 'Trả hàng / Hủy hàng', icon: 'assignment_return' },
    { id: 'warehouse', label: 'Kho phân loại', icon: 'warehouse' },
  ]

  return (
    <>
      <DashboardLayout
        title="Quản lý lô hàng"
        breadcrumb={[
          { label: 'Hàng hóa' },
          { label: 'Quản lý lô hàng' },
        ]}
      >
      <div className="max-w-full">
        {/* Description */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Hệ thống quản lý theo lô, FEFO/FIFO, xử lý trả hàng và phân kho
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-emerald-600 text-3xl">
                check_circle
              </span>
              <span className="text-3xl font-black text-emerald-900 dark:text-emerald-100">
                {activeBatches.length}
              </span>
            </div>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              Lô hàng hoạt động
            </p>
          </div>

          <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-amber-600 text-3xl">warning</span>
              <span className="text-3xl font-black text-amber-900 dark:text-amber-100">
                {nearExpiryBatches.length}
              </span>
            </div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
              Sắp hết hạn (≤30 ngày)
            </p>
          </div>

          <div className="rounded-2xl border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-rose-600 text-3xl">
                event_busy
              </span>
              <span className="text-3xl font-black text-rose-900 dark:text-rose-100">
                {expiredBatches.length}
              </span>
            </div>
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Đã hết hạn</p>
          </div>

          <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-blue-600 text-3xl">
                assignment_return
              </span>
              <span className="text-3xl font-black text-blue-900 dark:text-blue-100">
                {returnOrders.length}
              </span>
            </div>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Phiếu trả hàng</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 max-h-[calc(100vh-400px)] overflow-y-auto">
          {/* Scan Tab */}
          {activeTab === 'scan' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
                  Quét mã vạch GS1-128
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Quét mã vạch GS1 để tự động nhận diện sản phẩm, số lô và hạn sử dụng
                </p>

                <BatchScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
              </div>

              {scanResult && (
                <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-emerald-600 text-3xl">
                      check_circle
                    </span>
                    <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-100">
                      Quét thành công!
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scanResult.parsedData?.gtin && (
                      <div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                          GTIN (Mã sản phẩm)
                        </p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                          {scanResult.parsedData.gtin}
                        </p>
                      </div>
                    )}

                    {scanResult.parsedData?.batchNumber && (
                      <div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Số lô
                        </p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                          {scanResult.parsedData.batchNumber}
                        </p>
                      </div>
                    )}

                    {scanResult.parsedData?.expiryDate && (
                      <div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Hạn sử dụng
                        </p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                          {new Date(scanResult.parsedData.expiryDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    )}

                    {scanResult.parsedData?.serialNumber && (
                      <div>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Serial Number
                        </p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                          {scanResult.parsedData.serialNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Example Barcodes */}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                  Mã vạch mẫu để thử
                </h3>
                <div className="space-y-2">
                  {batches.slice(0, 3).map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {batch.productName}
                        </p>
                        <p className="text-xs text-slate-500">Lô: {batch.batchNumber}</p>
                      </div>
                      <code className="text-xs font-mono bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-200 dark:border-slate-700">
                        {batch.gs1Barcode}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Allocate Tab */}
          {activeTab === 'allocate' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    Phân bổ lô hàng (FEFO/FIFO)
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Khi bán hàng, hệ thống tự động chọn lô theo chiến lược FEFO (ưu tiên hết hạn sớm
                    nhất)
                  </p>
                </div>
                <button
                  onClick={() => alert('Chức năng thêm lô mới - Sẽ mở form nhập thông tin lô')}
                  className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Thêm lô mới
                </button>
              </div>

              {/* Strategies */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {pickingStrategies.map((strategy) => (
                  <div
                    key={strategy.type}
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-black">
                        {strategy.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {strategy.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Product List */}
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                  Danh sách sản phẩm
                </h3>
                <div className="space-y-3">
                  {Object.values(productGroups).map((group) => (
                    <div
                      key={group.productId}
                      className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-lg font-black text-slate-900 dark:text-white mb-1">
                            {group.productName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <span>Số lô: {group.batches.length}</span>
                            <span>•</span>
                            <span>Tồn kho: {group.totalQuantity}</span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleOpenBatchSelector(group.productId, group.productName)
                          }
                          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-black hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm">
                            inventory_2
                          </span>
                          Chọn lô
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Return Tab */}
          {activeTab === 'return' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    Quản lý trả hàng / Hủy hàng
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Xử lý hàng trả lại, hàng hỏng, hàng hết hạn - không sửa dữ liệu gốc
                  </p>
                </div>
                <button
                  onClick={() => setShowReturnManager(true)}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Tạo phiếu trả hàng
                </button>
              </div>

              {/* Return Orders List */}
              <div className="space-y-3">
                {returnOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-lg font-black text-slate-900 dark:text-white">
                            {order.returnNumber}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              order.status === 'completed'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                : order.status === 'approved'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : order.status === 'rejected'
                                ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {order.type === 'customer_return'
                            ? 'Khách hàng trả lại'
                            : order.type === 'supplier_return'
                            ? 'Trả nhà cung cấp'
                            : order.type === 'damage'
                            ? 'Hàng hỏng'
                            : 'Hết hạn'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-900 dark:text-white">
                          {order.totalAmount.toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.returnDate).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {item.productName}
                            </p>
                            <p className="text-xs text-slate-500">
                              Lô: {item.batchNumber} • SL: {item.quantity}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-black ${
                              item.condition === 'good'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700'
                                : item.condition === 'damaged'
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700'
                                : item.condition === 'expired'
                                ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700'
                            }`}
                          >
                            {item.condition}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-bold">Lý do:</span> {order.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warehouse Tab */}
          {activeTab === 'warehouse' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  Kho phân loại
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Hệ thống phân kho riêng biệt cho từng loại hàng hóa
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warehouseLocations.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className={`rounded-xl border-2 p-6 ${
                      warehouse.type === 'main'
                        ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
                        : warehouse.type === 'damaged'
                        ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                        : warehouse.type === 'expired'
                        ? 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20'
                        : warehouse.type === 'quarantine'
                        ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`material-symbols-outlined text-3xl ${
                          warehouse.type === 'main'
                            ? 'text-emerald-600'
                            : warehouse.type === 'damaged'
                            ? 'text-orange-600'
                            : warehouse.type === 'expired'
                            ? 'text-rose-600'
                            : warehouse.type === 'quarantine'
                            ? 'text-amber-600'
                            : 'text-blue-600'
                        }`}
                      >
                        warehouse
                      </span>
                      <div>
                        <h3
                          className={`text-lg font-black ${
                            warehouse.type === 'main'
                              ? 'text-emerald-900 dark:text-emerald-100'
                              : warehouse.type === 'damaged'
                              ? 'text-orange-900 dark:text-orange-100'
                              : warehouse.type === 'expired'
                              ? 'text-rose-900 dark:text-rose-100'
                              : warehouse.type === 'quarantine'
                              ? 'text-amber-900 dark:text-amber-100'
                              : 'text-blue-900 dark:text-blue-100'
                          }`}
                        >
                          {warehouse.name}
                        </h3>
                        <p
                          className={`text-xs ${
                            warehouse.type === 'main'
                              ? 'text-emerald-600'
                              : warehouse.type === 'damaged'
                              ? 'text-orange-600'
                              : warehouse.type === 'expired'
                              ? 'text-rose-600'
                              : warehouse.type === 'quarantine'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {warehouse.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {warehouse.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Key Principles */}
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
                <h3 className="text-lg font-black text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">lightbulb</span>
                  Nguyên tắc quan trọng
                </h3>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm mt-0.5">check</span>
                    <span>
                      <strong>Không sửa dữ liệu gốc:</strong> Khi hàng bị trả/hủy, tạo giao dịch
                      ngược lại thay vì sửa trực tiếp
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm mt-0.5">check</span>
                    <span>
                      <strong>Phân kho riêng biệt:</strong> Hàng hỏng/hết hạn không được nhập lại
                      kho chính
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm mt-0.5">check</span>
                    <span>
                      <strong>Truy xuất nguồn gốc:</strong> Mỗi sản phẩm bán ra phải biết thuộc lô
                      nào
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm mt-0.5">check</span>
                    <span>
                      <strong>FEFO ưu tiên:</strong> Luôn bán hàng hết hạn sớm nhất trước
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      </DashboardLayout>

      {/* Modals */}
      {showBatchSelector && selectedProduct && (
        <BatchSelector
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          batches={selectedProduct.batches}
          requestedQuantity={10}
          onSelect={handleBatchSelect}
          onCancel={() => setShowBatchSelector(false)}
          strategy="FEFO"
        />
      )}

      {showReturnManager && (
        <ReturnOrderManager
          onSubmit={handleReturnSubmit}
          onCancel={() => setShowReturnManager(false)}
        />
      )}
    </>
  )
}
