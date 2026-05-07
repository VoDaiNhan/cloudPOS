import type { LoginResponse, User } from '../types/auth'

export const mockUser: User = {
  id: '1',
  name: 'Nguyễn Văn A',
  phone: '0901234567',
  role: 'admin',
  storeName: 'CloudPOS Demo Store',
}

export const mockLoginResponse: LoginResponse = {
  token: 'mock-jwt-token-cloudpos-2026',
  user: mockUser,
  currentStoreId: 'mock-store-1',
  stores: [
    {
      id: 'mock-store-1',
      name: 'CloudPOS Demo Store',
      isPrimary: true,
      isOwner: true,
    },
  ],
}

/**
 * Valid credentials for mock login.
 * In production, this will be handled by the backend.
 */
export const mockCredentials = {
  phone: '0901234567',
  password: '123456',
}
