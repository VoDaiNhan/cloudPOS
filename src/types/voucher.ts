export type VoucherType = 'RECEIPT' | 'PAYMENT'

export type ReceiptCategory = 'SALES' | 'DEBT_COLLECTION' | 'OTHER'
export type PaymentCategory = 'IMPORT' | 'DEBT_PAYMENT' | 'SALARY' | 'OTHER'

export type TargetType = 'CUSTOMER' | 'SUPPLIER' | 'EMPLOYEE' | 'OTHER'

export interface VoucherFormState {
  type: VoucherType
  category: string
  targetName: string
  targetId?: string
  targetType: TargetType
  relatedDocumentId?: string
  amount: number
  method: 'CASH' | 'TRANSFER' | 'CARD'
  time: string
  note: string
}
