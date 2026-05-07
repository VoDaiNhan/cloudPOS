import api from './api'
import type { LoginCredentials, LoginResponse, ApiLoginResponse, RegisterCredentials } from '../types/auth'

export const authService = {
  /**
   * Login via real backend API.
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<ApiLoginResponse>('/auth/login', {
      phone: credentials.phone.trim().replace(/\s+/g, ''),
      password: credentials.password,
    })

    const currentStore =
      data.stores.find((store) => store.id === data.currentStoreId) ??
      data.stores.find((store) => store.isPrimary) ??
      data.stores[0]

    if (!currentStore) {
      throw new Error('Tài khoản chưa được gán cửa hàng nào.')
    }

    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('store_id', currentStore.id)

    const response: LoginResponse = {
      token: data.accessToken,
      currentStoreId: currentStore.id,
      stores: data.stores,
      user: {
        id: data.user.id,
        name: data.user.fullName,
        phone: data.user.phone,
        role: 'admin',
        storeName: currentStore.name,
        storeId: currentStore.id,
      },
    }

    // Cache user info
    localStorage.setItem('user', JSON.stringify(response.user))

    return response
  },

  register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<ApiLoginResponse>('/auth/register', {
      fullName: credentials.fullName.trim(),
      phone: credentials.phone.trim().replace(/\s+/g, ''),
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
      otpCode: credentials.otpCode,
      region: credentials.region,
      storeName: credentials.storeName,
    })

    const currentStore =
      data.stores.find((store) => store.id === data.currentStoreId) ??
      data.stores.find((store) => store.isPrimary) ??
      data.stores[0]

    if (!currentStore) {
      throw new Error('Tài khoản chưa được gán cửa hàng nào.')
    }

    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('store_id', currentStore.id)

    const response: LoginResponse = {
      token: data.accessToken,
      currentStoreId: currentStore.id,
      stores: data.stores,
      user: {
        id: data.user.id,
        name: data.user.fullName,
        phone: data.user.phone,
        role: 'admin',
        storeName: currentStore.name,
        storeId: currentStore.id,
      },
    }

    localStorage.setItem('user', JSON.stringify(response.user))

    return response
  },

  sendRegisterOtp: async (email: string): Promise<void> => {
    await api.post('/auth/register/send-otp', {
      email: email.trim().toLowerCase(),
    })
  },

  /**
   * Logout: clear stored auth data.
   */
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('store_id')
    localStorage.removeItem('user')
  },

  /**
   * Check if user is currently authenticated.
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token')
  },

  /**
   * Get cached user info.
   */
  getUser: () => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
}
