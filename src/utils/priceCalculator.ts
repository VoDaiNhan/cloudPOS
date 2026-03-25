import type { PriceCalculation, PricingStrategy } from '../types/pricing'

/**
 * Calculate all prices based on import price and strategy
 */
export const calculatePrices = (
  importPrice: number,
  strategy: {
    retailMarkupPercent: number
    wholesaleDiscountPercent: number
  }
): PriceCalculation => {
  // Retail price calculation
  const retailMarkup = importPrice * (strategy.retailMarkupPercent / 100)
  const retailPrice = importPrice + retailMarkup
  const retailMargin = retailPrice - importPrice
  const retailMarginPercent = (retailMargin / importPrice) * 100

  // Wholesale price calculation (discount from retail)
  const wholesaleDiscount = retailPrice * (strategy.wholesaleDiscountPercent / 100)
  const wholesalePrice = retailPrice - wholesaleDiscount
  const wholesaleMarkup = wholesalePrice - importPrice
  const wholesaleMarkupPercent = (wholesaleMarkup / importPrice) * 100
  const wholesaleMargin = wholesalePrice - importPrice
  const wholesaleMarginPercent = (wholesaleMargin / importPrice) * 100

  return {
    importPrice,
    retailPrice: Math.round(retailPrice),
    retailMarkup: Math.round(retailMarkup),
    retailMarkupPercent: strategy.retailMarkupPercent,
    retailMargin: Math.round(retailMargin),
    retailMarginPercent: Math.round(retailMarginPercent * 100) / 100,
    wholesalePrice: Math.round(wholesalePrice),
    wholesaleDiscount: Math.round(wholesaleDiscount),
    wholesaleDiscountPercent: strategy.wholesaleDiscountPercent,
    wholesaleMarkup: Math.round(wholesaleMarkup),
    wholesaleMarkupPercent: Math.round(wholesaleMarkupPercent * 100) / 100,
    wholesaleMargin: Math.round(wholesaleMargin),
    wholesaleMarginPercent: Math.round(wholesaleMarginPercent * 100) / 100,
  }
}

/**
 * Calculate retail price from import price and markup percent
 */
export const calculateRetailPrice = (
  importPrice: number,
  markupPercent: number
): number => {
  return Math.round(importPrice * (1 + markupPercent / 100))
}

/**
 * Calculate wholesale price from retail price and discount percent
 */
export const calculateWholesalePrice = (
  retailPrice: number,
  discountPercent: number
): number => {
  return Math.round(retailPrice * (1 - discountPercent / 100))
}

/**
 * Calculate margin percent
 */
export const calculateMarginPercent = (
  sellingPrice: number,
  importPrice: number
): number => {
  if (importPrice === 0) return 0
  return Math.round(((sellingPrice - importPrice) / importPrice) * 10000) / 100
}

/**
 * Calculate markup percent
 */
export const calculateMarkupPercent = (
  sellingPrice: number,
  importPrice: number
): number => {
  if (importPrice === 0) return 0
  return Math.round(((sellingPrice - importPrice) / importPrice) * 10000) / 100
}

/**
 * Calculate discount percent from retail
 */
export const calculateDiscountPercent = (
  wholesalePrice: number,
  retailPrice: number
): number => {
  if (retailPrice === 0) return 0
  return Math.round(((retailPrice - wholesalePrice) / retailPrice) * 10000) / 100
}

/**
 * Calculate inventory value
 */
export const calculateInventoryValue = (
  quantity: number,
  importPrice: number,
  retailPrice: number,
  wholesalePrice: number
) => {
  const totalImportValue = quantity * importPrice
  const totalRetailValue = quantity * retailPrice
  const totalWholesaleValue = quantity * wholesalePrice

  const potentialRetailProfit = totalRetailValue - totalImportValue
  const potentialWholesaleProfit = totalWholesaleValue - totalImportValue

  const retailMarginPercent = calculateMarginPercent(retailPrice, importPrice)
  const wholesaleMarginPercent = calculateMarginPercent(wholesalePrice, importPrice)

  return {
    totalImportValue: Math.round(totalImportValue),
    totalRetailValue: Math.round(totalRetailValue),
    totalWholesaleValue: Math.round(totalWholesaleValue),
    potentialRetailProfit: Math.round(potentialRetailProfit),
    potentialWholesaleProfit: Math.round(potentialWholesaleProfit),
    retailMarginPercent,
    wholesaleMarginPercent,
  }
}

/**
 * Suggest retail price based on common markup strategies
 */
export const suggestRetailPrice = (importPrice: number): number[] => {
  const markups = [20, 30, 40, 50] // Common markup percentages
  return markups.map((markup) => calculateRetailPrice(importPrice, markup))
}

/**
 * Suggest wholesale price based on common discount strategies
 */
export const suggestWholesalePrice = (retailPrice: number): number[] => {
  const discounts = [5, 8, 10, 15, 20] // Common discount percentages
  return discounts.map((discount) => calculateWholesalePrice(retailPrice, discount))
}

/**
 * Validate prices
 */
export const validatePrices = (
  importPrice: number,
  retailPrice: number,
  wholesalePrice: number
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (importPrice <= 0) {
    errors.push('Giá nhập phải lớn hơn 0')
  }

  if (retailPrice <= 0) {
    errors.push('Giá bán lẻ phải lớn hơn 0')
  }

  if (wholesalePrice <= 0) {
    errors.push('Giá bán sỉ phải lớn hơn 0')
  }

  if (retailPrice < importPrice) {
    errors.push('Giá bán lẻ phải lớn hơn hoặc bằng giá nhập')
  }

  if (wholesalePrice < importPrice) {
    errors.push('Giá bán sỉ phải lớn hơn hoặc bằng giá nhập')
  }

  if (wholesalePrice > retailPrice) {
    errors.push('Giá bán sỉ phải nhỏ hơn hoặc bằng giá bán lẻ')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Format price for display
 */
export const formatPrice = (price: number, currency = 'VND'): string => {
  if (currency === 'VND') {
    return `${price.toLocaleString('vi-VN')}đ`
  }
  return `${currency} ${price.toLocaleString()}`
}

/**
 * Round to nearest thousand (for VND)
 */
export const roundToThousand = (price: number): number => {
  return Math.round(price / 1000) * 1000
}
