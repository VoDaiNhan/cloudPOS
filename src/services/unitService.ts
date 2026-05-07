import api from './api'

export interface UnitItem {
  id: string
  name: string
  category?: string
  isBase: boolean
  description?: string
}

export interface UnitConversion {
  id: string
  productId?: string
  productName?: string
  fromUnitId: string
  fromUnitName?: string
  toUnitId: string
  toUnitName?: string
  rate: number
  description?: string
}

interface BackendUnit {
  id: string
  name: string
  category?: string
  isBase: boolean
  description?: string
}

interface BackendConversion {
  id: string
  productId?: string
  productName?: string
  fromUnitId: string
  fromUnitName?: string
  toUnitId: string
  toUnitName?: string
  rate: number
  description?: string
}

export const unitService = {
  getAll: async (): Promise<UnitItem[]> => {
    const { data } = await api.get('/units')
    return (data as BackendUnit[]).map(u => ({
      id: u.id,
      name: u.name,
      category: u.category,
      isBase: u.isBase,
      description: u.description,
    }))
  },

  create: async (req: { name: string; category?: string; isBase: boolean; description?: string }): Promise<UnitItem> => {
    const { data } = await api.post('/units', req)
    const u = data as BackendUnit
    return { id: u.id, name: u.name, category: u.category, isBase: u.isBase, description: u.description }
  },
}

export const unitConversionService = {
  getAll: async (productId?: string): Promise<UnitConversion[]> => {
    const params = productId ? `?productId=${productId}` : ''
    const { data } = await api.get(`/unit-conversions${params}`)
    return (data as BackendConversion[]).map(c => ({
      id: c.id,
      productId: c.productId,
      productName: c.productName,
      fromUnitId: c.fromUnitId,
      fromUnitName: c.fromUnitName,
      toUnitId: c.toUnitId,
      toUnitName: c.toUnitName,
      rate: c.rate,
      description: c.description,
    }))
  },

  create: async (req: { productId?: string; fromUnitId: string; toUnitId: string; rate: number; description?: string }): Promise<UnitConversion> => {
    const { data } = await api.post('/unit-conversions', req)
    const c = data as BackendConversion
    return { id: c.id, productId: c.productId, productName: c.productName, fromUnitId: c.fromUnitId, fromUnitName: c.fromUnitName, toUnitId: c.toUnitId, toUnitName: c.toUnitName, rate: c.rate, description: c.description }
  },

  delete: async (id: string): Promise<boolean> => {
    await api.delete(`/unit-conversions/${id}`)
    return true
  },
}
