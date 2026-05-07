import api from './api'
import type { CustomerGroup, CustomerGroupPayload } from '../types/customerGroup'

function mapCustomerGroup(group: CustomerGroup): CustomerGroup {
  return {
    id: group.id,
    code: group.code,
    name: group.name,
    description: group.description,
    defaultDiscountPercent: group.defaultDiscountPercent,
    hiddenCommissionEnabled: group.hiddenCommissionEnabled,
    isActive: group.isActive,
  }
}

export const customerGroupService = {
  getAll: async (): Promise<CustomerGroup[]> => {
    const { data } = await api.get('/customer-groups')
    return (data as CustomerGroup[]).map(mapCustomerGroup)
  },

  create: async (payload: CustomerGroupPayload): Promise<CustomerGroup> => {
    const { data } = await api.post('/customer-groups', payload)
    return mapCustomerGroup(data as CustomerGroup)
  },

  update: async (id: string, payload: CustomerGroupPayload): Promise<CustomerGroup> => {
    const { data } = await api.put(`/customer-groups/${id}`, payload)
    return mapCustomerGroup(data as CustomerGroup)
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customer-groups/${id}`)
  },
}
