export interface LoginCredentials {
  phone: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  fullName: string
  phone: string
  email: string
  password: string
  otpCode: string
  region?: string
  storeName?: string
}

export interface User {
  id: string
  name: string
  phone: string
  role: string
  storeName: string
  storeId?: string
}

export interface StoreAccess {
  id: string
  name: string
  slug?: string
  isPrimary: boolean
  isOwner: boolean
}

export interface LoginResponse {
  token: string
  user: User
  stores: StoreAccess[]
  currentStoreId?: string
}

// Raw API response shape from backend
export interface ApiLoginResponse {
  accessToken: string
  currentStoreId?: string
  stores: StoreAccess[]
  user: {
    id: string
    fullName: string
    phone: string
  }
}
