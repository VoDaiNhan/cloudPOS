import type { DashboardStats, ChartDataPoint, CategoryRevenue, TopProduct, IncomeExpense, InventoryAlert } from '../types/dashboard'

export const mockDashboardStats: DashboardStats = {
  totalRevenue: { value: 250000000, change: 12.5 },
  netProfit: { value: 45000000, change: 8.2 },
  totalOrders: { value: 1240, change: 5.4 },
  inventoryValue: { value: 85000000, change: -2.1 }
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

export const mockCategoryRevenue: CategoryRevenue[] = [
  { name: 'Nước giải khát', percentage: 45, color: '#1c43a6' },
  { name: 'Sữa', percentage: 25, color: '#10b981' },
  { name: 'Mì gói', percentage: 20, color: '#f59e0b' },
  { name: 'Khác', percentage: 10, color: '#6366f1' },
]

export const mockTopProducts: TopProduct[] = [
  {
    id: 'p1',
    name: 'Coca Cola 330ml',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDI813sCJaOhmVFKS9kekxd9z48xEyIhBEQpdDE9YQvcNkO9Ug8Oa_lQ5uV20dz1lgMKhCKQ28Rm2wX7ofFIQhI4NRC0NGWzgmgWCiNj0sAbMLwnm8Nny2rV3TDaJgdmyFSa1rWYz8Gko7Mj5frfF28Ypyyfqa0mnruzh5YYs96o_rqb8L9NLuoFbfSgCOxaCn3MRjkKL-QqffKq_rqmqL18Zk7B6JtnwRB2RZ1ic1xaNC6vnTcB-CVU0Sg3WruU6KHPxDOHkg-X0',
    soldCount: 1240,
    revenue: 12400000,
    change: 5
  },
  {
    id: 'p2',
    name: 'Sữa Vinamilk 1L',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGlvFkCaPYXg6Pi8RyJVyRCPyizhpZBrLkmaWTbDTKCIle5I4rfN9uWPXE1rhYTv-04PK-u1L3-ArqzJwAR0CFJc8v8PtCOCmMvc-yc8FO_d8OE7_SAZU4aBwNXnfIg7BLwaJDDN2yfDb6CTMi0n5XVSEmGxs-yZ-cPfQ8OVB5wopLsz_lGqU1gCo7X4TGzR4RVVeHeWfkxH4KMh2rsaKgE4SnDpvSwqap5Wiv8UkBUVTh682fWV95wJEenP38x_NGuJWVpPTSxC8',
    soldCount: 890,
    revenue: 31200000,
    change: 12
  },
  {
    id: 'p3',
    name: 'Mì Hảo Hảo Tôm Chua Cay',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXOyiDEVkOPpz0MELq7fB0bdUqIO9suDvMelLgQd1otptN915WZtFHcQQZFSgCnmvIJldwT07R98rT-I5jClBlhkNdvjrxNNI_2poQ0L-WWOQlv87pjnLcGPUYjZjEz6ulFXqZbkrfRiJCF2rjgbLDWMQwyp_UmHSSUbvhrFGyroDwWjMiiOEoULMnJAB1oy68kNS1DsLzz5vsqwRQ07kfz5lM3a0LvWRRIFhXP359kN02vflwfYNHsdBsZdHLtnFXq7XeSRJZ9ws',
    soldCount: 750,
    revenue: 3800000,
    change: -2
  },
  {
    id: 'p4',
    name: 'Nước Aquafina 500ml',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ2p3ontarV2gGrPmGMZfCqkymeIcCVRmiTFeahm0vZpaUeFck0dCp7CBc_aB2rzBMRqH25S6zxTyk4OIXZP4PUcmxQo91ePhRRNr9BsODmJz5MOvrX1COK5GZpojHmzOPjKiEpYrvftRTNsOKzkN4g-BmvcYdAsfUmuTmMnEE9_wticUpWmFpkgkhAtUhgO18c1PQk2gRbXA0rpwN4Ib-r3KhfySFQiyvuKV-dOmNYrR9sO-6p1HI0t4XwRp6ao0CEh41_JrO_aM',
    soldCount: 620,
    revenue: 3100000,
    change: 8
  },
  {
    id: 'p5',
    name: 'Bánh Lay\'s Classic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClfW3G2yvmLed51uMgNZMoeFLvbYHgaEV7MxjBlaGtNYVb90h1TVPA-4WXgqUzHkaLJkJoYhewh6yoqqrXqruzPLxBs8Px-c4SiokfJa0idoyZfyA0R0L75Bql6EDxfnJ6RhelkkDJypMycpub_GZ39ScTMUqgsfB_3aoEWaEIyb9E7Jl33QZPxP38cVS5GPIdXSunUB9IrCCPv8tmKxBT2BTsgtCKXeJUDu7R1QGYqUFPSYlQLG2xcxArzOa29dGKgytLNy0pOeU',
    soldCount: 580,
    revenue: 8700000,
    change: 15
  }
]

export const mockIncomeExpense: IncomeExpense = {
  totalIncome: 320000000,
  totalExpense: 210000000,
  shrinkage: 4500000,
  grossProfit: 110000000
}

export const mockInventoryAlerts: InventoryAlert[] = [
  {
    id: 'a1',
    name: 'Sữa Milo 180ml',
    remaining: 5,
    threshold: 30,
    unit: 'lốc',
    status: 'critical'
  },
  {
    id: 'a2',
    name: 'Dầu ăn Tường An 1L',
    remaining: 12,
    threshold: 50,
    unit: 'chai',
    status: 'warning'
  },
  {
    id: 'a3',
    name: 'Khăn giấy Pulppy',
    remaining: 8,
    threshold: 40,
    unit: 'gói',
    status: 'warning'
  }
]
