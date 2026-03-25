import type { ProductPrice, PricingStrategy, InventoryValue } from '../types/pricing'

// Common pricing strategies
export const pricingStrategies: PricingStrategy[] = [
  {
    id: 'strategy-1',
    name: 'Tiêu chuẩn',
    description: 'Lợi nhuận 30% cho bán lẻ, giảm 10% cho bán sỉ',
    retailMarkupPercent: 30,
    wholesaleDiscountPercent: 10,
    isDefault: true,
  },
  {
    id: 'strategy-2',
    name: 'Cao cấp',
    description: 'Lợi nhuận 50% cho bán lẻ, giảm 8% cho bán sỉ',
    retailMarkupPercent: 50,
    wholesaleDiscountPercent: 8,
    isDefault: false,
  },
  {
    id: 'strategy-3',
    name: 'Cạnh tranh',
    description: 'Lợi nhuận 20% cho bán lẻ, giảm 15% cho bán sỉ',
    retailMarkupPercent: 20,
    wholesaleDiscountPercent: 15,
    isDefault: false,
  },
  {
    id: 'strategy-4',
    name: 'Khuyến mãi',
    description: 'Lợi nhuận 25% cho bán lẻ, giảm 20% cho bán sỉ',
    retailMarkupPercent: 25,
    wholesaleDiscountPercent: 20,
    isDefault: false,
  },
]

// Sample product prices
export const productPrices: ProductPrice[] = [
  {
    productId: 'prod-coca',
    productName: 'Coca Cola',
    importPrice: 8000, // Giá nhập 8,000đ/lon
    retailPrice: 10000, // Giá bán lẻ 10,000đ/lon
    retailMargin: 2000,
    retailMarkup: 25, // 25% markup
    wholesalePrice: 9000, // Giá bán sỉ 9,000đ/lon
    wholesaleDiscount: 10, // Giảm 10% từ giá lẻ
    wholesaleMargin: 1000,
    unitId: 'unit-4',
    unitName: 'Lon',
    currency: 'VND',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    productId: 'prod-pepsi',
    productName: 'Pepsi',
    importPrice: 7500,
    retailPrice: 10000,
    retailMargin: 2500,
    retailMarkup: 33.33,
    wholesalePrice: 9000,
    wholesaleDiscount: 10,
    wholesaleMargin: 1500,
    unitId: 'unit-5',
    unitName: 'Chai',
    currency: 'VND',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    productId: 'prod-rice',
    productName: 'Gạo ST25',
    importPrice: 25000, // 25,000đ/kg
    retailPrice: 35000, // 35,000đ/kg
    retailMargin: 10000,
    retailMarkup: 40,
    wholesalePrice: 32000, // 32,000đ/kg
    wholesaleDiscount: 8.57,
    wholesaleMargin: 7000,
    unitId: 'unit-9',
    unitName: 'Kg',
    currency: 'VND',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    productId: 'prod-snack',
    productName: 'Snack Oishi',
    importPrice: 3000,
    retailPrice: 5000,
    retailMargin: 2000,
    retailMarkup: 66.67,
    wholesalePrice: 4500,
    wholesaleDiscount: 10,
    wholesaleMargin: 1500,
    unitId: 'unit-13',
    unitName: 'Gói',
    currency: 'VND',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    productId: 'prod-coffee',
    productName: 'Cà phê Trung Nguyên',
    importPrice: 45000,
    retailPrice: 65000,
    retailMargin: 20000,
    retailMarkup: 44.44,
    wholesalePrice: 58000,
    wholesaleDiscount: 10.77,
    wholesaleMargin: 13000,
    unitId: 'unit-13',
    unitName: 'Gói',
    currency: 'VND',
    updatedAt: '2024-01-15T10:00:00Z',
  },
]

// Sample inventory values (with stock quantities)
export const inventoryValues: InventoryValue[] = [
  {
    productId: 'prod-coca',
    productName: 'Coca Cola',
    stockQuantity: 500, // 500 lon
    unitName: 'Lon',
    importPrice: 8000,
    retailPrice: 10000,
    wholesalePrice: 9000,
    totalImportValue: 4000000, // 500 × 8,000 = 4,000,000đ
    totalRetailValue: 5000000, // 500 × 10,000 = 5,000,000đ
    totalWholesaleValue: 4500000, // 500 × 9,000 = 4,500,000đ
    potentialRetailProfit: 1000000, // 5,000,000 - 4,000,000
    potentialWholesaleProfit: 500000, // 4,500,000 - 4,000,000
    retailMarginPercent: 25,
    wholesaleMarginPercent: 12.5,
  },
  {
    productId: 'prod-pepsi',
    productName: 'Pepsi',
    stockQuantity: 300,
    unitName: 'Chai',
    importPrice: 7500,
    retailPrice: 10000,
    wholesalePrice: 9000,
    totalImportValue: 2250000,
    totalRetailValue: 3000000,
    totalWholesaleValue: 2700000,
    potentialRetailProfit: 750000,
    potentialWholesaleProfit: 450000,
    retailMarginPercent: 33.33,
    wholesaleMarginPercent: 20,
  },
  {
    productId: 'prod-rice',
    productName: 'Gạo ST25',
    stockQuantity: 200, // 200 kg
    unitName: 'Kg',
    importPrice: 25000,
    retailPrice: 35000,
    wholesalePrice: 32000,
    totalImportValue: 5000000,
    totalRetailValue: 7000000,
    totalWholesaleValue: 6400000,
    potentialRetailProfit: 2000000,
    potentialWholesaleProfit: 1400000,
    retailMarginPercent: 40,
    wholesaleMarginPercent: 28,
  },
  {
    productId: 'prod-snack',
    productName: 'Snack Oishi',
    stockQuantity: 1000,
    unitName: 'Gói',
    importPrice: 3000,
    retailPrice: 5000,
    wholesalePrice: 4500,
    totalImportValue: 3000000,
    totalRetailValue: 5000000,
    totalWholesaleValue: 4500000,
    potentialRetailProfit: 2000000,
    potentialWholesaleProfit: 1500000,
    retailMarginPercent: 66.67,
    wholesaleMarginPercent: 50,
  },
  {
    productId: 'prod-coffee',
    productName: 'Cà phê Trung Nguyên',
    stockQuantity: 150,
    unitName: 'Gói',
    importPrice: 45000,
    retailPrice: 65000,
    wholesalePrice: 58000,
    totalImportValue: 6750000,
    totalRetailValue: 9750000,
    totalWholesaleValue: 8700000,
    potentialRetailProfit: 3000000,
    potentialWholesaleProfit: 1950000,
    retailMarginPercent: 44.44,
    wholesaleMarginPercent: 28.89,
  },
]

// Calculate inventory summary
export const getInventorySummary = () => {
  const totalProducts = inventoryValues.length
  const totalStockQuantity = inventoryValues.reduce((sum, inv) => sum + inv.stockQuantity, 0)
  const totalImportValue = inventoryValues.reduce((sum, inv) => sum + inv.totalImportValue, 0)
  const totalRetailValue = inventoryValues.reduce((sum, inv) => sum + inv.totalRetailValue, 0)
  const totalWholesaleValue = inventoryValues.reduce((sum, inv) => sum + inv.totalWholesaleValue, 0)
  const totalPotentialRetailProfit = inventoryValues.reduce((sum, inv) => sum + inv.potentialRetailProfit, 0)
  const totalPotentialWholesaleProfit = inventoryValues.reduce((sum, inv) => sum + inv.potentialWholesaleProfit, 0)
  
  const averageRetailMarginPercent = 
    inventoryValues.reduce((sum, inv) => sum + inv.retailMarginPercent, 0) / totalProducts
  const averageWholesaleMarginPercent = 
    inventoryValues.reduce((sum, inv) => sum + inv.wholesaleMarginPercent, 0) / totalProducts

  return {
    totalProducts,
    totalStockQuantity,
    totalImportValue,
    totalRetailValue,
    totalWholesaleValue,
    totalPotentialRetailProfit,
    totalPotentialWholesaleProfit,
    averageRetailMarginPercent: Math.round(averageRetailMarginPercent * 100) / 100,
    averageWholesaleMarginPercent: Math.round(averageWholesaleMarginPercent * 100) / 100,
  }
}
