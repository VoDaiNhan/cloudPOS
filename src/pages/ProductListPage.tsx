import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Table } from '../components/Table'
import type { Column } from '../components/Table'
import { Button } from '../components/Button'
import { mockProducts } from '../mock/product'
import type { Product } from '../types/product'

const ProductListPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading] = useState(false)

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm)
    )
  }, [searchTerm])

  const columns: Column<Product>[] = [
    {
      key: 'stt',
      title: 'STT',
      width: '60px',
      align: 'center',
      render: (_, __, index) => <span className="text-slate-500">{(currentPage - 1) * 10 + index + 1}</span>,
    },
    {
      key: 'name',
      title: 'Sản phẩm',
      render: (_, product) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${product.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'})` }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{product.name}</span>
            <span className="text-xs text-slate-500 font-medium">Mã: {product.code}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'barcode',
      title: 'Barcode',
      render: (_, product) => <span className="text-sm font-mono text-slate-500 dark:text-slate-400 font-medium">{product.barcode}</span>,
    },
    {
      key: 'categoryName',
      title: 'Nhóm hàng',
      render: (_, product) => <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{product.categoryName}</span>,
    },
    {
      key: 'price',
      title: 'Giá bán',
      align: 'right',
      render: (_, product) => <span className="text-sm font-black text-primary tracking-tight">{product.price.toLocaleString('vi-VN')}đ</span>,
    },
    {
      key: 'stock',
      title: 'Tồn kho',
      align: 'right',
      render: (_, product) => (
        <span className={`text-sm font-bold ${product.stock === 0 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
          {product.stock}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      align: 'center',
      render: (_, product) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          product.status === 'active' 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50' 
            : 'bg-slate-50 text-slate-500 border border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50'
        }`}>
          {product.status === 'active' ? 'Đang kinh doanh' : 'Tạm ngưng'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      align: 'right',
      render: (_, product) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/products/${product.id}`)
            }}
            className="size-8 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="size-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout 
      breadcrumb={[
        { label: 'Hàng hóa' },
        { label: 'Danh sách sản phẩm' }
      ]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Danh sách sản phẩm</h2>
            <p className="text-sm text-slate-500 font-bold opacity-70">Quản lý danh mục và tồn kho sản phẩm của bạn</p>
          </div>
          <Button 
            icon="add" 
            className="shadow-lg shadow-primary/20 h-12 px-6 rounded-2xl text-sm font-black uppercase tracking-widest"
            onClick={() => navigate('/products/new')}
          >
            Thêm mới
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-4 shadow-sm backdrop-blur-sm">
          <div className="relative flex-1 min-w-[300px] h-12 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all text-xl">search</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm nhanh sản phẩm (Barcode, Tên, Mã)..."
              className="w-full h-full pl-12 pr-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 h-12 px-5 bg-white dark:bg-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all group">
              <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">filter_list</span>
              <span>Lọc dữ liệu</span>
            </button>
            <button className="flex items-center gap-2 h-12 px-5 bg-white dark:bg-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-500 transition-all group">
              <span className="material-symbols-outlined text-lg group-hover:-translate-y-0.5 transition-transform">download</span>
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
          <Table 
            columns={columns}
            dataSource={filteredProducts}
            loading={isLoading}
            rowKey="id"
            onRowClick={(product) => console.log('View product', product.id)}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: filteredProducts.length,
              onChange: setCurrentPage
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProductListPage
