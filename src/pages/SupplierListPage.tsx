import { useState, useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Table } from '../components/Table'
import type { Column } from '../components/Table'
import { Button } from '../components/Button'
import { mockSuppliers } from '../mock/supplier'
import type { Supplier } from '../types/supplier'

// Category badge colors
const badgeColors: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
}

const StatCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
    <p className={`text-2xl font-black tracking-tight ${color || 'text-slate-900 dark:text-white'}`}>{value}</p>
  </div>
)

const SupplierListPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return mockSuppliers
    const term = searchTerm.toLowerCase()
    return mockSuppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        s.phone.includes(searchTerm)
    )
  }, [searchTerm])

  // Aggregate stats
  const totalImportValue = mockSuppliers.reduce((acc, s) => acc + s.totalImported, 0)
  const totalDebt = mockSuppliers.reduce((acc, s) => acc + s.debt, 0)

  const columns: Column<Supplier>[] = [
    {
      key: 'code',
      title: 'Mã NCC',
      width: '100px',
      render: (_, supplier) => (
        <span className="font-black text-primary tracking-tight text-sm">{supplier.code}</span>
      ),
    },
    {
      key: 'name',
      title: 'Tên nhà cung cấp',
      render: (_, supplier) => (
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{supplier.name}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">{supplier.address}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      render: (_, supplier) => <span className="text-sm text-slate-500 font-medium">{supplier.phone}</span>,
    },
    {
      key: 'category',
      title: 'Nhóm hàng',
      render: (_, supplier) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badgeColors[supplier.categoryColor] || badgeColors.blue}`}>
          {supplier.category}
        </span>
      ),
    },
    {
      key: 'totalImported',
      title: 'Tổng giá trị nhập',
      align: 'right',
      render: (_, supplier) => (
        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
          {supplier.totalImported.toLocaleString('vi-VN')}đ
        </span>
      ),
    },
    {
      key: 'debt',
      title: 'Công nợ',
      align: 'right',
      render: (_, supplier) => (
        <span className={`text-sm font-black tracking-tight ${supplier.debt > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
          {supplier.debt > 0 ? supplier.debt.toLocaleString('vi-VN') + 'đ' : '0đ'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      align: 'center',
      render: (_, supplier) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedSupplier(selectedSupplier?.id === supplier.id ? null : supplier)
          }}
          className={`size-8 flex items-center justify-center rounded-lg transition-all ${
            selectedSupplier?.id === supplier.id
              ? 'text-primary bg-primary/10'
              : 'text-slate-400 hover:text-primary hover:bg-primary/10'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
        </button>
      ),
    },
  ]

  return (
    <DashboardLayout
      breadcrumb={[
        { label: 'Đối tác' },
        { label: 'Nhà cung cấp' },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Quản lý Nhà cung cấp
            </h2>
            <p className="text-sm text-slate-500 font-bold opacity-70">
              Quản lý thông tin và công nợ với các đối tác cung ứng
            </p>
          </div>
          <Button
            icon="add"
            className="shadow-lg shadow-primary/20 h-12 px-6 rounded-2xl text-sm font-black uppercase tracking-widest"
          >
            Thêm nhà cung cấp
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Tổng nhà cung cấp" value={String(mockSuppliers.length)} />
          <StatCard label="Tổng giá trị nhập (Tháng)" value={totalImportValue.toLocaleString('vi-VN') + 'đ'} color="text-primary" />
          <StatCard label="Tổng công nợ hiện tại" value={totalDebt.toLocaleString('vi-VN') + 'đ'} color="text-rose-500" />
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="relative flex-1 min-w-[300px] h-12 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all text-xl">search</span>
            <input
              type="text"
              placeholder="Tìm kiếm mã, tên hoặc số điện thoại NCC..."
              className="w-full h-full pl-12 pr-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Supplier Table */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredSuppliers}
            rowKey="id"
            onRowClick={(supplier) => setSelectedSupplier(selectedSupplier?.id === supplier.id ? null : supplier)}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: filteredSuppliers.length,
              onChange: setCurrentPage,
            }}
          />
        </div>

        {/* Import History Section (shown when a supplier is selected) */}
        {selectedSupplier && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">history</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Lịch sử phiếu nhập kho:{' '}
                <span className="text-primary">{selectedSupplier.name} ({selectedSupplier.code})</span>
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Mã phiếu</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ngày nhập</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Số lượng</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Thành tiền</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedSupplier.imports?.map((imp) => (
                    <tr key={imp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{imp.code}</td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-medium">{imp.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium max-w-[250px] truncate">{imp.products}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-bold text-right">{imp.quantity}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white text-right tracking-tight">{imp.total.toLocaleString('vi-VN')}đ</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                          imp.status === 'imported'
                            ? 'text-emerald-600'
                            : imp.status === 'pending'
                              ? 'text-amber-600'
                              : 'text-rose-500'
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            imp.status === 'imported'
                              ? 'bg-emerald-500'
                              : imp.status === 'pending'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                          }`} />
                          {imp.status === 'imported' ? 'Đã nhập hàng' : imp.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-5 bg-slate-50/50 dark:bg-slate-800/20 flex justify-center border-t border-slate-100 dark:border-slate-800">
                <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2 group">
                  Xem tất cả lịch sử nhập kho
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default SupplierListPage
