export type InventoryStatus = 'stable' | 'low' | 'under_limit'

export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  unit: string
  stockLevel: number
  stockValue: number
  status: InventoryStatus
}
