import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputField } from '../components/InputField'
import { Button } from '../components/Button'
import { SetupLayout } from '../layouts/SetupLayout'

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
    <SetupLayout>
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 animate-fade-in">
        <div className="w-full max-w-[480px] flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
            {/* Hero Image Section */}
            <div className="relative h-48 bg-primary/10 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/40 text-7xl">
                  storefront
                </span>
              </div>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop')" }}
              />
            </div>

            {/* Form Section */}
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight font-display">
                  Địa chỉ truy cập cửa hàng
                </h1>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
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
                  className="h-14 font-bold"
                  required
                />

                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  icon="arrow_forward"
                  className="h-14 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  Tiếp tục
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col gap-4 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Bạn gặp khó khăn khi đăng nhập?{' '}
              <a href="#" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
                Liên hệ hỗ trợ
              </a>
            </p>
            <div className="flex items-center justify-center gap-4 text-slate-400">
              <span className="text-xs font-bold uppercase tracking-widest">© 2026 CloudPOS System</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
              <span className="text-xs font-bold tracking-widest uppercase">Tiếng Việt</span>
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  )
}

export default StoreAccessPage
