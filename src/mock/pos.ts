import type { POSProduct } from '../types/posProduct'

export const posCategories = ['Tất cả', 'Đồ uống', 'Thức ăn', 'Combo']

export const posProducts: POSProduct[] = [
  {
    id: 'pos1',
    name: 'Cà phê Muối',
    price: 25000,
    image: '/images/pos/coffee.png',
    stock: 42,
    category: 'Đồ uống',
  },
  {
    id: 'pos2',
    name: 'Trà Đào Cam Sả',
    price: 45000,
    image: '/images/pos/peach_tea.png',
    stock: 15,
    category: 'Đồ uống',
  },
  {
    id: 'pos3',
    name: 'Bánh Mì Bơ Tỏi',
    price: 35000,
    image: '/images/pos/bread.png',
    stock: 8,
    category: 'Thức ăn',
  },
  {
    id: 'pos4',
    name: 'Trà Sữa Matcha',
    price: 40000,
    image: '/images/pos/matcha.png',
    stock: 20,
    category: 'Đồ uống',
  },
  {
    id: 'pos5',
    name: 'Nước Cam Ép',
    price: 30000,
    image: '/images/pos/orange_juice.png',
    stock: 12,
    category: 'Đồ uống',
  },
  {
    id: 'pos6',
    name: 'Bánh Quy Bơ',
    price: 15000,
    image: '/images/pos/cookies.png',
    stock: 50,
    category: 'Thức ăn',
  },
]
