export interface DashboardStats {
  totalRevenue: {
    value: number
    change: number
  }
  netProfit: {
    value: number
    change: number
  }
  totalOrders: {
    value: number
    change: number
  }
  inventoryValue: {
    value: number
    change: number
  }
}

export interface ChartDataPoint {
  day: string
  revenue: number
  profit: number
}

export interface CategoryRevenue {
  name: string
  percentage: number
  color: string
}

export interface TopProduct {
  id: string
  name: string
  image: string
  soldCount: number
  revenue: number
  change: number
}

export interface IncomeExpense {
  totalIncome: number
  totalExpense: number
  shrinkage: number
  grossProfit: number
}

export interface InventoryAlert {
  id: string
  name: string
  remaining: number
  threshold: number
  unit: string
  status: 'critical' | 'warning'
}
