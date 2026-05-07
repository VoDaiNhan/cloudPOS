import api from './api'
import type { Supplier } from '../types/supplier'

interface BackendSupplier {
  id: string
  code?: string
  name: string
  phone?: string
  email?: string
  address?: string
  category?: string
  categoryColor?: string
  totalImported: number
  totalDebt: number
  discountPercent?: number
  discountType?: string
  actualTotalPaid?: number
  totalDiscountSaved?: number
}

function mapSupplier(data: BackendSupplier): Supplier {
  const totalImported = data.totalImported || 0
  const discountPercent = data.discountPercent || 0
  const totalDiscountSaved = data.totalDiscountSaved ?? Math.round(totalImported * discountPercent / 100)
  const actualTotalPaid = data.actualTotalPaid ?? (totalImported - totalDiscountSaved)

  return {
    id: data.id,
    code: data.code || '',
    name: data.name,
    phone: data.phone || '',
    email: data.email,
    address: data.address || '',
    category: data.category || 'Khác',
    categoryColor: data.categoryColor || 'blue',
    totalImported: totalImported,
    debt: data.totalDebt,
    discountPercent,
    discountType: (data.discountType as 'percent' | 'fixed') || 'percent',
    actualTotalPaid,
    totalDiscountSaved,
    imports: [],
  }
}

export const supplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await api.get('/suppliers')
    return (data as BackendSupplier[]).map(mapSupplier)
  },

  create: async (s: Partial<Supplier>): Promise<Supplier> => {
    const { data } = await api.post('/suppliers', {
      name: s.name,
      phone: s.phone,
      email: s.email,
      address: s.address,
      category: s.category,
      categoryColor: s.categoryColor,
      discountPercent: s.discountPercent,
      discountType: s.discountType,
    })
    return mapSupplier(data)
  },

  update: async (id: string, s: Partial<Supplier>): Promise<Supplier> => {
    const { data } = await api.put(`/suppliers/${id}`, {
      name: s.name,
      phone: s.phone,
      email: s.email,
      address: s.address,
      category: s.category,
      discountPercent: s.discountPercent,
      discountType: s.discountType,
    })
    return mapSupplier(data)
  },
}
