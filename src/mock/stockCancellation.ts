import type { StockCancellationItem } from '../types/stockCancellation'

export const initialStockCancellationItems: StockCancellationItem[] = [
  {
    id: '1',
    name: 'Sữa tươi TH True Milk 1L',
    sku: 'TH-MILK-001',
    unit: 'Hộp',
    cancellationQuantity: 12,
    costPrice: 32000,
  },
  {
    id: '2',
    name: 'Trà xanh C2 hương Chanh',
    sku: 'C2-LEMON-05',
    unit: 'Chai',
    cancellationQuantity: 5,
    costPrice: 8500,
  },
]
