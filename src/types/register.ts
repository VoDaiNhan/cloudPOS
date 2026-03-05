export interface RegisterFormData {
  fullName: string
  phone: string
  region: string
  otp: string[]
  agreeTerms: boolean
}

export interface Region {
  value: string
  label: string
}

export interface OtpResponse {
  success: boolean
  message: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  redirectUrl: string
}
