import api from './api'

export interface AccountInfo {
  id: string
  fullName: string
  phone?: string
  email?: string
  avatarUrl?: string
  createdAt: string
}

export const accountService = {
  get: async (): Promise<AccountInfo> => {
    const { data } = await api.get('/account')
    return data as AccountInfo
  },

  update: async (info: Partial<AccountInfo>): Promise<AccountInfo> => {
    const { data } = await api.put('/account', {
      fullName: info.fullName,
      email: info.email,
      avatarUrl: info.avatarUrl,
    })
    return data as AccountInfo
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const { data } = await api.put('/account/password', { currentPassword, newPassword })
    return (data as { success: boolean }).success
  },
}
