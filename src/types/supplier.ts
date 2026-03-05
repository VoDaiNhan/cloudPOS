export interface ImportRecord {
  id: string
  code: string
  date: string
  products: string
  quantity: number
  total: number
  status: 'imported' | 'pending' | 'cancelled'
}

export interface Supplier {
  id: string
  code: string
  name: string
  address: string
  phone: string
  email?: string
  category: string
  categoryColor: string
  totalImported: number
  debt: number
  imports?: ImportRecord[]
}
