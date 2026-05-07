import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Table } from '../components/Table'
import type { Column } from '../components/Table'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { customerService } from '../services/customerService'
import { customerGroupService } from '../services/customerGroupService'
import type { Customer } from '../types/customer'
import type { CustomerGroup } from '../types/customerGroup'

const avatarColors = ['indigo', 'emerald', 'amber', 'rose', 'cyan']

const colorMap: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' },
}

const defaultCustomerForm = {
  id: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  avatarColor: 'indigo',
  customerGroupId: '',
  customDiscountPercent: '',
  usesGroupDefaultDiscount: true,
  status: 'active' as 'active' | 'inactive',
}

const defaultGroupForm = {
  id: '',
  code: '',
  name: '',
  description: '',
  defaultDiscountPercent: '0',
  hiddenCommissionEnabled: false,
  isActive: true,
}

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`

const CustomerListPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [customerForm, setCustomerForm] = useState(defaultCustomerForm)
  const [groupForm, setGroupForm] = useState(defaultGroupForm)
  const [savingCustomer, setSavingCustomer] = useState(false)
  const [savingGroup, setSavingGroup] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [customerData, groupData] = await Promise.all([
        customerService.getAll(),
        customerGroupService.getAll(),
      ])
      setCustomers(customerData)
      setCustomerGroups(groupData)
    } catch (err) {
      console.error('Failed to load customer data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers
    const term = searchTerm.toLowerCase()
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(term) ||
      customer.phone.includes(searchTerm) ||
      customer.code.toLowerCase().includes(term) ||
      (customer.customerGroupName || '').toLowerCase().includes(term)
    )
  }, [customers, searchTerm])

  const totalOutstandingCommissionCustomers = customers.filter((customer) => customer.hiddenCommissionEnabled).length

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      title: 'Khách hàng',
      render: (_, customer) => {
        const color = colorMap[customer.avatarColor] || colorMap.indigo
        return (
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center font-black text-xs shrink-0`}>
              {getInitials(customer.name)}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">{customer.name}</p>
              <p className="text-[11px] font-bold text-slate-400">{customer.code || 'Chưa có mã'}{customer.phone ? ` • ${customer.phone}` : ''}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'group',
      title: 'Nhóm khách',
      render: (_, customer) => (
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{customer.customerGroupName || 'Khách vãng lai'}</p>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
            customer.hiddenCommissionEnabled
              ? 'bg-amber-50 text-amber-600 border border-amber-100'
              : 'bg-slate-100 text-slate-500 border border-slate-200'
          }`}>
            {customer.hiddenCommissionEnabled ? 'Hoa hồng ẩn' : 'Giảm trực tiếp'}
          </span>
        </div>
      ),
    },
    {
      key: 'discount',
      title: 'Chiết khấu hiệu lực',
      align: 'right',
      render: (_, customer) => (
        <div className="text-right">
          <p className="text-sm font-black text-primary">{(customer.effectiveDiscountPercent || 0).toFixed(0)}%</p>
          <p className="text-[11px] font-bold text-slate-400">
            {customer.usesGroupDefaultDiscount ? 'Theo nhóm' : 'Override cá nhân'}
          </p>
        </div>
      ),
    },
    {
      key: 'debt',
      title: 'Công nợ',
      align: 'right',
      render: (_, customer) => (
        <span className={`text-sm font-black ${customer.debt > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
          {formatCurrency(customer.debt)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      align: 'center',
      render: (_, customer) => (
        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
          customer.status === 'active'
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          {customer.status === 'active' ? 'Hoạt động' : 'Ngưng'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      align: 'center',
      render: (_, customer) => (
        <button
          onClick={(event) => {
            event.stopPropagation()
            openEditCustomer(customer)
          }}
          className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Sửa
        </button>
      ),
    },
  ]

  const openCreateCustomer = () => {
    setCustomerForm(defaultCustomerForm)
    setCustomerModalOpen(true)
  }

  const openEditCustomer = (customer: Customer) => {
    setCustomerForm({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address,
      avatarColor: customer.avatarColor,
      customerGroupId: customer.customerGroupId || '',
      customDiscountPercent: customer.customDiscountPercent != null ? String(customer.customDiscountPercent) : '',
      usesGroupDefaultDiscount: customer.usesGroupDefaultDiscount ?? true,
      status: customer.status,
    })
    setCustomerModalOpen(true)
  }

  const openCreateGroup = () => {
    setGroupForm(defaultGroupForm)
  }

  const openEditGroup = (group: CustomerGroup) => {
    setGroupForm({
      id: group.id,
      code: group.code,
      name: group.name,
      description: group.description || '',
      defaultDiscountPercent: String(group.defaultDiscountPercent),
      hiddenCommissionEnabled: group.hiddenCommissionEnabled,
      isActive: group.isActive,
    })
  }

  const handleSaveCustomer = async () => {
    setSavingCustomer(true)
    try {
      const payload = {
        name: customerForm.name,
        phone: customerForm.phone,
        email: customerForm.email,
        address: customerForm.address,
        avatarColor: customerForm.avatarColor,
        customerGroupId: customerForm.customerGroupId || undefined,
        customDiscountPercent: customerForm.usesGroupDefaultDiscount || customerForm.customDiscountPercent === ''
          ? undefined
          : Number(customerForm.customDiscountPercent),
        usesGroupDefaultDiscount: customerForm.usesGroupDefaultDiscount,
        status: customerForm.status,
      }

      if (customerForm.id) {
        await customerService.update(customerForm.id, payload)
      } else {
        await customerService.create(payload)
      }

      setCustomerModalOpen(false)
      setCustomerForm(defaultCustomerForm)
      await loadData()
    } catch (err) {
      console.error('Failed to save customer:', err)
    } finally {
      setSavingCustomer(false)
    }
  }

  const handleSaveGroup = async () => {
    setSavingGroup(true)
    try {
      const payload = {
        code: groupForm.code.trim(),
        name: groupForm.name.trim(),
        description: groupForm.description.trim() || undefined,
        defaultDiscountPercent: Number(groupForm.defaultDiscountPercent) || 0,
        hiddenCommissionEnabled: groupForm.hiddenCommissionEnabled,
        isActive: groupForm.isActive,
      }

      if (groupForm.id) {
        await customerGroupService.update(groupForm.id, payload)
      } else {
        await customerGroupService.create(payload)
      }

      await loadData()
      openCreateGroup()
    } catch (err) {
      console.error('Failed to save group:', err)
    } finally {
      setSavingGroup(false)
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('Xóa nhóm khách hàng này?')) return

    try {
      await customerGroupService.delete(groupId)
      await loadData()
      if (groupForm.id === groupId) openCreateGroup()
    } catch (err) {
      console.error('Failed to delete customer group:', err)
    }
  }

  const selectedGroup = customerGroups.find((group) => group.id === customerForm.customerGroupId)

  return (
    <DashboardLayout breadcrumb={[{ label: 'Đối tác' }, { label: 'Khách hàng' }]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Quản lý Khách hàng</h2>
            <p className="text-sm text-slate-500 font-bold opacity-70">Quản lý nhóm khách, chiết khấu cá nhân và cơ chế hoa hồng ngầm.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => { setGroupModalOpen(true); openCreateGroup() }} className="rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-widest">
              Nhóm khách hàng
            </Button>
            <Button onClick={openCreateCustomer} className="rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-widest" icon="add">
              Thêm khách hàng
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng khách hàng</p>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{customers.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nhóm khách đang dùng</p>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{customerGroups.filter((group) => group.isActive).length}</p>
          </div>
          <div className="rounded-3xl border border-amber-200/60 bg-amber-50/70 p-5 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Khách có hoa hồng ẩn</p>
            <p className="mt-3 text-3xl font-black tracking-tight text-amber-700 dark:text-amber-300">{totalOutstandingCommissionCustomers}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
          <div className="relative h-12 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all text-xl">search</span>
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, mã khách hoặc nhóm khách..."
              className="h-full w-full rounded-2xl bg-slate-50 pl-12 pr-4 text-sm font-bold outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-900"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white p-4 shadow-xl shadow-slate-200/20 dark:border-slate-800/60 dark:bg-slate-950 dark:shadow-none">
          <Table
            columns={columns}
            dataSource={filteredCustomers}
            loading={loading}
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

      {customerModalOpen && (
        <Modal title={customerForm.id ? 'Cập nhật khách hàng' : 'Tạo khách hàng mới'} size="xl" onClose={() => setCustomerModalOpen(false)}>
          <div className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tên khách hàng">
                <input className="input" value={customerForm.name} onChange={(event) => setCustomerForm((prev) => ({ ...prev, name: event.target.value }))} />
              </FormField>
              <FormField label="Số điện thoại">
                <input className="input" value={customerForm.phone} onChange={(event) => setCustomerForm((prev) => ({ ...prev, phone: event.target.value }))} />
              </FormField>
              <FormField label="Email">
                <input className="input" value={customerForm.email} onChange={(event) => setCustomerForm((prev) => ({ ...prev, email: event.target.value }))} />
              </FormField>
              <FormField label="Trạng thái">
                <select className="input" value={customerForm.status} onChange={(event) => setCustomerForm((prev) => ({ ...prev, status: event.target.value as 'active' | 'inactive' }))}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngưng</option>
                </select>
              </FormField>
            </div>

            <FormField label="Địa chỉ">
              <textarea className="input min-h-[96px] py-3" value={customerForm.address} onChange={(event) => setCustomerForm((prev) => ({ ...prev, address: event.target.value }))} />
            </FormField>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Nhóm khách hàng">
                <select className="input" value={customerForm.customerGroupId} onChange={(event) => setCustomerForm((prev) => ({ ...prev, customerGroupId: event.target.value }))}>
                  <option value="">Khách vãng lai / chưa phân nhóm</option>
                  {customerGroups.filter((group) => group.isActive).map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.defaultDiscountPercent}%)
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Màu avatar">
                <select className="input" value={customerForm.avatarColor} onChange={(event) => setCustomerForm((prev) => ({ ...prev, avatarColor: event.target.value }))}>
                  {avatarColors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Chiết khấu cá nhân (%)">
                <input
                  className={`input ${customerForm.usesGroupDefaultDiscount ? 'opacity-50' : ''}`}
                  disabled={customerForm.usesGroupDefaultDiscount}
                  value={customerForm.customDiscountPercent}
                  onChange={(event) => setCustomerForm((prev) => ({ ...prev, customDiscountPercent: event.target.value.replace(/[^\d.]/g, '') }))}
                  placeholder={selectedGroup ? `${selectedGroup.defaultDiscountPercent}` : '0'}
                />
              </FormField>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <input
                type="checkbox"
                checked={customerForm.usesGroupDefaultDiscount}
                onChange={(event) => setCustomerForm((prev) => ({
                  ...prev,
                  usesGroupDefaultDiscount: event.target.checked,
                  customDiscountPercent: event.target.checked ? '' : prev.customDiscountPercent,
                }))}
              />
              Dùng chiết khấu mặc định của nhóm khách
            </label>

            {selectedGroup && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-300">
                Nhóm <span className="font-black">{selectedGroup.name}</span> đang có mức mặc định <span className="font-black">{selectedGroup.defaultDiscountPercent}%</span> và chế độ{' '}
                <span className="font-black">{selectedGroup.hiddenCommissionEnabled ? 'chiết khấu ẩn / hoa hồng' : 'giảm giá trực tiếp trên hóa đơn'}</span>.
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Button variant="secondary" onClick={() => setCustomerModalOpen(false)} className="rounded-2xl px-5 py-3">Đóng</Button>
              <Button onClick={handleSaveCustomer} loading={savingCustomer} className="rounded-2xl px-5 py-3">
                Lưu khách hàng
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {groupModalOpen && (
        <Modal title="Nhóm khách hàng" size="full" onClose={() => setGroupModalOpen(false)}>
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border-r border-slate-100 p-6 dark:border-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Danh sách nhóm khách</h3>
                  <p className="text-sm font-bold text-slate-400">Mỗi nhóm có chính sách chiết khấu mặc định riêng.</p>
                </div>
                <Button variant="outline" onClick={openCreateGroup} className="rounded-2xl px-4 py-2 text-sm">Tạo nhóm mới</Button>
              </div>
              <div className="space-y-3">
                {customerGroups.map((group) => (
                  <div key={group.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{group.name}</p>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{group.code}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                            {group.defaultDiscountPercent}% mặc định
                          </span>
                          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                            group.hiddenCommissionEnabled ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {group.hiddenCommissionEnabled ? 'Hoa hồng ẩn' : 'Hiển thị trên hóa đơn'}
                          </span>
                          <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                            group.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {group.isActive ? 'Đang dùng' : 'Ngưng'}
                          </span>
                        </div>
                        {group.description && <p className="mt-3 text-sm text-slate-500">{group.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditGroup(group)} className="rounded-xl bg-primary/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">Sửa</button>
                        <button onClick={() => handleDeleteGroup(group.id)} className="rounded-xl bg-rose-50 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-500 hover:text-white transition-all">Xóa</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{groupForm.id ? 'Cập nhật nhóm khách' : 'Tạo nhóm khách mới'}</h3>
              <div className="mt-5 space-y-4">
                <FormField label="Mã nhóm">
                  <input className="input" value={groupForm.code} onChange={(event) => setGroupForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))} />
                </FormField>
                <FormField label="Tên nhóm">
                  <input className="input" value={groupForm.name} onChange={(event) => setGroupForm((prev) => ({ ...prev, name: event.target.value }))} />
                </FormField>
                <FormField label="Mô tả">
                  <textarea className="input min-h-[96px] py-3" value={groupForm.description} onChange={(event) => setGroupForm((prev) => ({ ...prev, description: event.target.value }))} />
                </FormField>
                <FormField label="Chiết khấu mặc định (%)">
                  <input className="input" value={groupForm.defaultDiscountPercent} onChange={(event) => setGroupForm((prev) => ({ ...prev, defaultDiscountPercent: event.target.value.replace(/[^\d.]/g, '') }))} />
                </FormField>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <input type="checkbox" checked={groupForm.hiddenCommissionEnabled} onChange={(event) => setGroupForm((prev) => ({ ...prev, hiddenCommissionEnabled: event.target.checked }))} />
                  Kích hoạt cơ chế chiết khấu không in trên hóa đơn, tích lũy thành khoản hoa hồng phải trả
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <input type="checkbox" checked={groupForm.isActive} onChange={(event) => setGroupForm((prev) => ({ ...prev, isActive: event.target.checked }))} />
                  Nhóm khách đang hoạt động
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Button variant="secondary" onClick={openCreateGroup} className="rounded-2xl px-5 py-3">Reset</Button>
                <Button onClick={handleSaveGroup} loading={savingGroup} className="rounded-2xl px-5 py-3">
                  Lưu nhóm khách
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {selectedCustomer && (
        <Modal title="Chi tiết khách hàng" size="lg" onClose={() => setSelectedCustomer(null)}>
          <div className="space-y-5 p-6">
            <div className="rounded-3xl bg-primary/5 p-5">
              <p className="text-xl font-black text-slate-900 dark:text-white">{selectedCustomer.name}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{selectedCustomer.phone || 'Chưa có SĐT'}{selectedCustomer.email ? ` • ${selectedCustomer.email}` : ''}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard label="Nhóm khách" value={selectedCustomer.customerGroupName || 'Khách vãng lai'} />
              <DetailCard label="Chiết khấu hiệu lực" value={`${selectedCustomer.effectiveDiscountPercent || 0}%`} />
              <DetailCard label="Kiểu áp dụng" value={selectedCustomer.hiddenCommissionEnabled ? 'Hoa hồng ẩn' : 'Giảm trực tiếp'} />
              <DetailCard label="Công nợ hiện tại" value={formatCurrency(selectedCustomer.debt)} />
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              <p><span className="font-black">Địa chỉ:</span> {selectedCustomer.address || '—'}</p>
              <p className="mt-2"><span className="font-black">Lần mua cuối:</span> {selectedCustomer.lastPurchase}</p>
              <p className="mt-2"><span className="font-black">Chế độ chiết khấu:</span> {selectedCustomer.usesGroupDefaultDiscount ? 'Theo nhóm khách' : 'Override cá nhân'}</p>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        .input {
          width: 100%;
          height: 3rem;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: rgb(248 250 252);
          padding: 0 1rem;
          font-size: 0.95rem;
          font-weight: 700;
          outline: none;
          transition: all 0.2s ease;
        }
        .input:focus {
          border-color: rgba(28, 67, 166, 0.4);
          box-shadow: 0 0 0 4px rgba(28, 67, 166, 0.08);
          background: white;
        }
      `}</style>
    </DashboardLayout>
  )
}

const FormField = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block space-y-2">
    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{label}</span>
    {children}
  </label>
)

const DetailCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    <p className="mt-3 text-lg font-black text-slate-900 dark:text-white">{value}</p>
  </div>
)

export default CustomerListPage
