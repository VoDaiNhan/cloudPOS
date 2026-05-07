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
  // ── Supplier discount fields ──
  discountPercent: number        // % chiết khấu NCC dành cho cửa hàng (VD: 30%)
  discountType: 'percent' | 'fixed'  // Loại chiết khấu
  actualTotalPaid: number        // Tổng tiền thực trả (sau chiết khấu)
  totalDiscountSaved: number     // Tổng tiền tiết kiệm từ chiết khấu NCC
  imports?: ImportRecord[]
}
