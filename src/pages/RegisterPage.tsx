import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InputField } from '../components/InputField'
import { SelectField } from '../components/SelectField'
import { OtpInput } from '../components/OtpInput'
import { Button } from '../components/Button'
import { mockRegions } from '../mock/register'
import { authService } from '../services/authService'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    region: '',
  })
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSendOtp = async () => {
    if (!formData.fullName || !formData.phone || !formData.email || !formData.region) {
      setError('Vui lòng điền đầy đủ thông tin.')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      await authService.sendRegisterOtp(formData.email)
      setOtpSent(true)
      setSuccess('Mã OTP đã được gửi đến email ' + formData.email)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi OTP. Vui lòng kiểm tra cấu hình email.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (value: string[]) => {
    setOtp(value)
    setError('')

    const code = value.join('')
    setOtpVerified(code.length === 6)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpVerified || !agreeTerms) return

    setIsLoading(true)
    setError('')
    try {
      await authService.register({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        otpCode: otp.join(''),
        region: formData.region,
      })
      setSuccess('Đăng ký thành công! Đang chuyển hướng...')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = otpVerified && agreeTerms && !isLoading

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* ── Header ── */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 px-6 py-4 bg-white sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">cloud_done</span>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">CloudPOS</h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-slate-500">Bạn đã có tài khoản?</span>
          <Link
            to="/login"
            className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Hero */}
          <div className="hidden lg:flex flex-col gap-8">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                Dùng thử miễn phí 14 ngày
              </span>
              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900">
                Quản lý bán hàng <br />
                <span className="text-primary">thông minh hơn</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-md">
                Gia nhập cùng 10,000+ doanh nghiệp đang tối ưu hóa quy trình vận hành với CloudPOS. Đầy đủ tính năng, dễ dàng sử dụng.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <h4 className="font-bold">Báo cáo thời gian thực</h4>
                  <p className="text-sm text-slate-500">Theo dõi doanh thu mọi lúc, mọi nơi ngay trên điện thoại.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <div>
                  <h4 className="font-bold">Quản lý kho tự động</h4>
                  <p className="text-sm text-slate-500">Cảnh báo tồn kho và quản lý nhập xuất hàng hóa chính xác.</p>
                </div>
              </div>
            </div>

            {/* Hero image placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-primary/5 border border-primary/10">
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/30">
                <div className="text-center text-primary/60">
                  <span className="material-symbols-outlined text-6xl">point_of_sale</span>
                  <p className="text-sm font-medium mt-2">CloudPOS Terminal</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent" />
            </div>
          </div>

          {/* Right — Registration Form */}
          <div className="w-full max-w-[480px] mx-auto lg:mr-0">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Đăng ký dùng thử</h3>
                <p className="text-slate-500 text-sm">
                  Vui lòng điền thông tin để kích hoạt tài khoản trải nghiệm.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                  label="Họ và tên"
                  icon="person"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  required
                />

                <InputField
                  label="Số điện thoại"
                  icon="call"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="090x xxx xxx"
                  required
                />

                <InputField
                  label="Email nhận mã OTP"
                  icon="mail"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@gmail.com"
                  required
                />

                <InputField
                  label="Mật khẩu"
                  icon="lock"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                />

                <SelectField
                  label="Khu vực"
                  icon="location_on"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  options={mockRegions}
                />

                {/* Error / Success messages */}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                  </div>
                )}
                {success && !error && (
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    {success}
                  </div>
                )}

                {/* Send OTP button */}
                <div className="pt-2">
                  <Button
                    type="button"
                    fullWidth
                    loading={isLoading && !otpSent}
                    icon="send"
                    onClick={handleSendOtp}
                    disabled={otpSent}
                  >
                    {otpSent ? 'Đã gửi mã OTP email' : 'Gửi mã OTP qua email'}
                  </Button>
                </div>

                {/* OTP Section */}
                <div className="py-4 border-t border-dashed border-slate-200 mt-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 text-center">
                    Xác nhận mã OTP email (6 chữ số)
                  </label>
                  <OtpInput value={otp} onChange={handleOtpChange} />
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary accent-primary"
                    />
                  </div>
                  <label htmlFor="terms" className="text-sm text-slate-500 leading-tight cursor-pointer">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Điều khoản sử dụng
                    </a>{' '}
                    và{' '}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Chính sách bảo mật
                    </a>{' '}
                    của CloudPOS.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full font-bold py-4 rounded-lg transition-all ${
                    canSubmit
                      ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Hoàn tất đăng ký
                </button>
              </form>
            </div>

            {/* Support */}
            <p className="text-center mt-6 text-sm text-slate-500">
              Cần hỗ trợ?{' '}
              <a
                href="#"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                Gọi hotline 1900 xxxx
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="p-6 text-center text-slate-400 text-xs border-t border-slate-200">
        © 2026 CloudPOS SaaS Solution. All rights reserved.
      </footer>
    </div>
  )
}

export default RegisterPage


