// Pricing and inventory value types

export type PriceType = 'import' | 'retail' | 'wholesale'

export interface ProductPrice {
  productId: string
  productName: string
  
  // Import price (Giá nhập)
  importPrice: number // Đơn giá nhập
  
  // Retail price (Giá bán lẻ)
  retailPrice: number // Đơn giá bán lẻ
  retailMargin?: number // % lợi nhuận so với giá nhập
  retailMarkup?: number // % đánh giá so với giá nhập
  
  // Wholesale price (Giá bán sỉ)
  wholesalePrice: number // Đơn giá bán sỉ
  wholesaleDiscount?: number // % giảm giá so với giá bán lẻ
  wholesaleMargin?: number // % lợi nhuận so với giá nhập
  
  // Metadata
  unitId: string // Đơn vị tính
  unitName: string
  currency: string // VND, USD, etc.
  updatedAt: string
  updatedBy?: string
}

export interface PriceHistory {
  id: string
  productId: string
  priceType: PriceType
  oldPrice: number
  newPrice: number
  reason?: string
  changedAt: string
  changedBy: string
}

export interface InventoryValue {
  productId: string
  productName: string
  
  // Quantity
  stockQuantity: number // Số lượng tồn kho (đơn vị cơ bản)
  unitName: string
  
  // Pricing
  importPrice: number // Giá nhập
  retailPrice: number // Giá bán lẻ
  wholesalePrice: number // Giá bán sỉ
  
  // Calculated values
  totalImportValue: number // Tổng giá trị nhập = stockQuantity × importPrice
  totalRetailValue: number // Tổng giá trị bán lẻ = stockQuantity × retailPrice
  totalWholesaleValue: number // Tổng giá trị bán sỉ = stockQuantity × wholesalePrice
  
  // Potential profit
  potentialRetailProfit: number // Lợi nhuận tiềm năng nếu bán lẻ hết
  potentialWholesaleProfit: number // Lợi nhuận tiềm năng nếu bán sỉ hết
  
  // Margins
  retailMarginPercent: number // % lợi nhuận bán lẻ
  wholesaleMarginPercent: number // % lợi nhuận bán sỉ
}

export interface PricingStrategy {
  id: string
  name: string
  description: string
  
  // Retail pricing
  retailMarkupPercent: number // % đánh giá lên từ giá nhập (ví dụ: 30%)
  
  // Wholesale pricing
  wholesaleDiscountPercent: number // % giảm giá từ giá bán lẻ (ví dụ: 10%)
  
  // Or direct wholesale markup
  wholesaleMarkupPercent?: number // % đánh giá lên từ giá nhập (ví dụ: 20%)
  
  isDefault: boolean
}

export interface PriceCalculation {
  importPrice: number
  
  // Retail
  retailPrice: number
  retailMarkup: number // Amount added
  retailMarkupPercent: number
  retailMargin: number // Profit amount
  retailMarginPercent: number
  
  // Wholesale
  wholesalePrice: number
  wholesaleDiscount: number // Amount discounted from retail
  wholesaleDiscountPercent: number
  wholesaleMarkup: number // Amount added from import
  wholesaleMarkupPercent: number
  wholesaleMargin: number // Profit amount
  wholesaleMarginPercent: number
}

// Helper type for price input
export interface PriceInput {
  importPrice: number
  retailPrice?: number
  wholesalePrice?: number
  
  // Or use strategy
  strategyId?: string
  
  // Or use percentages
  retailMarkupPercent?: number
  wholesaleDiscountPercent?: number
}

// Inventory summary
export interface InventorySummary {
  totalProducts: number
  totalStockQuantity: number
  
  // Total values
  totalImportValue: number // Tổng giá trị hàng tồn theo giá nhập
  totalRetailValue: number // Tổng giá trị hàng tồn theo giá bán lẻ
  totalWholesaleValue: number // Tổng giá trị hàng tồn theo giá bán sỉ
  
  // Potential profits
  totalPotentialRetailProfit: number
  totalPotentialWholesaleProfit: number
  
  // Average margins
  averageRetailMarginPercent: number
  averageWholesaleMarginPercent: number
}
