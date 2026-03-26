import type { ExpiryBatch, ExpirySummary } from '../types/expiry'
import type { BatchStatus, IssuePolicy, StockBatch } from '../types/inventory'

const DAY_IN_MS = 24 * 60 * 60 * 1000

const normalizeToStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const parseDateValue = (value?: string | null) => {
  if (!value) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const formatDisplayDate = (value?: string | null) => {
  const parsed = parseDateValue(value)
  if (!parsed) return 'Không giới hạn'
  return new Intl.DateTimeFormat('vi-VN').format(parsed)
}

export const getDaysDifference = (expiryDate?: string | null, today = new Date()) => {
  const parsed = parseDateValue(expiryDate)
  if (!parsed) return null

  const diff =
    normalizeToStartOfDay(parsed).getTime() - normalizeToStartOfDay(today).getTime()

  return Math.round(diff / DAY_IN_MS)
}

export const getBatchStatus = (expiryDate?: string | null, today = new Date()): BatchStatus => {
  const daysDifference = getDaysDifference(expiryDate, today)

  if (daysDifference === null) return 'NO_EXPIRY'
  if (daysDifference < 0) return 'EXPIRED'
  if (daysDifference <= 30) return 'NEAR_EXPIRY'
  return 'SAFE'
}

export const getIssuePolicy = (batch: Pick<StockBatch, 'expiryDate'>): IssuePolicy =>
  batch.expiryDate ? 'FEFO' : 'FIFO'

const getIssueSortValue = (batch: StockBatch, today: Date) => {
  const policy = getIssuePolicy(batch)
  const primaryDate =
    policy === 'FEFO'
      ? parseDateValue(batch.expiryDate)
      : parseDateValue(batch.receivedDate)

  const secondaryDate =
    policy === 'FEFO'
      ? parseDateValue(batch.receivedDate)
      : parseDateValue(batch.expiryDate)

  const status = getBatchStatus(batch.expiryDate, today)
  const expiredPenalty = status === 'EXPIRED' ? 1 : 0

  return {
    policy,
    expiredPenalty,
    primaryTime: primaryDate?.getTime() ?? Number.POSITIVE_INFINITY,
    secondaryTime: secondaryDate?.getTime() ?? Number.POSITIVE_INFINITY,
  }
}

export const sortBatchesForIssue = (batches: StockBatch[], today = new Date()) =>
  [...batches].sort((left, right) => {
    const leftValue = getIssueSortValue(left, today)
    const rightValue = getIssueSortValue(right, today)

    if (leftValue.expiredPenalty !== rightValue.expiredPenalty) {
      return leftValue.expiredPenalty - rightValue.expiredPenalty
    }

    if (leftValue.policy !== rightValue.policy) {
      return leftValue.policy === 'FEFO' ? -1 : 1
    }

    if (leftValue.primaryTime !== rightValue.primaryTime) {
      return leftValue.primaryTime - rightValue.primaryTime
    }

    if (leftValue.secondaryTime !== rightValue.secondaryTime) {
      return leftValue.secondaryTime - rightValue.secondaryTime
    }

    return left.batchNumber.localeCompare(right.batchNumber)
  })

export const buildExpiryBatches = (batches: StockBatch[], today = new Date()): ExpiryBatch[] => {
  const priorityLookup = new Map<string, number>()

  const groupedBySku = batches.reduce<Map<string, StockBatch[]>>((accumulator, batch) => {
    const existing = accumulator.get(batch.sku) ?? []
    existing.push(batch)
    accumulator.set(batch.sku, existing)
    return accumulator
  }, new Map())

  groupedBySku.forEach((group) => {
    const prioritized = sortBatchesForIssue(
      group.filter((batch) => batch.quantity > 0 && getBatchStatus(batch.expiryDate, today) !== 'EXPIRED'),
      today
    )

    prioritized.forEach((batch, index) => {
      priorityLookup.set(batch.id, index + 1)
    })
  })

  const statusWeight: Record<BatchStatus, number> = {
    EXPIRED: 0,
    NEAR_EXPIRY: 1,
    SAFE: 2,
    NO_EXPIRY: 3,
  }

  return batches
    .filter((batch) => batch.quantity > 0)
    .map((batch) => {
      const status = getBatchStatus(batch.expiryDate, today)
      const daysDifference = getDaysDifference(batch.expiryDate, today)

      return {
        ...batch,
        image: batch.image || '',
        status,
        issuePolicy: getIssuePolicy(batch),
        priorityRank: priorityLookup.get(batch.id) ?? null,
        isSellable: status !== 'EXPIRED',
        daysDifference,
      }
    })
    .sort((left, right) => {
      if (statusWeight[left.status] !== statusWeight[right.status]) {
        return statusWeight[left.status] - statusWeight[right.status]
      }

      if ((left.priorityRank ?? 99) !== (right.priorityRank ?? 99)) {
        return (left.priorityRank ?? 99) - (right.priorityRank ?? 99)
      }

      return sortBatchesForIssue([left, right], today)[0].id === left.id ? -1 : 1
    })
}

export const buildExpirySummary = (batches: ExpiryBatch[]): ExpirySummary => ({
  expiredCount: batches.filter((batch) => batch.status === 'EXPIRED').length,
  nearExpiryCount: batches.filter((batch) => batch.status === 'NEAR_EXPIRY').length,
  safeCount: batches.filter((batch) => batch.status === 'SAFE').length,
  noExpiryCount: batches.filter((batch) => batch.status === 'NO_EXPIRY').length,
  trackedProductCount: new Set(
    batches.filter((batch) => batch.expiryDate).map((batch) => batch.productId)
  ).size,
  priorityCount: batches.filter((batch) => batch.priorityRank === 1 && batch.isSellable).length,
})
