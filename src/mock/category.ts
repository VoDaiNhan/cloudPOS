import type { Category } from '../types/category'

export const mockCategories: Category[] = [
  {
    id: '1',
    code: 'MG001',
    name: 'Mì gói',
    skuCount: 45,
    description: 'Các loại mì ăn liền nội địa và nhập khẩu',
    icon: 'fastfood',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: '2',
    code: 'SUA002',
    name: 'Sữa',
    skuCount: 120,
    description: 'Sữa tươi, sữa bột, và các chế phẩm từ sữa',
    icon: 'local_drink',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: '3',
    code: 'NGK003',
    name: 'Nước giải khát',
    skuCount: 82,
    description: 'Nước ngọt, nước suối, trà đóng chai',
    icon: 'coffee',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: '4',
    code: 'BIA004',
    name: 'Bia',
    skuCount: 34,
    description: 'Các dòng bia lon, bia chai nội địa và ngoại nhập',
    icon: 'sports_bar',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
]
