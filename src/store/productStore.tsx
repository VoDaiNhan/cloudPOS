/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { productService } from '../services/productService'
import { batchService, type BatchItem } from '../services/batchService'
import { authService } from '../services/authService'
import type { ExpiryBatch, ExpirySummary } from '../types/expiry'
import type { InventoryItem, InventoryStatus, StockBatch } from '../types/inventory'
import type { Product } from '../types/product'
import { buildExpiryBatches, buildExpirySummary, getBatchStatus, sortBatchesForIssue } from '../utils/stockBatchUtils'

export interface ImportStockLine {
  sku: string
  name: string
  quantityInBaseUnit: number
  baseUnit: string
  costPrice: number
  categoryName?: string
  batchNumber?: string
  expiryDate?: string
  receivedDate?: string
  image?: string
}

interface ProductStoreContextValue {
  products: Product[]
  stockBatches: StockBatch[]
  expiryBatches: ExpiryBatch[]
  expirySummary: ExpirySummary
  isLoading: boolean
  error: string
  refresh: () => Promise<void>
  saveProduct: (payload: Partial<Product>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  importStocks: (lines: ImportStockLine[]) => Promise<{ updated: number; created: number }>
  inventoryItems: InventoryItem[]
}

const ProductStoreContext = createContext<ProductStoreContextValue | null>(null)

const toPositiveNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

const nextProductCode = (products: Product[]) => {
  const maxCode = products.reduce((max, product) => {
    const codeNumber = Number(product.code.replace(/\D/g, ''))
    return Number.isFinite(codeNumber) ? Math.max(max, codeNumber) : max
  }, 0)
  return `SP${String(maxCode + 1).padStart(3, '0')}`
}

const mapStockStatusWithExpiry = (
  stockLevel: number,
  expiringQuantity: number
): InventoryStatus => {
  if (stockLevel <= 5) return 'low'
  if (stockLevel <= 10) return 'under_limit'
  if (expiringQuantity > 0) return 'expiring'
  return 'stable'
}

const mapProductsToInventoryWithBatches = (
  products: Product[],
  batches: StockBatch[]
): InventoryItem[] =>
  products.map((product) => {
    const productBatches = batches.filter(
      (batch) => batch.sku.toUpperCase() === product.code.toUpperCase()
    )

    if (productBatches.length === 0) {
      return {
        id: product.id,
        sku: product.code,
        name: product.name,
        image: product.image,
        category: product.categoryName || 'Khác',
        unit: product.baseUnit || 'Cái',
        stockLevel: product.stock,
        stockValue: product.stock * (product.costPrice ?? product.price),
        status: mapStockStatusWithExpiry(product.stock, 0),
        issuePolicy: 'FIFO',
        trackedBatchCount: 0,
        expiringQuantity: 0,
        expiredQuantity: 0,
      }
    }

    const expiredBatches = productBatches.filter(
      (batch) => getBatchStatus(batch.expiryDate) === 'EXPIRED'
    )
    const nearExpiryBatches = productBatches.filter(
      (batch) => getBatchStatus(batch.expiryDate) === 'NEAR_EXPIRY'
    )
    const sellableBatches = productBatches.filter(
      (batch) => getBatchStatus(batch.expiryDate) !== 'EXPIRED'
    )
    const prioritizedBatches = sortBatchesForIssue(sellableBatches)
    const nextBatch = prioritizedBatches[0]
    const stockLevel = sellableBatches.reduce((sum, batch) => sum + batch.quantity, 0)
    const stockValue = sellableBatches.reduce(
      (sum, batch) => sum + batch.quantity * batch.costPrice,
      0
    )
    const expiringQuantity = nearExpiryBatches.reduce(
      (sum, batch) => sum + batch.quantity,
      0
    )
    const expiredQuantity = expiredBatches.reduce(
      (sum, batch) => sum + batch.quantity,
      0
    )

    return {
      id: product.id,
      sku: product.code,
      name: product.name,
      image: nextBatch?.image || product.image,
      category: product.categoryName || 'Khác',
      unit: product.baseUnit || nextBatch?.unit || 'Cái',
      stockLevel,
      stockValue,
      status: mapStockStatusWithExpiry(stockLevel, expiringQuantity),
      issuePolicy: productBatches.some((batch) => batch.expiryDate) ? 'FEFO' : 'FIFO',
      trackedBatchCount: productBatches.length,
      expiringQuantity,
      expiredQuantity,
      nextExpiryDate: nextBatch?.expiryDate,
    }
  })

const mapBatchItemsToStockBatches = (items: BatchItem[], products: Product[]): StockBatch[] => {
  const productById = new Map(products.map((product) => [product.id, product]))

  return items.map((item) => {
    const product = productById.get(item.productId)

    return {
      id: item.id,
      productId: item.productId,
      sku: product?.code || '',
      productName: item.productName || product?.name || '',
      category: product?.categoryName || 'Khác',
      unit: item.unitName || product?.baseUnit || 'Cái',
      quantity: item.availableQuantity ?? item.currentQuantity,
      costPrice: item.importPrice,
      receivedDate: item.importDate,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      image: product?.image,
    }
  })
}

export const ProductStoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [stockBatches, setStockBatches] = useState<StockBatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setProducts([])
      setStockBatches([])
      setError('')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const [nextProducts, nextBatches] = await Promise.all([
        productService.getAll(),
        batchService.getAll(),
      ])
      setProducts(nextProducts)
      setStockBatches(mapBatchItemsToStockBatches(nextBatches, nextProducts))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu sản phẩm.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const saveProduct = useCallback(async (payload: Partial<Product>) => {
    const existing = products.find((product) => product.id === payload.id)
    const normalized: Partial<Product> = {
      ...payload,
      code: (payload.code?.trim() || existing?.code || nextProductCode(products)).toUpperCase(),
      name: payload.name?.trim() || existing?.name || 'Sản phẩm mới',
      barcode: payload.barcode?.trim() || existing?.barcode || '',
      categoryName: payload.categoryName?.trim() || existing?.categoryName || 'Khác',
      price: toPositiveNumber(payload.price, existing?.price ?? 0),
      costPrice: toPositiveNumber(payload.costPrice, existing?.costPrice ?? 0),
      stock: toPositiveNumber(payload.stock, existing?.stock ?? 0),
      status: payload.status ?? existing?.status ?? 'active',
      image: payload.image || existing?.image,
      baseUnit: payload.baseUnit?.trim() || existing?.baseUnit || 'Cái',
      conversions: payload.conversions ?? existing?.conversions ?? [],
      tax: toPositiveNumber(payload.tax, existing?.tax ?? 0),
    }

    const savedProduct = payload.id
      ? await productService.update(payload.id, normalized)
      : await productService.create(normalized)

    setProducts((prev) => {
      const exists = prev.some((product) => product.id === savedProduct.id)
      if (exists) {
        return prev.map((product) => (product.id === savedProduct.id ? savedProduct : product))
      }
      return [...prev, savedProduct]
    })

    setStockBatches((prev) =>
      prev.map((batch) =>
        batch.productId === savedProduct.id
          ? {
              ...batch,
              sku: savedProduct.code,
              productName: savedProduct.name,
              category: savedProduct.categoryName,
              unit: savedProduct.baseUnit || batch.unit,
              image: savedProduct.image || batch.image,
            }
          : batch
      )
    )

    return savedProduct
  }, [products])

  const deleteProduct = useCallback(async (id: string) => {
    await productService.delete(id)
    setProducts((prev) => prev.filter((product) => product.id !== id))
    setStockBatches((prev) => prev.filter((batch) => batch.productId !== id))
  }, [])

  const importStocks = useCallback(async (lines: ImportStockLine[]) => {
    let updated = 0
    let created = 0

    for (const line of lines) {
      if (line.quantityInBaseUnit <= 0) continue

      const code = line.sku.trim().toUpperCase()
      if (!code) continue

      const existing = products.find((product) => product.code.toUpperCase() === code)
      if (existing) {
        await saveProduct({
          ...existing,
          stock: existing.stock + line.quantityInBaseUnit,
          baseUnit: line.baseUnit || existing.baseUnit,
          costPrice: line.costPrice > 0 ? line.costPrice : existing.costPrice,
          image: line.image || existing.image,
        })
        updated += 1
      } else {
        await saveProduct({
          code,
          name: line.name || `Sản phẩm ${code}`,
          barcode: '',
          categoryName: line.categoryName || 'Nhập kho',
          price: Math.max(line.costPrice, 0),
          costPrice: Math.max(line.costPrice, 0),
          stock: line.quantityInBaseUnit,
          status: 'active',
          baseUnit: line.baseUnit || 'Cái',
          conversions: [],
          tax: 0,
          image: line.image,
        })
        created += 1
      }
    }

    await refresh()
    return { updated, created }
  }, [products, refresh, saveProduct])

  const inventoryItems = useMemo(
    () => mapProductsToInventoryWithBatches(products, stockBatches),
    [products, stockBatches]
  )
  const expiryBatches = useMemo(() => buildExpiryBatches(stockBatches), [stockBatches])
  const expirySummary = useMemo(() => buildExpirySummary(expiryBatches), [expiryBatches])

  const value = useMemo(
    () => ({
      products,
      stockBatches,
      expiryBatches,
      expirySummary,
      isLoading,
      error,
      refresh,
      saveProduct,
      deleteProduct,
      importStocks,
      inventoryItems,
    }),
    [
      products,
      stockBatches,
      expiryBatches,
      expirySummary,
      isLoading,
      error,
      refresh,
      saveProduct,
      deleteProduct,
      importStocks,
      inventoryItems,
    ]
  )

  return <ProductStoreContext.Provider value={value}>{children}</ProductStoreContext.Provider>
}

export const useProductStore = () => {
  const context = useContext(ProductStoreContext)
  if (!context) {
    throw new Error('useProductStore must be used within ProductStoreProvider')
  }
  return context
}
