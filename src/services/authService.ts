import type { LoginCredentials, LoginResponse } from '../types/auth'
import { mockLoginResponse, mockCredentials } from '../mock/auth'

/**
 * Auth service layer.
 * Currently uses mock data. Replace with real API calls when backend is ready.
 */

export const authService = {
  /**
   * Simulate login API call.
   * Replace the body with: return api.post('/auth/login', credentials)
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (
      credentials.phone === mockCredentials.phone &&
      credentials.password === mockCredentials.password
    ) {
      const response = mockLoginResponse
      localStorage.setItem('access_token', response.token)
      return response
    }

    throw new Error('Số điện thoại hoặc mật khẩu không đúng')
  },

  /**
   * Logout: clear stored auth data.
   */
  logout: () => {
    localStorage.removeItem('access_token')
  },

  /**
   * Check if user is currently authenticated.
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token')
  },
}
