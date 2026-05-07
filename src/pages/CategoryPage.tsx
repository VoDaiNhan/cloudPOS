import { useState, useMemo, useEffect } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Table } from '../components/Table'
import type { Column } from '../components/Table'
import { Button } from '../components/Button'
import { categoryService } from '../services/categoryService'
import type { Category } from '../types/category'

const StatCard = ({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string
  value: string | number
  icon: string
  color: string
  bgColor: string
}) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
    <div className={`size-14 rounded-2xl ${bgColor} flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
      <span className="material-symbols-outlined text-3xl font-bold">{icon}</span>
    </div>
    <div className="flex flex-col gap-0.5">
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
)

const CategoryPage = () => {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const categories = await categoryService.getAll()
        setData(categories)
      } catch (err) {
        console.error('Failed to load categories:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  const columns: Column<Category>[] = [
    {
      title: 'Mã nhóm',
      key: 'code',
      dataIndex: 'code',
      render: (value) => <span className="font-bold text-primary tracking-tight">{String(value)}</span>,
    },
    {
      title: 'Tên nhóm hàng',
      key: 'name',
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <div className={`size-10 rounded-xl ${record.iconBg} ${record.iconColor} flex items-center justify-center shadow-sm`}>
            <span className="material-symbols-outlined text-xl">{record.icon}</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">{record.name}</span>
        </div>
      ),
    },
    {
      title: 'Số lượng SKU',
      key: 'skuCount',
      dataIndex: 'skuCount',
      render: (value) => <span className="font-bold bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">{String(value)} sản phẩm</span>,
    },
    {
      title: 'Mô tả',
      key: 'description',
      dataIndex: 'description',
      render: (value) => <span className="text-slate-500 font-medium italic truncate max-w-[300px] block">{String(value)}</span>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      render: () => (
        <div className="flex justify-end gap-1.5 pr-2">
          <button className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
          <button className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <DashboardLayout
      title="Danh mục hàng hóa"
      breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Danh mục nhóm hàng' }]}
    >
      <div className="flex flex-col gap-8">
        {/* Header with Title & Action */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex flex-col gap-1.5">
             <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase whitespace-nowrap">DANH MỤC HÀNG HÓA</h3>
             <p className="text-slate-500 font-bold text-sm tracking-wide">Quản lý và phân loại các nhóm hàng trong hệ thống CloudPOS</p>
           </div>
           <Button className="h-[52px] px-8 rounded-2xl shadow-xl shadow-primary/20" icon="add">Thêm nhóm hàng</Button>
         </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Tổng sản phẩm"
            value={loading ? '...' : data.reduce((sum, c) => sum + c.skuCount, 0).toLocaleString()}
            icon="inventory_2"
            color="text-blue-600"
            bgColor="bg-blue-50/80 dark:bg-blue-900/10"
          />
          <StatCard
            label="Số nhóm hàng"
            value={loading ? '...' : String(data.length)}
            icon="category"
            color="text-primary"
            bgColor="bg-primary/10"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-5 shadow-sm">
          <div className="flex-1 min-w-[320px] relative group px-2">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all text-xl">search</span>
            <input
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-4 h-12 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold"
              placeholder="Tìm kiếm theo tên hoặc mã nhóm hàng..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 px-2">
            <button className="h-12 px-6 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-sm text-slate-600 dark:text-slate-400 shadow-sm">
              <span className="material-symbols-outlined text-xl">filter_list</span>
              Lọc dữ liệu
            </button>
            <button className="h-12 px-6 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-sm text-slate-600 dark:text-slate-400 shadow-sm">
              <span className="material-symbols-outlined text-xl">download</span>
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="animate-in fade-in duration-700">
           <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={{
              current: 1,
              pageSize: 10,
              total: filteredData.length,
              onChange: (page) => console.log('Page:', page),
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CategoryPage
