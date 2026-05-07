import api from './api'
import type { Staff, StaffRole, RoleItem, Permission, RolePermissions } from '../types/staff'

interface BackendStaff {
  id: string
  name: string
  phone?: string
  initials?: string
  avatarColor?: string
  roleName?: string
  status: string
  createdAt: string
}

interface BackendRole {
  id: string
  name: string
  description?: string
  icon?: string
  permissions: BackendRolePermission[]
}

interface BackendRolePermission {
  permissionId: string
  permissionName?: string
  module?: string
  canView: boolean
  canEdit: boolean
  isSpecial?: boolean | null
}

function mapStaff(s: BackendStaff): Staff {
  const initials = s.initials || s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return {
    id: s.id,
    name: s.name,
    phone: s.phone || '',
    initials,
    avatarColor: s.avatarColor || 'bg-blue-100 text-blue-600',
    role: (s.roleName || 'Bán hàng') as StaffRole,
    status: s.status === 'active' ? 'active' : 'inactive',
    createdAt: new Date(s.createdAt).toLocaleDateString('vi-VN'),
  }
}

function mapRole(r: BackendRole): RoleItem {
  return {
    id: r.id,
    name: r.name,
    description: r.description || '',
    icon: r.icon || 'person',
  }
}

function mapRolePermissions(r: BackendRole): RolePermissions {
  return {
    roleId: r.id,
    permissions: r.permissions.map((p): Permission => ({
      id: p.permissionId,
      name: p.permissionName || '',
      description: p.module || '',
      canView: p.canView,
      canEdit: p.canEdit,
      isSpecial: p.isSpecial ?? null,
    })),
  }
}

export const staffService = {
  getAll: async (): Promise<Staff[]> => {
    const { data } = await api.get('/staff')
    return (data as BackendStaff[]).map(mapStaff)
  },

  getRoles: async (): Promise<RoleItem[]> => {
    const { data } = await api.get('/roles')
    return (data as BackendRole[]).map(mapRole)
  },

  getRolePermissions: async (roleId: string): Promise<RolePermissions> => {
    const { data } = await api.get(`/roles/${roleId}/permissions`)
    return mapRolePermissions(data as BackendRole)
  },

  getAllRolesWithPermissions: async (): Promise<{ roles: RoleItem[]; rolePermissions: RolePermissions[] }> => {
    const { data } = await api.get('/roles')
    const roles = (data as BackendRole[]).map(mapRole)
    const rolePermissions = (data as BackendRole[]).map(mapRolePermissions)
    return { roles, rolePermissions }
  },
}
