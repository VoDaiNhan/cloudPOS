import type { Product } from '../types/product'

export const mockProducts: Product[] = [
  {
    id: '1',
    code: 'SP001',
    name: 'Cà Phê Sữa Đá',
    barcode: '8930012345678',
    categoryName: 'Đồ uống',
    price: 29000,
    stock: 150,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    code: 'SP002',
    name: 'Bánh Mì Pate',
    barcode: '8930012345685',
    categoryName: 'Thức ăn nhanh',
    price: 25000,
    stock: 85,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    code: 'SP003',
    name: 'Trà Đào Cam Sả',
    barcode: '8930012345692',
    categoryName: 'Đồ uống',
    price: 45000,
    stock: 120,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    code: 'SP004',
    name: 'Bánh Su Kem (Hộp 5)',
    barcode: '8930012345708',
    categoryName: 'Tráng miệng',
    price: 55000,
    stock: 0,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop'
  },
  {
    id: '5',
    code: 'SP005',
    name: 'Nước Suối (500ml)',
    barcode: '8930012345715',
    categoryName: 'Đồ uống',
    price: 5000,
    stock: 300,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop'
  }
]
