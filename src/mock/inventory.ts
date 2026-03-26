import type { InventoryItem } from '../types/inventory'
import { posProducts } from './pos'

export const mockInventory: InventoryItem[] = posProducts.map((product, index) => {
  const stockLevel = product.stockInBaseUnit
  const costPrice = Math.round(product.price * 0.6)
  const status: InventoryItem['status'] =
    stockLevel <= 0 ? 'under_limit' : stockLevel < 10 ? 'low' : 'stable'

  return {
    id: String(index + 1),
    sku: `SP${String(index + 1).padStart(3, '0')}`,
    name: product.name,
    category: product.category,
    unit: product.baseUnit,
    stockLevel,
    stockValue: stockLevel * costPrice,
    status,
    issuePolicy: 'FIFO',
    trackedBatchCount: 1,
    expiringQuantity: 0,
    expiredQuantity: 0,
  }
})
