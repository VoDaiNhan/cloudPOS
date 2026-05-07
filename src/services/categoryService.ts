import api from './api'
import type { Category } from '../types/category'

interface BackendCategory {
  id: string
  code?: string
  name: string
  description?: string
  icon?: string
  iconBg?: string
  iconColor?: string
  sortOrder: number
  isActive: boolean
}

function mapCategory(data: BackendCategory): Category {
  return {
    id: data.id,
    code: data.code || '',
    name: data.name,
    skuCount: 0,
    description: data.description || '',
    icon: data.icon || 'category',
    iconBg: data.iconBg || 'bg-blue-50',
    iconColor: data.iconColor || 'text-blue-600',
  }
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories')
    return (data as BackendCategory[]).map(mapCategory)
  },

  create: async (cat: Partial<Category>): Promise<Category> => {
    const { data } = await api.post('/categories', {
      name: cat.name,
      code: cat.code,
      description: cat.description,
      icon: cat.icon,
      iconBg: cat.iconBg,
      iconColor: cat.iconColor,
    })
    return mapCategory(data)
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`)
  },
}
