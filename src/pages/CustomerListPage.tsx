import { useState, useMemo } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Table } from '../components/Table'
import type { Column } from '../components/Table'
import { Button } from '../components/Button'
import { mockCustomers } from '../mock/customer'
import type { Customer } from '../types/customer'

// Avatar color map
const colorMap: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
}

const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length >= 2) return parts[0][0] + parts[parts.length - 1][0]
  return name.slice(0, 2).toUpperCase()
}

const CustomerListPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return mockCustomers
    const term = searchTerm.toLowerCase()
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(searchTerm) ||
        c.code.toLowerCase().includes(term)
    )
  }, [searchTerm])

  const columns: Column<Customer>[] = [
    {
      key: 'code',
      title: 'Mã KH',
      width: '100px',
      render: (_, customer) => (
        <span className="font-black text-primary tracking-tight text-sm">{customer.code}</span>
      ),
    },
    {
      key: 'name',
      title: 'Tên khách hàng',
      render: (_, customer) => {
        const color = colorMap[customer.avatarColor] || colorMap.indigo
        return (
          <div className="flex items-center gap-3">
            <div className={`size-9 rounded-full ${color.bg} ${color.text} flex items-center justify-center font-black text-xs shrink-0`}>
              {getInitials(customer.name)}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{customer.name}</span>
          </div>
        )
      },
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      render: (_, customer) => <span className="text-sm text-slate-500 font-medium">{customer.phone}</span>,
    },
    {
      key: 'address',
      title: 'Địa chỉ',
      render: (_, customer) => (
        <span className="text-sm text-slate-400 font-medium truncate max-w-[200px] block">{customer.address}</span>
      ),
    },
    {
      key: 'totalSpent',
      title: 'Tổng chi tiêu',
      align: 'right',
      render: (_, customer) => (
        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
          {customer.totalSpent.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      key: 'lastPurchase',
      title: 'Lần cuối mua',
      render: (_, customer) => <span className="text-sm text-slate-400 font-medium">{customer.lastPurchase}</span>,
    },
    {
      key: 'actions',
      title: 'Thao tác',
      align: 'center',
      render: (_, customer) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedCustomer(customer)
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
        { label: 'Khách hàng' },
        { label: 'Danh sách khách hàng' },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              Quản lý Khách hàng
            </h2>
            <p className="text-sm text-slate-500 font-bold opacity-70">Theo dõi và quản lý thông tin khách hàng</p>
          </div>
          <Button
            icon="add"
            className="shadow-lg shadow-primary/20 h-12 px-6 rounded-2xl text-sm font-black uppercase tracking-widest"
          >
            Thêm khách hàng
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-slate-950 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="relative flex-1 min-w-[300px] h-12 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all text-xl">search</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
              className="w-full h-full pl-12 pr-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 h-12 px-5 bg-white dark:bg-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all group">
              <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">filter_list</span>
              <span>Bộ lọc</span>
            </button>
            <button className="flex items-center gap-2 h-12 px-5 bg-white dark:bg-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-500 transition-all group">
              <span className="material-symbols-outlined text-lg group-hover:-translate-y-0.5 transition-transform">download</span>
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredCustomers}
            rowKey="id"
            onRowClick={(customer) => setSelectedCustomer(customer)}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: filteredCustomers.length,
              onChange: setCurrentPage,
            }}
          />
        </div>
      </div>

      {/* Detail Slide-over Panel */}
      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </DashboardLayout>
  )
}

// ── Detail Panel ──────────────────────────────────────────────

const CustomerDetailPanel = ({
  customer,
  onClose,
}: {
  customer: Customer
  onClose: () => void
}) => {
  const color = colorMap[customer.avatarColor] || colorMap.indigo

  const statusMap = {
    paid: { label: 'Thanh toán', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    partial: { label: 'Nợ (Một phần)', cls: 'bg-amber-50 text-amber-600 border-amber-100' },
    unpaid: { label: 'Chưa thanh toán', cls: 'bg-rose-50 text-rose-600 border-rose-100' },
  }

  return (
    <div className="fixed inset-0 z-100 flex items-stretch justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-slide-in-right z-10">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Chi tiết khách hàng</h3>
          <button
            onClick={onClose}
            className="size-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all text-slate-400 hover:text-slate-900"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex items-start gap-6">
            <div className={`size-24 rounded-3xl ${color.bg} ${color.text} flex items-center justify-center text-3xl font-black shrink-0 shadow-sm`}>
              {getInitials(customer.name)}
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{customer.name}</h4>
              <div className="flex gap-2">
                {customer.memberType === 'vip' && (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                    Thành viên VIP
                  </span>
                )}
                <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border flex items-center gap-1 ${
                  customer.status === 'active'
                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                    : 'bg-slate-50 text-slate-500 border-slate-100'
                }`}>
                  {customer.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tổng chi tiêu</p>
              <p className="text-2xl font-black text-primary tracking-tight">{customer.totalSpent.toLocaleString('vi-VN')} đ</p>
            </div>
            <div className="p-5 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Công nợ hiện tại</p>
              <p className={`text-2xl font-black tracking-tight ${customer.debt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {customer.debt.toLocaleString('vi-VN')} đ
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-5">
            <h5 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Thông tin cá nhân
            </h5>
            <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-sm">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Mã khách hàng</p>
                <p className="font-bold text-slate-900 dark:text-white">{customer.code}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Số điện thoại</p>
                <p className="font-bold text-slate-900 dark:text-white">{customer.phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Email</p>
                <p className="font-bold text-slate-900 dark:text-white">{customer.email || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Ngày sinh</p>
                <p className="font-bold text-slate-900 dark:text-white">{customer.birthday || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Địa chỉ</p>
                <p className="font-bold text-slate-900 dark:text-white">{customer.address}</p>
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h5 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Lịch sử mua hàng</h5>
              <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-3">
              {customer.purchases?.map((p) => {
                const status = statusMap[p.paymentStatus]
                return (
                  <div
                    key={p.id}
                    className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-11 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                        <span className="material-symbols-outlined text-slate-400 text-xl">receipt</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{p.code}</p>
                        <p className="text-[11px] text-slate-400 font-bold">{p.date} • {p.itemCount} sản phẩm</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1.5">
                      <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{p.total.toLocaleString('vi-VN')} đ</p>
                      <span className={`inline-block text-[9px] px-2 py-1 font-black uppercase tracking-widest rounded-full border ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                )
              })}
              {(!customer.purchases || customer.purchases.length === 0) && (
                <p className="text-sm text-slate-400 text-center py-8">Chưa có lịch sử mua hàng</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3 shrink-0 bg-white dark:bg-slate-950">
          <button className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            Sửa thông tin
          </button>
          <button
            onClick={onClose}
            className="px-8 border border-slate-200 dark:border-slate-800 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerListPage
