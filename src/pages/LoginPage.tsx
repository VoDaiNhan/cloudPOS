import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { InputField } from '../components/InputField'
import { Button } from '../components/Button'
import { authService } from '../services/authService'

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await authService.login({
        phone: formData.phone,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Đăng nhập</h1>
        <p className="text-slate-500">Chào mừng bạn quay trở lại với CloudPOS</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Số điện thoại"
          icon="phone_iphone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="09xx xxx xxx"
          required
        />

        <InputField
          label="Mật khẩu"
          icon="lock"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          required
          endIcon={showPassword ? 'visibility_off' : 'visibility'}
          onEndIconClick={() => setShowPassword(!showPassword)}
        />

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between py-2">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))
              }
              className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/30 transition-all cursor-pointer accent-primary"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors select-none">
              Ghi nhớ đăng nhập
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline transition-all"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit */}
        <Button type="submit" fullWidth loading={isLoading} icon="login">
          Đăng nhập hệ thống
        </Button>
      </form>

      {/* Bottom section */}
      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="text-center space-y-4">
          <p className="text-slate-600">
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline ml-1"
            >
              Đăng ký dùng thử
            </Link>
          </p>
          <p className="text-slate-600">
            Bạn là nhân viên bán hàng?{' '}
            <Link
              to="/store-access"
              className="text-primary font-bold hover:underline ml-1"
            >
              Truy cập bằng mã cửa hàng
            </Link>
          </p>

          {/* Support links */}
          <div className="flex justify-center gap-6 mt-4">
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
              title="Hỗ trợ"
            >
              <span className="material-symbols-outlined">support_agent</span>
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
              title="Zalo"
            >
              <span className="material-symbols-outlined">chat</span>
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-primary transition-colors"
              title="Hotline"
            >
              <span className="material-symbols-outlined">call</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-400">
          © 2026 CloudPOS Ecosystem. Phiên bản 4.0.0
        </p>
      </div>
    </>
  )
}

export default LoginPage
