import type { Product } from '../types/product'

// ── Product Mappers ──

export interface BackendProduct {
  id: string
  categoryId?: string
  categoryName?: string
  code?: string
  name: string
  barcode?: string
  description?: string
  imageUrl?: string
  costPrice: number
  retailPrice: number
  wholesalePrice: number
  stockQuantity: number
  minStockLevel: number
  taxRate: number
  status: string
  trackBatches: boolean
  issuePolicy: string
}

export function mapBackendProduct(data: BackendProduct): Product {
  return {
    id: data.id,
    code: data.code || '',
    name: data.name,
    barcode: data.barcode || '',
    categoryName: data.categoryName || 'Khác',
    price: data.retailPrice,
    costPrice: data.costPrice,
    stock: data.stockQuantity,
    status: (data.status === 'active' ? 'active' : 'inactive') as 'active' | 'inactive',
    image: data.imageUrl,
    baseUnit: 'Cái',
    conversions: [],
    tax: data.taxRate,
  }
}

export function mapProductToBackend(product: Partial<Product>) {
  return {
    categoryId: undefined,
    code: product.code,
    name: product.name,
    barcode: product.barcode,
    imageUrl: product.image,
    costPrice: product.costPrice ?? 0,
    retailPrice: product.price ?? 0,
    wholesalePrice: product.price ?? 0,
    stockQuantity: product.stock ?? 0,
    minStockLevel: 10,
    taxRate: product.tax ?? 0,
    status: product.status ?? 'active',
    trackBatches: false,
    issuePolicy: 'FIFO',
  }
}

// ── Dashboard Mappers ──

export interface BackendDashboardStats {
  todayRevenue: number
  todayOrders: number
  totalProducts: number
  totalCustomers: number
}

export interface BackendChartPoint {
  date: string
  revenue: number
  orders: number
}

export interface BackendTopProduct {
  productId: string
  productName: string
  quantity: number
  revenue: number
}

export interface BackendLowStockAlert {
  productId: string
  productName: string
  currentQty: number
  minQty: number
}
