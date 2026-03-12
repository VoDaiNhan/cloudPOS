import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/landing.css'

const navLinks = [
  { label: 'Tính năng', to: '/#features' },
  { label: 'Bảng giá', to: '/pricing' },
  { label: 'Đối tác', to: '/#partners' },
  { label: 'Liên hệ', to: '/#contact' },
]

const PublicLayout = () => {
  const { pathname } = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [prevPathName, setPrevPathName] = useState(pathname)
  if (pathname !== prevPathName) {
    setIsMobileMenuOpen(false)
    setPrevPathName(pathname)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* ===== HEADER ===== */}
      <header className={`landing-header fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-50">
              <div className="bg-primary p-1.5 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-white text-2xl leading-none">cloud_done</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-primary">CloudPOS</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = link.to === '/pricing' ? pathname === '/pricing' : false
                
                // For hash links, use simple anchor to allow browser native scrolling
                if (link.to.includes('#')) {
                  return (
                    <a
                      key={link.to}
                      href={link.to}
                      className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      {link.label}
                    </a>
                  )
                }

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive ? 'text-primary bg-primary/10' : 'text-slate-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3 z-50">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
              >
                Dùng thử miễn phí
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden z-50 p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full pt-28 px-6 pb-6 overflow-y-auto">
            <nav className="flex flex-col space-y-2 mb-8">
              {navLinks.map((link) => {
                const isActive = link.to === '/pricing' ? pathname === '/pricing' : false
                
                if (link.to.includes('#')) {
                  return (
                    <a
                      key={link.to}
                      href={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-4 text-lg font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100"
                    >
                      {link.label}
                    </a>
                  )
                }

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-4 text-lg font-semibold rounded-xl transition-colors border-b border-slate-100 ${
                      isActive ? 'text-primary bg-primary/5' : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full text-center px-5 py-4 rounded-xl text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="w-full text-center bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20"
              >
                Dùng thử miễn phí
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== PAGE CONTENT ===== */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="bg-primary p-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-white text-xl leading-none">cloud_done</span>
                </div>
                <span className="text-xl font-black tracking-tight text-primary">CloudPOS</span>
              </Link>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Giải pháp quản lý bán hàng toàn diện, thông minh và tiết kiệm hàng đầu Việt Nam.
              </p>
              <div className="flex space-x-3">
                <a className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                  <span className="material-symbols-outlined text-base">social_leaderboard</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                  <span className="material-symbols-outlined text-base">alternate_email</span>
                </a>
                <a className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                  <span className="material-symbols-outlined text-base">smart_display</span>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Sản phẩm</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><Link className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" to="/pos">Tính năng POS</Link></li>
                <li><Link className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" to="/inventory">Quản lý kho</Link></li>
                <li><Link className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" to="/dashboard">Báo cáo doanh thu</Link></li>
                <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">App di động</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Hỗ trợ</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">Hướng dẫn sử dụng</a></li>
                <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">Trung tâm trợ giúp</a></li>
                <li><a className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" href="#">Câu hỏi thường gặp</a></li>
                <li><Link className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform" to="/privacy">Chính sách bảo mật</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Liên hệ</h4>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3 items-start">
                  <div className="bg-primary/10 p-1.5 rounded text-primary mt-0.5">
                    <span className="material-symbols-outlined text-sm leading-none">location_on</span>
                  </div>
                  <span className="leading-relaxed">Toà nhà TechHub, Quận 1, TP. HCM</span>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="bg-primary/10 p-1.5 rounded text-primary">
                    <span className="material-symbols-outlined text-sm leading-none">call</span>
                  </div>
                  <span className="font-medium text-slate-900">1900 1234</span>
                </li>
                <li className="flex gap-3 items-center">
                  <div className="bg-primary/10 p-1.5 rounded text-primary">
                    <span className="material-symbols-outlined text-sm leading-none">mail</span>
                  </div>
                  <span>contact@cloudpos.vn</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 font-medium">© 2024 CloudPOS SaaS. Bảo lưu mọi quyền.</p>
            <div className="flex gap-6 text-sm text-slate-500 font-medium">
              <Link className="hover:text-primary transition-colors" to="/terms">Điều khoản dịch vụ</Link>
              <Link className="hover:text-primary transition-colors" to="/privacy">Chính sách Cookie</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
