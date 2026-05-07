import api from './api'

export interface StoreDto {
  id: string
  name: string
  phone?: string
  address?: string
  email?: string
  businessType?: string
  slug?: string
  settings?: string
}

export const storeService = {
  getMyStore: async (): Promise<StoreDto> => {
    const { data } = await api.get('/stores/my-store')
    return data as StoreDto
  },

  updateMyStore: async (req: Partial<StoreDto>): Promise<StoreDto> => {
    const { data } = await api.put('/stores/my-store', req)
    return data as StoreDto
  },

  updateSettings: async (settings: Record<string, unknown>): Promise<void> => {
    await api.patch('/stores/settings', settings)
  },
}
