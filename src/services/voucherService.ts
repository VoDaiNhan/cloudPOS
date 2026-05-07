import api from './api'

export interface VoucherItem {
  id: string
  code?: string
  type: string
  category?: string
  targetName?: string
  amount: number
  method?: string
  note?: string
  createdByName?: string
  voucherTime: string
}

interface BackendVoucher {
  id: string
  code?: string
  type: string
  category?: string
  targetName?: string
  amount: number
  method?: string
  note?: string
  createdByName?: string
  voucherTime: string
}

function mapVoucher(v: BackendVoucher): VoucherItem {
  return {
    id: v.id,
    code: v.code,
    type: v.type,
    category: v.category,
    targetName: v.targetName || '—',
    amount: v.amount,
    method: v.method,
    note: v.note,
    createdByName: v.createdByName || 'Admin',
    voucherTime: new Date(v.voucherTime).toLocaleString('vi-VN'),
  }
}

export const voucherService = {
  getAll: async (type?: string): Promise<VoucherItem[]> => {
    const params = type ? `?type=${type}` : ''
    const { data } = await api.get(`/vouchers${params}`)
    return (data as BackendVoucher[]).map(mapVoucher)
  },

  create: async (request: {
    type: string
    category?: string
    targetName?: string
    targetId?: string
    amount: number
    method?: string
    note?: string
  }): Promise<VoucherItem> => {
    const { data } = await api.post('/vouchers', request)
    return mapVoucher(data as BackendVoucher)
  },
}
