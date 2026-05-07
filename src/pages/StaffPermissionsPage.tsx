import { useState, useEffect } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { staffService } from '../services/staffService'
import type { Staff, StaffRole, Permission, RoleItem, RolePermissions } from '../types/staff'

// ── Role badge config ────────────────────────────────────────────────────────

const roleBadgeClass: Record<StaffRole, string> = {
  Admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Bán hàng': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Thủ kho': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Kế toán': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

// ── Checkbox cell ────────────────────────────────────────────────────────────

const PermCheckbox = ({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-600 cursor-pointer"
  />
)

// ── Add Staff Modal ──────────────────────────────────────────────────────────

const AddStaffModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Thêm nhân viên mới</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="space-y-4">
        {[
          { id: 'name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A' },
          { id: 'phone', label: 'Số điện thoại', placeholder: '09xx xxx xxx' },
          { id: 'email', label: 'Email đăng nhập', placeholder: 'nhanvien@shop.vn' },
        ].map((f) => (
          <div key={f.id}>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{f.label}</label>
            <input
              type="text"
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Vai trò</label>
          <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>Admin</option>
            <option>Bán hàng</option>
            <option>Thủ kho</option>
            <option>Kế toán</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          Hủy
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          Thêm nhân viên
        </button>
      </div>
    </div>
  </div>
)

// ── Tab 1: Staff List ────────────────────────────────────────────────────────

const StaffListTab = ({ onAdd }: { onAdd: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'all'>('all')
  const [staffList, setStaffList] = useState<Staff[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await staffService.getAll()
        setStaffList(data)
      } catch (err) {
        console.error('Failed to load staff:', err)
      }
    }
    load()
  }, [])

  const filteredStaff = staffList.filter((s: Staff) => {
    const matchSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.phone.includes(searchTerm)
    const matchRole = roleFilter === 'all' || s.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Danh sách nhân viên</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý thông tin tài khoản và phân quyền chức năng cho đội ngũ.</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm nhân viên
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 h-10 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            placeholder="Tìm theo tên hoặc số điện thoại..."
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as StaffRole | 'all')}
          className="h-10 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
        >
          <option value="all">Tất cả vai trò</option>
          {(['Admin', 'Bán hàng', 'Kho', 'Kế toán'] as StaffRole[]).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
              <tr>
                {['Họ và tên', 'Số điện thoại', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map((col, i) => (
                  <th
                    key={col}
                    className={`px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ${i === 5 ? 'text-right' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">Không tìm thấy nhân viên nào.</td>
                </tr>
              ) : filteredStaff.map((s: Staff) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-9 rounded-full ${s.avatarColor} flex items-center justify-center font-black text-xs uppercase shrink-0`}>
                        {s.initials}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{s.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${roleBadgeClass[s.role]}`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${s.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      <span className="size-2 rounded-full bg-current shrink-0"></span>
                      {s.status === 'active' ? 'Đang làm việc' : 'Đã nghỉ'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{s.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary/70 text-sm font-bold transition-colors">
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Tab 2: Role & Permissions ────────────────────────────────────────────────

const RolePermissionsTab = () => {
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [allRolePermissions, setAllRolePermissions] = useState<RolePermissions[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const { roles: r, rolePermissions: rp } = await staffService.getAllRolesWithPermissions()
        setRoles(r)
        setAllRolePermissions(rp)
        if (r.length > 0) {
          setSelectedRoleId(r[0].id)
          setPermissions(rp[0]?.permissions ?? [])
        }
      } catch (err) {
        console.error('Failed to load roles:', err)
      }
    }
    load()
  }, [])

  const handleRoleSelect = (id: string) => {
    setSelectedRoleId(id)
    const perms = allRolePermissions.find((r) => r.roleId === id)
    setPermissions(perms?.permissions ?? [])
  }

  const updatePerm = (permId: string, field: 'canView' | 'canEdit' | 'isSpecial', value: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === permId ? { ...p, [field]: value } : p))
    )
  }

  const selectedRole = roles.find((r) => r.id === selectedRoleId)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Quản lý vai trò &amp; Phân quyền</h2>
        <p className="text-sm text-slate-500 mt-1">Thiết lập chi tiết quyền hạn truy cập cho từng nhóm vai trò trong hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Role list */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Danh sách vai trò</h3>
            <button className="flex items-center gap-1 text-primary text-xs font-bold hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Thêm mới
            </button>
          </div>
          <div className="p-2 space-y-1">
            {roles.map((role) => {
              const isActive = role.id === selectedRoleId
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] shrink-0">{role.icon}</span>
                    <span className="text-sm font-semibold">{role.name}</span>
                  </div>
                  <span className={`material-symbols-outlined text-[18px] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}>
                    chevron_right
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Permission details */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-primary flex items-center gap-2">
                Chi tiết quyền hạn: {selectedRole?.name.split(' ')[0]}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{selectedRole?.description}</p>
            </div>
            <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all shrink-0">
              Lưu thay đổi
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên quyền hạn</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-28">Xem</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-28">Sửa/Xóa</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-28">Đặc biệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {permissions.map((perm) => (
                  <tr key={perm.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{perm.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{perm.description}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PermCheckbox checked={perm.canView} onChange={(v) => updatePerm(perm.id, 'canView', v)} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <PermCheckbox checked={perm.canEdit} onChange={(v) => updatePerm(perm.id, 'canEdit', v)} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {perm.isSpecial === null ? (
                        <span className="text-slate-300 dark:text-slate-600 text-sm select-none">—</span>
                      ) : (
                        <PermCheckbox checked={perm.isSpecial} onChange={(v) => updatePerm(perm.id, 'isSpecial', v)} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

type TabKey = 'staff' | 'roles'

const StaffPermissionsPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('staff')
  const [showAddModal, setShowAddModal] = useState(false)

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'staff', label: 'Danh sách nhân viên' },
    { key: 'roles', label: 'Quản lý vai trò & Phân quyền' },
  ]

  return (
    <DashboardLayout
      title="Phân quyền & Nhân viên"
      breadcrumb={[{ label: 'Cấu hình' }, { label: 'Phân quyền & Nhân viên' }]}
    >
      <div className="flex flex-col gap-6 w-full pb-12 animate-fade-in">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'staff' ? (
          <StaffListTab onAdd={() => setShowAddModal(true)} />
        ) : (
          <RolePermissionsTab />
        )}
      </div>

      {showAddModal && <AddStaffModal onClose={() => setShowAddModal(false)} />}
    </DashboardLayout>
  )
}

export default StaffPermissionsPage
