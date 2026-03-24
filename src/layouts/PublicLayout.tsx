import { Link, Outlet, useLocation } from 'react-router-dom'
import '../styles/landing.css'

const navLinks = [
  { label: 'Tính năng', to: '/#features' },
  { label: 'Bảng giá', to: '/pricing' },
  { label: 'Đối tác', to: '/#partners' },
  { label: 'Liên hệ', to: '/#contact' },
]

const PublicLayout = () => {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans">
      {/* ===== HEADER ===== */}
      <header className="landing-header sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-white text-2xl">cloud_done</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-primary">CloudPOS</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => {
                const isActive =
                  link.to === '/pricing'
                    ? pathname === '/pricing'
                    : false
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-semibold hover:text-primary transition-colors ${
                      isActive ? 'text-primary' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:flex items-center px-5 py-2.5 rounded-lg text-sm font-bold text-primary hover:bg-primary/10 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20"
              >
                Dùng thử miễn phí
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== PAGE CONTENT ===== */}
      <main>
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-white text-xl">cloud_done</span>
                </div>
                <span className="text-xl font-black tracking-tight text-primary">CloudPOS</span>
              </Link>
              <p className="text-sm text-slate-500 mb-6">
                Giải pháp quản lý bán hàng toàn diện, thông minh và tiết kiệm hàng đầu Việt Nam.
              </p>
              <div className="flex space-x-3">
                <a className="landing-social-icon w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                  <span className="material-symbols-outlined text-base">social_leaderboard</span>
                </a>
                <a className="landing-social-icon w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                  <span className="material-symbols-outlined text-base">alternate_email</span>
                </a>
                <a className="landing-social-icon w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#">
                  <span className="material-symbols-outlined text-base">smart_display</span>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-bold mb-6">Sản phẩm</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link className="hover:text-primary transition-colors" to="/pos">Tính năng POS</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/inventory">Quản lý kho</Link></li>
                <li><Link className="hover:text-primary transition-colors" to="/dashboard">Báo cáo doanh thu</Link></li>
                <li><a className="hover:text-primary transition-colors" href="#">App di động</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold mb-6">Hỗ trợ</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a className="hover:text-primary transition-colors" href="#">Hướng dẫn sử dụng</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Trung tâm trợ giúp</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Câu hỏi thường gặp</a></li>
                <li><Link className="hover:text-primary transition-colors" to="/privacy">Chính sách bảo mật</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-6">Liên hệ</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                  <span>Toà nhà TechHub, Quận 1, TP. HCM</span>
                </li>
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">call</span>
                  <span>1900 1234</span>
                </li>
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">mail</span>
                  <span>contact@cloudpos.vn</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2024 CloudPOS SaaS. Bảo lưu mọi quyền.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link className="hover:text-primary" to="/terms">Điều khoản dịch vụ</Link>
              <Link className="hover:text-primary" to="/privacy">Chính sách Cookie</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
