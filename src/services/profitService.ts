import api from './api'

// ── Types ────────────────────────────────────────

export interface ProfitSummary {
  totalRevenue: number          // Tổng doanh thu bán hàng
  totalCostOfGoods: number      // Tổng giá vốn (giá nhập ghi sổ)
  totalActualCost: number       // Tổng giá thực trả NCC (sau chiết khấu NCC)
  totalSupplierDiscount: number // Tổng chiết khấu NCC
  totalCommissionPaid: number   // Tổng hoa hồng đã chi cho khách thợ
  totalCommissionPending: number // Tổng hoa hồng chưa chi
  grossProfit: number           // Lãi gộp = Doanh thu − Giá vốn
  netProfit: number             // Lợi nhuận thực = Doanh thu − Giá thực trả − Hoa hồng đã chi
  grossMarginPercent: number    // % lãi gộp
  netMarginPercent: number      // % lợi nhuận thực
}

export interface ProfitByProduct {
  productId: string
  productName: string
  productCode: string
  categoryName?: string
  totalSold: number
  revenue: number             // Doanh thu bán
  costPrice: number           // Giá nhập ghi sổ (đơn giá)
  totalCost: number           // Tổng giá vốn
  supplierName?: string
  supplierDiscountPercent: number
  actualCost: number          // Giá thực trả = cost × (1 − discount%)
  grossProfit: number         // Lãi gộp = revenue − totalCost
  netProfit: number           // Lãi thực = revenue − actualCost
  grossMarginPercent: number
  netMarginPercent: number
}

export interface ProfitBySupplier {
  supplierId: string
  supplierName: string
  supplierCode: string
  discountPercent: number
  totalImported: number       // Giá trị nhập ghi sổ
  actualPaid: number          // Giá trị thực trả
  discountSaved: number       // Tiền tiết kiệm nhờ chiết khấu
  productCount: number
}

interface BackendProfitSummary {
  totalRevenue: number
  totalBookCost: number
  totalActualCost: number
  totalDiscountSaved: number
  bookProfit: number
  actualProfit: number
  profitMargin: number
}

interface BackendProfitByProduct {
  productId: string
  productName?: string
  barcode?: string
  quantitySold: number
  totalRevenue: number
  totalCost: number
  profit: number
  profitMargin: number
}

interface BackendProfitBySupplier {
  supplierId: string
  supplierName?: string
  totalProductsSold: number
  totalRevenue: number
  totalCost: number
  profit: number
  profitMargin: number
}

// ── Service ──────────────────────────────────────

export const profitService = {
  getSummary: async (period?: string): Promise<ProfitSummary> => {
    const params = period ? `?period=${period}` : ''
    const { data } = await api.get(`/reports/profit/summary${params}`)
    const p = data as BackendProfitSummary
    return {
      totalRevenue: p.totalRevenue,
      totalCostOfGoods: p.totalBookCost,
      totalActualCost: p.totalActualCost,
      totalSupplierDiscount: p.totalDiscountSaved,
      totalCommissionPaid: 0,
      totalCommissionPending: 0,
      grossProfit: p.bookProfit,
      netProfit: p.actualProfit,
      grossMarginPercent: p.profitMargin,
      netMarginPercent: p.profitMargin
    }
  },

  getByProduct: async (period?: string): Promise<ProfitByProduct[]> => {
    const params = period ? `?period=${period}` : ''
    const { data } = await api.get(`/reports/profit/by-product${params}`)
    return (data as BackendProfitByProduct[]).map((p) => ({
      productId: p.productId,
      productName: p.productName || '—',
      productCode: p.barcode || '—',
      categoryName: '—',
      totalSold: p.quantitySold,
      revenue: p.totalRevenue,
      costPrice: p.quantitySold > 0 ? p.totalCost / p.quantitySold : 0,
      totalCost: p.totalCost,
      supplierName: '—',
      supplierDiscountPercent: 0,
      actualCost: p.totalCost,
      grossProfit: p.profit,
      netProfit: p.profit,
      grossMarginPercent: p.profitMargin,
      netMarginPercent: p.profitMargin,
    }))
  },

  getBySupplier: async (period?: string): Promise<ProfitBySupplier[]> => {
    const params = period ? `?period=${period}` : ''
    const { data } = await api.get(`/reports/profit/by-supplier${params}`)
    return (data as BackendProfitBySupplier[]).map((s) => ({
      supplierId: s.supplierId,
      supplierName: s.supplierName || '—',
      supplierCode: '—',
      discountPercent: 0,
      totalImported: s.totalCost,
      actualPaid: s.totalCost,
      discountSaved: 0,
      productCount: s.totalProductsSold,
    }))
  },
}
