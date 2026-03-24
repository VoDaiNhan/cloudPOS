import type { StoreSettings, TaxSettings, PaymentMethod, DeviceSettings } from '../types/settings'

export const mockStoreSettings: StoreSettings = {
  name: 'CloudPOS Premium Store',
  phone: '090 123 4567',
  address: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
  website: 'cloudpos.vn/store-premium',
}

export const mockTaxSettings: TaxSettings = {
  vatEnabled: true,
  vatRate: 10,
  receiptTemplate: 'A80',
}

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    label: 'Tiền mặt',
    description: 'Thanh toán trực tiếp bằng tiền giấy',
    icon: 'payments',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    status: 'on',
  },
  {
    id: 'qr',
    label: 'Chuyển khoản / QR Code',
    description: 'VietQR, MoMo, ZaloPay...',
    icon: 'qr_code_2',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    status: 'configure',
  },
  {
    id: 'card',
    label: 'Máy quẹt thẻ (POS)',
    description: 'Kết nối máy quẹt thẻ ngân hàng',
    icon: 'credit_card',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-500',
    status: 'activate',
  },
]

export const mockDeviceSettings: DeviceSettings = {
  printerStatus: 'ready',
  printerModel: 'Xprinter XP-N160II (USB)',
  printerOptions: ['Xprinter XP-N160II (USB)', 'Bixolon SRP-330II (LAN)'],
  scannerConnection: 'HID Keyboard (USB)',
  scannerAutoEnter: true,
}
