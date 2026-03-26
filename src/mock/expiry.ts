import type { ExpiryBatch, ExpirySummary } from '../types/expiry'
import { posProducts } from './pos'

const toSku = (index: number) => `SP${String(index + 1).padStart(3, '0')}`

const baseBatches: ExpiryBatch[] = posProducts.slice(0, 4).map((product, index) => {
  const statuses: Array<ExpiryBatch['status']> = ['EXPIRED', 'NEAR_EXPIRY', 'SAFE', 'NO_EXPIRY']
  const status = statuses[index] ?? 'SAFE'

  const daysDifference =
    status === 'EXPIRED' ? -5 : status === 'NEAR_EXPIRY' ? 18 : status === 'SAFE' ? 60 : null

  const expiryDate =
    status === 'NO_EXPIRY'
      ? undefined
      : status === 'EXPIRED'
        ? '2026-03-10'
        : status === 'NEAR_EXPIRY'
          ? '2026-04-05'
          : '2026-06-20'

  const issuePolicy = expiryDate ? 'FEFO' : 'FIFO'

  return {
    id: `b${index + 1}`,
    productId: product.id,
    productName: product.name,
    sku: toSku(index),
    category: product.category,
    image: product.image,
    batchNumber: `LOT-2026-${String(index + 1).padStart(4, '0')}`,
    receivedDate: '2026-01-15',
    expiryDate,
    quantity: Math.max(5, product.stockInBaseUnit),
    unit: product.baseUnit,
    status,
    issuePolicy,
    priorityRank: status === 'EXPIRED' ? null : index + 1,
    isSellable: status !== 'EXPIRED',
    daysDifference,
  }
})

export const mockExpiryBatches: ExpiryBatch[] = baseBatches

export const mockExpirySummary: ExpirySummary = {
  expiredCount: mockExpiryBatches.filter((batch) => batch.status === 'EXPIRED').length,
  nearExpiryCount: mockExpiryBatches.filter((batch) => batch.status === 'NEAR_EXPIRY').length,
  safeCount: mockExpiryBatches.filter((batch) => batch.status === 'SAFE').length,
  noExpiryCount: mockExpiryBatches.filter((batch) => batch.status === 'NO_EXPIRY').length,
  trackedProductCount: new Set(
    mockExpiryBatches.filter((batch) => batch.expiryDate).map((batch) => batch.productId)
  ).size,
  priorityCount: mockExpiryBatches.filter((batch) => batch.priorityRank === 1 && batch.isSellable)
    .length,
}
