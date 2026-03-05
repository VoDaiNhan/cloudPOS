import type { SupplierReturnProduct } from '../types/supplierReturn'

export const initialSupplierReturnProducts: SupplierReturnProduct[] = [
  {
    id: '1',
    name: 'Khẩu trang N95',
    sku: 'SP001242',
    batchCode: 'A102',
    expiryDate: '15/05/2024',
    currentStock: 120,
    returnQuantity: 20,
    importPrice: 25000,
  },
  {
    id: '2',
    name: 'Nước rửa tay Lifebuoy 500ml',
    sku: 'SP008912',
    batchCode: 'L883',
    expiryDate: '12/10/2025',
    currentStock: 45,
    returnQuantity: 5,
    importPrice: 85000,
  },
]
