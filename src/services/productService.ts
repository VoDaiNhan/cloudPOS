import api from './api'
import type { Product } from '../types/product'
import { mapBackendProduct, mapProductToBackend } from '../utils/apiMappers'
import type { BackendProduct } from '../utils/apiMappers'

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/products')
    return (data as BackendProduct[]).map(mapBackendProduct)
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`)
    return mapBackendProduct(data)
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    const payload = mapProductToBackend(product)
    const { data } = await api.post('/products', payload)
    return mapBackendProduct(data)
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const payload = mapProductToBackend(product)
    const { data } = await api.put(`/products/${id}`, payload)
    return mapBackendProduct(data)
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`)
  },
}
