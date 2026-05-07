import api from './api'
import type { Customer } from '../types/customer'

interface BackendCustomer {
  id: string
  code?: string
  name: string
  phone?: string
  email?: string
  address?: string
  birthday?: string
  memberType: string
  customerGroupId?: string
  customerGroupName?: string
  defaultDiscountPercent?: number
  customDiscountPercent?: number
  usesGroupDefaultDiscount?: boolean
  effectiveDiscountPercent?: number
  hiddenCommissionEnabled?: boolean
  avatarColor?: string
  totalSpent: number
  totalDebt: number
  status: string
  lastPurchaseAt?: string
}

function mapCustomer(data: BackendCustomer): Customer {
  return {
    id: data.id,
    code: data.code || '',
    name: data.name,
    phone: data.phone || '',
    email: data.email,
    address: data.address || '',
    birthday: data.birthday ? new Date(data.birthday).toLocaleDateString('vi-VN') : undefined,
    totalSpent: data.totalSpent,
    debt: data.totalDebt,
    lastPurchase: data.lastPurchaseAt ? new Date(data.lastPurchaseAt).toLocaleDateString('vi-VN') : '—',
    status: data.status === 'active' ? 'active' : 'inactive',
    memberType: data.memberType === 'vip' ? 'vip' : 'regular',
    customerGroupId: data.customerGroupId,
    customerGroupName: data.customerGroupName,
    defaultDiscountPercent: data.defaultDiscountPercent || 0,
    customDiscountPercent: data.customDiscountPercent,
    usesGroupDefaultDiscount: data.usesGroupDefaultDiscount ?? true,
    effectiveDiscountPercent: data.effectiveDiscountPercent || 0,
    hiddenCommissionEnabled: data.hiddenCommissionEnabled ?? false,
    avatarColor: data.avatarColor || 'indigo',
    purchases: [],
  }
}

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const { data } = await api.get('/customers')
    return (data as BackendCustomer[]).map(mapCustomer)
  },

  create: async (c: Partial<Customer>): Promise<Customer> => {
    const { data } = await api.post('/customers', {
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
      customerGroupId: c.customerGroupId || null,
      customDiscountPercent: c.customDiscountPercent ?? null,
      usesGroupDefaultDiscount: c.usesGroupDefaultDiscount ?? true,
      avatarColor: c.avatarColor || 'indigo',
    })
    return mapCustomer(data)
  },

  update: async (id: string, c: Partial<Customer>): Promise<Customer> => {
    const { data } = await api.put(`/customers/${id}`, {
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
      avatarColor: c.avatarColor,
      customerGroupId: c.customerGroupId || null,
      customDiscountPercent: c.customDiscountPercent ?? null,
      usesGroupDefaultDiscount: c.usesGroupDefaultDiscount ?? true,
      status: c.status,
    })
    return mapCustomer(data)
  },
}
