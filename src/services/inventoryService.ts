import api from './api'
import type { InventoryItem, InventoryStatus } from '../types/inventory'

interface BackendInventoryItem {
  productId: string
  productName: string
  code?: string
  imageUrl?: string
  categoryName?: string
  stockQuantity: number
  costPrice: number
  minStockLevel: number
}

function mapStatus(qty: number, min: number): InventoryStatus {
  if (qty <= 0) return 'low'
  if (qty <= min) return 'under_limit'
  if (qty <= min * 1.5) return 'low'
  return 'stable'
}

function mapInventory(data: BackendInventoryItem): InventoryItem {
  const status = mapStatus(data.stockQuantity, data.minStockLevel)
  return {
    id: data.productId,
    sku: data.code || '',
    name: data.productName,
    image: data.imageUrl,
    category: data.categoryName || 'Khác',
    unit: 'Cái',
    stockLevel: data.stockQuantity,
    stockValue: data.stockQuantity * data.costPrice,
    status,
    issuePolicy: 'FIFO',
    trackedBatchCount: 0,
    expiringQuantity: 0,
    expiredQuantity: 0,
  }
}

export const inventoryService = {
  getAll: async (): Promise<InventoryItem[]> => {
    const { data } = await api.get('/inventory')
    return (data as BackendInventoryItem[]).map(mapInventory)
  },

  getLowStock: async (): Promise<InventoryItem[]> => {
    const { data } = await api.get('/inventory/low-stock')
    return (data as BackendInventoryItem[]).map(mapInventory)
  },
}
