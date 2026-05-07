import api from './api'
import type { POSProduct } from '../types/posProduct'

interface BackendProduct {
  id: string
  name: string
  retailPrice: number
  imageUrl?: string
  stockQuantity: number
  unitName?: string
  categoryName?: string
  isSellable?: boolean
}

function mapToPOSProduct(p: BackendProduct): POSProduct {
  return {
    id: p.id,
    name: p.name,
    price: p.retailPrice,
    image: p.imageUrl || '/images/pos/default.png',
    stockInBaseUnit: p.stockQuantity,
    baseUnit: p.unitName || 'Cái',
    category: p.categoryName || 'Khác',
    is_sellable: p.isSellable ?? true, // Default to true if not specified
  }
}

export const posService = {
  getProducts: async (): Promise<POSProduct[]> => {
    const { data } = await api.get('/products')
    return (data as BackendProduct[]).map(mapToPOSProduct)
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get('/categories')
    const names = (data as Array<{ name: string }>).map(c => c.name)
    return ['Tất cả', ...names]
  },
}
