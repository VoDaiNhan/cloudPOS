export type StaffRole = 'Admin' | 'Bán hàng' | 'Thủ kho' | 'Kế toán'
export type StaffStatus = 'active' | 'inactive'

export interface Staff {
  id: string
  name: string
  initials: string
  avatarColor: string // tailwind bg color class
  phone: string
  role: StaffRole
  status: StaffStatus
  createdAt: string
}

export interface RoleItem {
  id: string
  name: string
  description: string
  icon: string
}

export interface Permission {
  id: string
  name: string
  description: string
  canView: boolean
  canEdit: boolean
  isSpecial: boolean | null // null = N/A
}

export interface RolePermissions {
  roleId: string
  permissions: Permission[]
}
