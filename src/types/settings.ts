export interface StoreSettings {
  name: string
  phone: string
  address: string
  website: string
}

export interface TaxSettings {
  vatEnabled: boolean
  vatRate: number
  receiptTemplate: 'A80' | 'A5'
}

export type PaymentStatus = 'on' | 'configure' | 'activate'

export interface PaymentMethod {
  id: string
  label: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  status: PaymentStatus
}

export type PrinterStatus = 'ready' | 'offline' | 'error'

export interface DeviceSettings {
  printerStatus: PrinterStatus
  printerModel: string
  printerOptions: string[]
  scannerConnection: string
  scannerAutoEnter: boolean
}
