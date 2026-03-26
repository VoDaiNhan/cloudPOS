import type { StockBatch } from '../types/inventory'
import { mockProducts } from './product'

export const mockStockBatches: StockBatch[] = mockProducts.map((product, index) => {
  const numberPart = String(index + 1).padStart(3, '0')

  return {
    id: `batch-${numberPart}`,
    productId: product.id,
    sku: product.code,
    productName: product.name,
    category: product.categoryName,
    unit: product.baseUnit ?? 'đơn vị',
    quantity: product.stock,
    costPrice: product.costPrice ?? Math.round(product.price * 0.6),
    receivedDate: '2026-01-01',
    batchNumber: `BATCH-${product.code}`,
    expiryDate: undefined,
    image: product.image,
  }
})
