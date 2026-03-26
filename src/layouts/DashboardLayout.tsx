import { useState, useRef, useEffect, useCallback, type ReactNode, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { mockUser } from '../mock/auth'
import { MODAL_ROUTES } from '../router/modalRoutes'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  breadcrumb?: { label: string; path?: string }[]
}

const NavLink = ({
  to,
  icon,
  label,
  active,
  collapsed,
}: {
  to: string
  icon: string
  label: string
  active: boolean
  collapsed: boolean
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isModal = MODAL_ROUTES.some((r: string) => to.startsWith(r))

  const className = `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
    active
      ? 'bg-primary text-white shadow-lg shadow-primary/20'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
  } ${collapsed ? 'justify-center' : ''}`

  const content = (
    <>
      <span className="material-symbols-outlined text-[22px] shrink-0">{icon}</span>
      {!collapsed && (
        <span className={`text-[14.5px] font-semibold whitespace-nowrap overflow-hidden ${active ? '' : 'group-hover:text-primary transition-colors'}`}>{label}</span>
      )}
    </>
  )

  if (isModal) {
    return (
      <button
        title={collapsed ? label : undefined}
        className={`${className} w-full text-left`}
        onClick={() => navigate(to, { state: { background: location } })}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      className={className}
    >
      {content}
    </Link>
  )
}

// Persist sidebar state across re-mounts (page navigations)
let savedScrollTop = 0
let savedCollapsed = false

export const DashboardLayout = ({
  children,
  title,
  breadcrumb,
}: DashboardLayoutProps) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = mockUser
  const [collapsed, setCollapsed] = useState(savedCollapsed)
  const [globalSearch, setGlobalSearch] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const navRef = useRef<HTMLElement>(null)

  // F2 focuses the global search input
  useEffect(() => {
    const handleF2 = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleF2)
    return () => window.removeEventListener('keydown', handleF2)
  }, [])

  const handleGlobalSearch = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      navigate(`/products?q=${encodeURIComponent(globalSearch.trim())}`)
      setGlobalSearch('')
      searchRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setGlobalSearch('')
      searchRef.current?.blur()
    }
  }

  // Restore scroll position on mount
  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = savedScrollTop
    }
  }, [])

  // Save scroll position on scroll
  const handleNavScroll = useCallback(() => {
    if (navRef.current) {
      savedScrollTop = navRef.current.scrollTop
    }
  }, [])

  // Persist collapsed state
  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      savedCollapsed = !prev
      return !prev
    })
  }, [])

  const menuGroups = [
    {
      title: 'Tổng quan',
      items: [
        { to: '/dashboard', icon: 'dashboard', label: 'Tổng quan' },
      ],
    },
    {
      title: 'Giao dịch',
      items: [
        { to: '/pos', icon: 'point_of_sale', label: 'Bán hàng (POS)' },
        { to: '/open-shift', icon: 'storefront', label: 'Mở ca' },
        { to: '/close-shift', icon: 'logout', label: 'Đóng ca' },
        { to: '/end-shift-report', icon: 'receipt_long', label: 'Báo cáo ca' },
      ],
    },
    {
      title: 'Sổ quỹ',
      items: [
        { to: '/cashbook', icon: 'account_balance_wallet', label: 'Sổ quỹ' },
        { to: '/receipt-voucher', icon: 'request_quote', label: 'Phiếu thu' },
        { to: '/payment-voucher', icon: 'payments', label: 'Phiếu chi' },
        { to: '/debt', icon: 'account_balance', label: 'Công nợ' },
      ],
    },
    {
      title: 'Hàng hóa',
      items: [
        { to: '/products', icon: 'inventory_2', label: 'Sản phẩm' },
        { to: '/categories', icon: 'category', label: 'Danh mục' },
        { to: '/import-order', icon: 'local_shipping', label: 'Nhập kho' },
        { to: '/supplier-return', icon: 'assignment_return', label: 'Trả hàng NCC' },
        { to: '/inventory', icon: 'warehouse', label: 'Tồn kho' },
        { to: '/stock-audit', icon: 'rule_folder', label: 'Kiểm kho' },
        { to: '/stock-cancellation', icon: 'remove_shopping_cart', label: 'Hủy hàng' },
        { to: '/unit-conversions', icon: 'sync_alt', label: 'Quy đổi đơn vị' },
        { to: '/expiry', icon: 'history_toggle_off', label: 'Hạn sử dụng' },
      ],
    },
    {
      title: 'Đối tác',
      items: [
        { to: '/customers', icon: 'person', label: 'Khách hàng' },
        { to: '/customer-return', icon: 'keyboard_return', label: 'Đổi trả KH' },
        { to: '/suppliers', icon: 'local_shipping', label: 'Nhà cung cấp' },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        { to: '/settings', icon: 'settings', label: 'Cài đặt' },
        { to: '/account', icon: 'manage_accounts', label: 'Tài khoản & Gói' },
        { to: '/staff-permissions', icon: 'group', label: 'Phân quyền nhân viên' },
      ],
    },
  ]

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-[72px]' : 'w-[240px]'} bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 transition-all duration-300 ease-in-out shrink-0`}
      >
        <div className={`${collapsed ? 'p-3 flex justify-center' : 'p-6'} transition-all duration-300`}>
          <Link to="/" className="flex items-center gap-3 text-primary">
            <div className="size-9 flex items-center justify-center bg-primary rounded-xl text-white shadow-md shrink-0">
              <span className="material-symbols-outlined text-2xl font-bold">cloud_done</span>
            </div>
            {!collapsed && (
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase whitespace-nowrap overflow-hidden">CloudPOS</h1>
            )}
          </Link>
        </div>

        <nav
          ref={navRef}
          onScroll={handleNavScroll}
          className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} py-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide transition-all duration-300`}
        >
          {!collapsed && (
            <div className="px-3 mb-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">QUẢN LÝ CỬA HÀNG</h3>
            </div>
          )}
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className={`${groupIdx > 0 ? 'mt-4' : ''}`}>
              {!collapsed && (
                <div className="px-4 mb-2">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{group.title}</h4>
                </div>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={pathname.includes(item.to)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className={`${collapsed ? 'px-2' : 'px-4'} py-2 transition-all duration-300`}>
          <button
            onClick={toggleCollapsed}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            <span className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
              chevron_left
            </span>
            {!collapsed && (
              <span className="text-[13px] font-semibold whitespace-nowrap group-hover:text-primary transition-colors">Thu gọn</span>
            )}
          </button>
        </div>
        
        <div className={`${collapsed ? 'p-2' : 'p-4'} mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 transition-all duration-300`}>
          {collapsed ? (
            <div className="flex justify-center">
              <div className="size-10 rounded-full bg-primary/10 border border-primary/5 flex items-center justify-center overflow-hidden shrink-0" title={user.name}>
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md cursor-pointer group">
              <div className="size-10 rounded-full bg-primary/10 border border-primary/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/20 transition-all">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">person</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-[14px] font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide truncate">ADMIN STORE</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/60 dark:bg-slate-900/40 relative overflow-hidden">
        {/* Header Bar */}
        <header className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 px-8 flex items-center justify-between z-40 sticky top-0">
          <div className="flex flex-col gap-0.5">
             <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
               <span>CloudPOS</span>
               {breadcrumb?.map((b, i) => (
                 <div key={i} className="flex items-center gap-2">
                   <span className="material-symbols-outlined text-[14px] opacity-40">chevron_right</span>
                   <span className={i === breadcrumb.length - 1 ? 'text-primary font-semibold' : ''}>{b.label}</span>
                 </div>
               ))}
             </div>
             {title && <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>}
          </div>

           <div className="flex items-center gap-4">
             <div className="relative group">
               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all text-xl">search</span>
               <input
                 ref={searchRef}
                 value={globalSearch}
                 onChange={(e) => setGlobalSearch(e.target.value)}
                 onKeyDown={handleGlobalSearch}
                 className="bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-11 pr-4 h-11 text-sm focus:ring-2 focus:ring-primary/20 transition-all w-80 font-medium"
                 placeholder="Tìm kiếm nhanh sản phẩm (F2)..."
                 type="text"
               />
             </div>
             <div className="flex items-center gap-2 pr-1 ml-2">
                <button className="h-11 w-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="h-11 w-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined">help</span>
                </button>
             </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-8 py-8 scroll-smooth z-10">
          <div className="max-w-[1400px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
