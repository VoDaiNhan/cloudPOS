import type {
  DashboardStats,
  ChartDataPoint,
  CategoryRevenue,
  TopProduct,
  IncomeExpense,
  InventoryAlert,
} from '../types/dashboard'
import { posProducts } from './pos'

const totalInventoryValue = posProducts.reduce(
  (sum, product) => sum + product.stockInBaseUnit * product.price,
  0
)

export const mockDashboardStats: DashboardStats = {
  totalRevenue: { value: 250000000, change: 12.5 },
  netProfit: { value: 45000000, change: 8.2 },
  totalOrders: { value: 1240, change: 5.4 },
  inventoryValue: { value: totalInventoryValue, change: -2.1 },
}

export const mockChartData: ChartDataPoint[] = [
  { day: 'Thứ 2', revenue: 20000000, profit: 4000000 },
  { day: 'Thứ 3', revenue: 25000000, profit: 5500000 },
  { day: 'Thứ 4', revenue: 22000000, profit: 4500000 },
  { day: 'Thứ 5', revenue: 35000000, profit: 8000000 },
  { day: 'Thứ 6', revenue: 32000000, profit: 7000000 },
  { day: 'Thứ 7', revenue: 45000000, profit: 11000000 },
  { day: 'CN', revenue: 42000000, profit: 10000000 },
]

const categoryMap = new Map<string, number>()
posProducts.forEach((product) => {
  const current = categoryMap.get(product.category) ?? 0
  categoryMap.set(product.category, current + product.stockInBaseUnit * product.price)
})

const categoryPalette = ['#1c43a6', '#10b981', '#f59e0b', '#6366f1', '#ec4899']
const categoryTotal = Array.from(categoryMap.values()).reduce((sum, value) => sum + value, 0)

export const mockCategoryRevenue: CategoryRevenue[] = Array.from(categoryMap.entries())
  .sort((a, b) => b[1] - a[1])
  .map(([name, amount], index) => ({
    name,
    percentage: categoryTotal > 0 ? Math.round((amount / categoryTotal) * 100) : 0,
    color: categoryPalette[index % categoryPalette.length],
  }))

export const mockTopProducts: TopProduct[] = posProducts
  .map((product, index) => {
    const soldCount = Math.max(20, product.stockInBaseUnit * 5)
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      soldCount,
      revenue: soldCount * product.price,
      change: (index % 2 === 0 ? 1 : -1) * (3 + (index % 6)),
    }
  })
  .sort((a, b) => b.soldCount - a.soldCount)
  .slice(0, 5)

export const mockIncomeExpense: IncomeExpense = {
  totalIncome: 320000000,
  totalExpense: 210000000,
  shrinkage: 4500000,
  grossProfit: 110000000,
}

export const mockInventoryAlerts: InventoryAlert[] = posProducts
  .map((product, index) => ({
    id: `a-${index + 1}`,
    name: product.name,
    remaining: product.stockInBaseUnit,
    threshold: Math.max(8, Math.ceil(product.stockInBaseUnit * 1.5)),
    unit: product.baseUnit,
    status: product.stockInBaseUnit <= 10 ? ('critical' as const) : ('warning' as const),
  }))
  .filter((item) => item.remaining <= item.threshold)
  .sort((a, b) => a.remaining - b.remaining)
  .slice(0, 5)
