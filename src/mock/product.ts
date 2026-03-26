import type { Product } from '../types/product'
import { posProducts } from './pos'

export const mockProducts: Product[] = posProducts.map((item, index) => {
  const numberPart = String(index + 1).padStart(3, '0')
  const price = Math.max(item.price, 0)

  return {
    id: String(index + 1),
    code: `SP${numberPart}`,
    name: item.name,
    barcode: `89300123${String(45670 + index).padStart(4, '0')}`,
    categoryName: item.category,
    price,
    costPrice: Math.round(price * 0.6),
    stock: item.stockInBaseUnit,
    status: item.stockInBaseUnit > 0 ? 'active' : 'inactive',
    image: item.image,
    baseUnit: item.baseUnit,
    conversions: item.importConversion
      ? [
          {
            id: `conv-${numberPart}`,
            unitName: item.importConversion.importUnit,
            value: item.importConversion.baseUnits,
          },
        ]
      : [],
    tax: 0,
  }
})
