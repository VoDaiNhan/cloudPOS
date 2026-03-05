import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InputField } from '../components/InputField'
import { Button } from '../components/Button'

const StoreAccessPage = () => {
  const [slug, setSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug) return

    setIsLoading(true)
    // Simulate checking store existence
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    
    // Redirect to login for that specific store
    // In a real app, this might redirect to slug.cloudpos.vn/login
    navigate('/login')
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 text-primary">
          <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <span className="material-symbols-outlined text-2xl">cloud_done</span>
          </div>
          <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">
            CloudPOS
          </h2>
        </Link>
        <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
          <span className="material-symbols-outlined">help</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[480px] flex flex-col gap-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
            {/* Hero Image Section */}
            <div className="relative h-48 bg-primary/10 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/40 text-7xl">
                  storefront
                </span>
              </div>
              {/* Optional: Add the background image from Stitch if available or a placeholder */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop')" }}
              />
            </div>

            {/* Form Section */}
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 text-2xl font-bold tracking-tight">
                  Địa chỉ truy cập cửa hàng
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Nhập mã địa chỉ cửa hàng của bạn để bắt đầu quản lý kinh doanh ngay hôm nay.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <InputField
                  label="Mã cửa hàng (slug)"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ví dụ: my-shop"
                  suffix=".cloudpos.vn"
                  className="h-14"
                  required
                />

                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  icon="arrow_forward"
                  className="h-14 text-base"
                >
                  Tiếp tục
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col gap-4 text-center">
            <p className="text-slate-500 text-sm">
              Bạn gặp khó khăn khi đăng nhập?{' '}
              <a href="#" className="text-primary font-semibold hover:underline underline-offset-4 ml-1">
                Liên hệ hỗ trợ
              </a>
            </p>
            <div className="flex items-center justify-center gap-4 text-slate-400">
              <span className="text-xs">© 2026 CloudPOS System</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-xs">Tiếng Việt</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StoreAccessPage
