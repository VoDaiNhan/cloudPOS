export interface LoginCredentials {
  phone: string
  password: string
  rememberMe: boolean
}

export interface User {
  id: string
  name: string
  phone: string
  role: string
  storeName: string
}

export interface LoginResponse {
  token: string
  user: User
}
