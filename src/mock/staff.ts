import type { Staff, RoleItem, RolePermissions } from '../types/staff'

export const mockStaffList: Staff[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    initials: 'NA',
    avatarColor: 'bg-blue-100 text-blue-600',
    phone: '0901 234 567',
    role: 'Admin',
    status: 'active',
    createdAt: '10/05/2023',
  },
  {
    id: '2',
    name: 'Trần Thị Bích',
    initials: 'TB',
    avatarColor: 'bg-emerald-100 text-emerald-600',
    phone: '0912 345 678',
    role: 'Bán hàng',
    status: 'active',
    createdAt: '15/06/2023',
  },
  {
    id: '3',
    name: 'Lê Văn Cường',
    initials: 'LC',
    avatarColor: 'bg-amber-100 text-amber-600',
    phone: '0987 654 321',
    role: 'Thủ kho',
    status: 'inactive',
    createdAt: '01/01/2023',
  },
  {
    id: '4',
    name: 'Phạm Thị Dung',
    initials: 'PD',
    avatarColor: 'bg-rose-100 text-rose-600',
    phone: '0933 111 222',
    role: 'Kế toán',
    status: 'active',
    createdAt: '20/08/2023',
  },
]

export const mockRoles: RoleItem[] = [
  {
    id: 'admin',
    name: 'Admin (Quản trị)',
    description: 'Quyền truy cập toàn bộ tính năng hệ thống.',
    icon: 'admin_panel_settings',
  },
  {
    id: 'cashier',
    name: 'Bán hàng (Cashier)',
    description: 'Chỉ truy cập tính năng bán hàng và xem báo cáo cơ bản.',
    icon: 'point_of_sale',
  },
  {
    id: 'warehouse',
    name: 'Thủ kho (Warehouse)',
    description: 'Quản lý nhập xuất kho và kiểm kê hàng hoá.',
    icon: 'warehouse',
  },
  {
    id: 'accounting',
    name: 'Kế toán (Accounting)',
    description: 'Truy cập sổ quỹ, công nợ và báo cáo tài chính.',
    icon: 'analytics',
  },
]

const defaultPermissions = (all: boolean) => [
  {
    id: 'report',
    name: 'Quyền xem báo cáo',
    description: 'Cho phép truy cập module báo cáo doanh thu & lợi nhuận',
    canView: all,
    canEdit: all,
    isSpecial: null,
  },
  {
    id: 'import',
    name: 'Quyền nhập hàng',
    description: 'Tạo và quản lý các phiếu nhập kho từ nhà cung cấp',
    canView: all,
    canEdit: all,
    isSpecial: all,
  },
  {
    id: 'cancel_order',
    name: 'Quyền hủy đơn hàng',
    description: 'Thực hiện thao tác hủy đơn đã thanh toán hoặc đang treo',
    canView: all,
    canEdit: all,
    isSpecial: null,
  },
  {
    id: 'edit_price',
    name: 'Quyền sửa giá sản phẩm',
    description: 'Thay đổi giá bán niêm yết của sản phẩm trên hệ thống',
    canView: all,
    canEdit: all,
    isSpecial: all,
  },
  {
    id: 'manage_staff',
    name: 'Quyền quản lý nhân viên',
    description: 'Thêm, sửa, xóa tài khoản và phân quyền nhân viên',
    canView: all,
    canEdit: all,
    isSpecial: null,
  },
]

export const mockRolePermissions: RolePermissions[] = [
  { roleId: 'admin', permissions: defaultPermissions(true) },
  {
    roleId: 'cashier',
    permissions: [
      { id: 'report', name: 'Quyền xem báo cáo', description: 'Cho phép truy cập module báo cáo doanh thu & lợi nhuận', canView: true, canEdit: false, isSpecial: null },
      { id: 'import', name: 'Quyền nhập hàng', description: 'Tạo và quản lý các phiếu nhập kho từ nhà cung cấp', canView: false, canEdit: false, isSpecial: false },
      { id: 'cancel_order', name: 'Quyền hủy đơn hàng', description: 'Thực hiện thao tác hủy đơn đã thanh toán hoặc đang treo', canView: true, canEdit: false, isSpecial: null },
      { id: 'edit_price', name: 'Quyền sửa giá sản phẩm', description: 'Thay đổi giá bán niêm yết của sản phẩm trên hệ thống', canView: false, canEdit: false, isSpecial: false },
      { id: 'manage_staff', name: 'Quyền quản lý nhân viên', description: 'Thêm, sửa, xóa tài khoản và phân quyền nhân viên', canView: false, canEdit: false, isSpecial: null },
    ],
  },
  {
    roleId: 'warehouse',
    permissions: [
      { id: 'report', name: 'Quyền xem báo cáo', description: 'Cho phép truy cập module báo cáo doanh thu & lợi nhuận', canView: true, canEdit: false, isSpecial: null },
      { id: 'import', name: 'Quyền nhập hàng', description: 'Tạo và quản lý các phiếu nhập kho từ nhà cung cấp', canView: true, canEdit: true, isSpecial: false },
      { id: 'cancel_order', name: 'Quyền hủy đơn hàng', description: 'Thực hiện thao tác hủy đơn đã thanh toán hoặc đang treo', canView: false, canEdit: false, isSpecial: null },
      { id: 'edit_price', name: 'Quyền sửa giá sản phẩm', description: 'Thay đổi giá bán niêm yết của sản phẩm trên hệ thống', canView: true, canEdit: false, isSpecial: false },
      { id: 'manage_staff', name: 'Quyền quản lý nhân viên', description: 'Thêm, sửa, xóa tài khoản và phân quyền nhân viên', canView: false, canEdit: false, isSpecial: null },
    ],
  },
  {
    roleId: 'accounting',
    permissions: [
      { id: 'report', name: 'Quyền xem báo cáo', description: 'Cho phép truy cập module báo cáo doanh thu & lợi nhuận', canView: true, canEdit: true, isSpecial: null },
      { id: 'import', name: 'Quyền nhập hàng', description: 'Tạo và quản lý các phiếu nhập kho từ nhà cung cấp', canView: false, canEdit: false, isSpecial: false },
      { id: 'cancel_order', name: 'Quyền hủy đơn hàng', description: 'Thực hiện thao tác hủy đơn đã thanh toán hoặc đang treo', canView: true, canEdit: false, isSpecial: null },
      { id: 'edit_price', name: 'Quyền sửa giá sản phẩm', description: 'Thay đổi giá bán niêm yết của sản phẩm trên hệ thống', canView: false, canEdit: false, isSpecial: false },
      { id: 'manage_staff', name: 'Quyền quản lý nhân viên', description: 'Thêm, sửa, xóa tài khoản và phân quyền nhân viên', canView: false, canEdit: false, isSpecial: null },
    ],
  },
]
