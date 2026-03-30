import type { Batch, BatchAllocation, BatchPickingStrategy } from '../types/batch'

/**
 * Calculate days until expiry
 */
export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expiry.setHours(0, 0, 0, 0)
  
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Check if batch is expired
 */
export const isBatchExpired = (expiryDate: string): boolean => {
  return calculateDaysUntilExpiry(expiryDate) < 0
}

/**
 * Check if batch is near expiry (within warning threshold)
 */
export const isBatchNearExpiry = (expiryDate: string, warningDays: number = 30): boolean => {
  const days = calculateDaysUntilExpiry(expiryDate)
  return days >= 0 && days <= warningDays
}

/**
 * Get batch status based on expiry date
 */
export const getBatchStatus = (expiryDate: string, warningDays: number = 30): 'active' | 'near_expiry' | 'expired' => {
  if (isBatchExpired(expiryDate)) return 'expired'
  if (isBatchNearExpiry(expiryDate, warningDays)) return 'near_expiry'
  return 'active'
}

/**
 * Allocate batches using FEFO (First-Expired-First-Out)
 * Returns list of batches to pick from, ordered by expiry date
 */
export const allocateBatchesFEFO = (
  batches: Batch[],
  requestedQuantity: number
): BatchAllocation[] => {
  // Filter available batches (not blocked, not expired, has available quantity)
  const availableBatches = batches.filter(
    (batch) =>
      !batch.isBlocked &&
      batch.availableQuantity > 0 &&
      !isBatchExpired(batch.expiryDate)
  )

  // Sort by expiry date (earliest first)
  const sortedBatches = availableBatches.sort((a, b) => {
    const dateA = new Date(a.expiryDate).getTime()
    const dateB = new Date(b.expiryDate).getTime()
    return dateA - dateB
  })

  // Allocate quantity from batches
  const allocations: BatchAllocation[] = []
  let remainingQuantity = requestedQuantity

  for (let i = 0; i < sortedBatches.length && remainingQuantity > 0; i++) {
    const batch = sortedBatches[i]
    const quantityToAllocate = Math.min(batch.availableQuantity, remainingQuantity)

    allocations.push({
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate,
      quantity: quantityToAllocate,
      availableQuantity: batch.availableQuantity,
      daysUntilExpiry: calculateDaysUntilExpiry(batch.expiryDate),
      priority: i + 1,
    })

    remainingQuantity -= quantityToAllocate
  }

  return allocations
}

/**
 * Allocate batches using FIFO (First-In-First-Out)
 * Returns list of batches to pick from, ordered by import date
 */
export const allocateBatchesFIFO = (
  batches: Batch[],
  requestedQuantity: number
): BatchAllocation[] => {
  // Filter available batches
  const availableBatches = batches.filter(
    (batch) =>
      !batch.isBlocked &&
      batch.availableQuantity > 0 &&
      !isBatchExpired(batch.expiryDate)
  )

  // Sort by import date (earliest first)
  const sortedBatches = availableBatches.sort((a, b) => {
    const dateA = new Date(a.importDate).getTime()
    const dateB = new Date(b.importDate).getTime()
    return dateA - dateB
  })

  // Allocate quantity from batches
  const allocations: BatchAllocation[] = []
  let remainingQuantity = requestedQuantity

  for (let i = 0; i < sortedBatches.length && remainingQuantity > 0; i++) {
    const batch = sortedBatches[i]
    const quantityToAllocate = Math.min(batch.availableQuantity, remainingQuantity)

    allocations.push({
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      expiryDate: batch.expiryDate,
      quantity: quantityToAllocate,
      availableQuantity: batch.availableQuantity,
      daysUntilExpiry: calculateDaysUntilExpiry(batch.expiryDate),
      priority: i + 1,
    })

    remainingQuantity -= quantityToAllocate
  }

  return allocations
}

/**
 * Allocate batches based on strategy
 */
export const allocateBatches = (
  batches: Batch[],
  requestedQuantity: number,
  strategy: BatchPickingStrategy['type'] = 'FEFO'
): BatchAllocation[] => {
  switch (strategy) {
    case 'FEFO':
      return allocateBatchesFEFO(batches, requestedQuantity)
    case 'FIFO':
      return allocateBatchesFIFO(batches, requestedQuantity)
    case 'MANUAL':
      // For manual, just return available batches sorted by expiry
      return allocateBatchesFEFO(batches, requestedQuantity)
    default:
      return allocateBatchesFEFO(batches, requestedQuantity)
  }
}

/**
 * Check if requested quantity can be fulfilled
 */
export const canFulfillQuantity = (batches: Batch[], requestedQuantity: number): boolean => {
  const totalAvailable = batches
    .filter((batch) => !batch.isBlocked && !isBatchExpired(batch.expiryDate))
    .reduce((sum, batch) => sum + batch.availableQuantity, 0)

  return totalAvailable >= requestedQuantity
}

/**
 * Get total available quantity for a product
 */
export const getTotalAvailableQuantity = (batches: Batch[]): number => {
  return batches
    .filter((batch) => !batch.isBlocked && !isBatchExpired(batch.expiryDate))
    .reduce((sum, batch) => sum + batch.availableQuantity, 0)
}

/**
 * Get batches that are near expiry
 */
export const getNearExpiryBatches = (batches: Batch[], warningDays: number = 30): Batch[] => {
  return batches.filter(
    (batch) =>
      !batch.isBlocked &&
      batch.availableQuantity > 0 &&
      isBatchNearExpiry(batch.expiryDate, warningDays)
  )
}

/**
 * Get expired batches
 */
export const getExpiredBatches = (batches: Batch[]): Batch[] => {
  return batches.filter(
    (batch) => batch.availableQuantity > 0 && isBatchExpired(batch.expiryDate)
  )
}

/**
 * Calculate total value of batches
 */
export const calculateBatchesValue = (batches: Batch[]): number => {
  return batches.reduce((sum, batch) => {
    return sum + batch.currentQuantity * batch.importPrice
  }, 0)
}

/**
 * Calculate potential loss from expired batches
 */
export const calculateExpiryLoss = (batches: Batch[]): number => {
  const expiredBatches = getExpiredBatches(batches)
  return calculateBatchesValue(expiredBatches)
}

/**
 * Get batch allocation summary
 */
export const getBatchAllocationSummary = (allocations: BatchAllocation[]) => {
  const totalQuantity = allocations.reduce((sum, alloc) => sum + alloc.quantity, 0)
  const batchCount = allocations.length
  const earliestExpiry = allocations.length > 0 ? allocations[0].expiryDate : null
  const latestExpiry = allocations.length > 0 ? allocations[allocations.length - 1].expiryDate : null

  return {
    totalQuantity,
    batchCount,
    earliestExpiry,
    latestExpiry,
    allocations,
  }
}
