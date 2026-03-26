/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { mockProducts } from '../mock/product'
import { mockStockBatches } from '../mock/stock-batches'
import type { ExpiryBatch, ExpirySummary } from '../types/expiry'
import type { InventoryItem, InventoryStatus, StockBatch } from '../types/inventory'
import type { Product } from '../types/product'
import { buildExpiryBatches, buildExpirySummary, getBatchStatus, sortBatchesForIssue } from '../utils/stockBatchUtils'

const PRODUCT_STORAGE_KEY = 'cloudpos.products.v1'
const BATCH_STORAGE_KEY = 'cloudpos.stock-batches.v1'
const STORAGE_VERSION_KEY = 'cloudpos.data-version'
const CURRENT_STORAGE_VERSION = '3'

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
  saveProduct: (payload: Partial<Product>) => Product
  deleteProduct: (id: string) => void
  importStocks: (lines: ImportStockLine[]) => { updated: number; created: number }
  inventoryItems: InventoryItem[]
}

const ProductStoreContext = createContext<ProductStoreContextValue | null>(null)

const ensureStorageVersion = () => {
  try {
    const currentVersion = localStorage.getItem(STORAGE_VERSION_KEY)
    if (currentVersion === CURRENT_STORAGE_VERSION) return false

    // Force-refresh old demo cache so all pages start from POS-aligned seed.
    localStorage.removeItem(PRODUCT_STORAGE_KEY)
    localStorage.removeItem(BATCH_STORAGE_KEY)
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION)
    return true
  } catch {
    return false
  }
}

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

const mapStockStatus = (stockLevel: number): InventoryStatus => {
  if (stockLevel <= 0) return 'low'
  if (stockLevel <= 5) return 'low'
  if (stockLevel <= 10) return 'under_limit'
  return 'stable'
}

const mapProductsToInventory = (products: Product[]): InventoryItem[] =>
  products.map((product) => ({
    id: product.id,
    sku: product.code,
    name: product.name,
    image: product.image,
    category: product.categoryName || 'Khác',
    unit: product.baseUnit || 'Cái',
    stockLevel: product.stock,
    stockValue: product.stock * (product.costPrice ?? product.price),
    status: mapStockStatus(product.stock),
    issuePolicy: 'FIFO',
    trackedBatchCount: 0,
    expiringQuantity: 0,
    expiredQuantity: 0,
  }))

void mapProductsToInventory

const syncProductsWithPosSeed = (storedProducts: Product[]) => {
  const storedByCode = new Map(
    storedProducts.map((product) => [product.code.toUpperCase(), product])
  )

  return mockProducts.map((seedProduct) => {
    const existing = storedByCode.get(seedProduct.code.toUpperCase())
    if (!existing) return seedProduct

    return {
      ...seedProduct,
      stock: toPositiveNumber(existing.stock, seedProduct.stock),
      price: toPositiveNumber(existing.price, seedProduct.price),
      costPrice: toPositiveNumber(existing.costPrice, seedProduct.costPrice ?? 0),
      status: existing.status ?? seedProduct.status,
      tax: toPositiveNumber(existing.tax, seedProduct.tax ?? 0),
      barcode: existing.barcode || seedProduct.barcode,
    }
  })
}

const readProductsFromStorage = (): Product[] => {
  try {
    if (ensureStorageVersion()) return mockProducts

    const raw = localStorage.getItem(PRODUCT_STORAGE_KEY)
    if (!raw) return mockProducts
    const parsed = JSON.parse(raw) as Product[]
    if (!Array.isArray(parsed) || parsed.length === 0) return mockProducts
    return syncProductsWithPosSeed(parsed)
  } catch {
    return mockProducts
  }
}

const readBatchesFromStorage = (): StockBatch[] => {
  try {
    if (ensureStorageVersion()) return mockStockBatches

    const raw = localStorage.getItem(BATCH_STORAGE_KEY)
    if (!raw) return mockStockBatches
    const parsed = JSON.parse(raw) as StockBatch[]
    if (!Array.isArray(parsed) || parsed.length === 0) return mockStockBatches
    return parsed
  } catch {
    return mockStockBatches
  }
}

export const ProductStoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => readProductsFromStorage())
  const [stockBatches, setStockBatches] = useState<StockBatch[]>(() => readBatchesFromStorage())

  useEffect(() => {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(stockBatches))
  }, [stockBatches])

  const saveProduct = useCallback((payload: Partial<Product>) => {
    let savedProduct: Product | null = null

    setProducts((prev) => {
      const isEdit = Boolean(payload.id)
      const existing = prev.find((product) => product.id === payload.id)

      const normalized: Product = {
        id: payload.id ?? `p-${Date.now()}`,
        code: (payload.code?.trim() || (isEdit && existing?.code) || nextProductCode(prev)).toUpperCase(),
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

      savedProduct = normalized
      if (isEdit) {
        return prev.map((product) => (product.id === normalized.id ? normalized : product))
      }
      return [...prev, normalized]
    })

    if (savedProduct) {
      setStockBatches((prev) =>
        prev.map((batch) =>
          batch.productId === savedProduct?.id
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
    }

    if (!savedProduct) {
      throw new Error('Khong the luu san pham')
    }

    return savedProduct
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
    setStockBatches((prev) => prev.filter((batch) => batch.productId !== id))
  }, [])

  const importStocks = useCallback((lines: ImportStockLine[]) => {
    let updated = 0
    let created = 0

    const nextProducts = [...products]
    const nextBatches = [...stockBatches]

    lines.forEach((line, index) => {
        if (line.quantityInBaseUnit <= 0) return

        const code = line.sku.trim().toUpperCase()
        if (!code) return
        const productIndex = nextProducts.findIndex(
          (product) => product.code.toUpperCase() === code
        )
        if (productIndex >= 0) {
          const current = nextProducts[productIndex]
          nextProducts[productIndex] = {
            ...current,
            stock: current.stock + line.quantityInBaseUnit,
            baseUnit: line.baseUnit || current.baseUnit,
            costPrice: line.costPrice > 0 ? line.costPrice : current.costPrice,
            image: line.image || current.image,
          }
          updated += 1
        } else {
          const newProduct: Product = {
          id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
        }
        nextProducts.push(newProduct)
        created += 1
        }

        const trackedProduct =
          productIndex >= 0
            ? nextProducts[productIndex]
            : nextProducts[nextProducts.length - 1]

        const batchKey = `${code}::${(line.batchNumber || '').trim().toUpperCase()}::${line.expiryDate || ''}`
        const batchIndex = nextBatches.findIndex((batch) => {
          const currentKey = `${batch.sku.toUpperCase()}::${batch.batchNumber.trim().toUpperCase()}::${batch.expiryDate || ''}`
          return currentKey === batchKey
        })

        if (batchIndex >= 0) {
          nextBatches[batchIndex] = {
            ...nextBatches[batchIndex],
            quantity: nextBatches[batchIndex].quantity + line.quantityInBaseUnit,
            costPrice:
              line.costPrice > 0 ? line.costPrice : nextBatches[batchIndex].costPrice,
            receivedDate: line.receivedDate || nextBatches[batchIndex].receivedDate,
            unit: line.baseUnit || nextBatches[batchIndex].unit,
          }
          return
        }

        nextBatches.push({
          id: `batch-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
          productId: trackedProduct.id,
          sku: code,
          productName: trackedProduct.name,
          category: trackedProduct.categoryName || 'Khác',
          unit: line.baseUnit || trackedProduct.baseUnit || 'Cái',
          quantity: line.quantityInBaseUnit,
          costPrice: Math.max(line.costPrice, 0),
          receivedDate: line.receivedDate || new Date().toISOString().slice(0, 10),
          batchNumber: line.batchNumber?.trim() || `AUTO-${Date.now()}-${index + 1}`,
          expiryDate: line.expiryDate,
          image: line.image || trackedProduct.image,
        })
      })

    setProducts(nextProducts)
    setStockBatches(nextBatches)

    return { updated, created }
  }, [products, stockBatches])

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
