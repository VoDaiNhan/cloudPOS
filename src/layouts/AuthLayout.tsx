import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8 font-display">
      {/* Main card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-[1000px] min-h-[600px] border border-slate-200 dark:border-slate-800">
        {/* Left column - Branding */}
        <div className="md:w-[45%] bg-primary p-8 md:p-12 flex flex-col relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-20" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                <span className="material-symbols-outlined text-white text-2xl">cloud_done</span>
              </div>
              <h1 className="text-white text-2xl font-black tracking-tight uppercase">CloudPOS</h1>
            </div>

            <div className="mt-8">
              <h2 className="text-white text-3xl md:text-4xl font-black leading-tight mb-6 tracking-tighter">
                Giải pháp quản lý bán hàng <span className="opacity-80 italic font-medium">thông minh</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-sm font-medium">
                Tối ưu hóa quy trình vận hành, tăng doanh thu và quản lý kho hàng mọi lúc mọi nơi.
              </p>
            </div>

            <div className="mt-auto space-y-5">
              {[
                'Báo cáo chi tiết theo thời gian thực',
                'Quản lý kho hàng & hàng tồn tự động',
                'Hỗ trợ đa nền tảng và bảo mật tuyệt đối'
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 text-white/90">
                  <div className="size-6 bg-white/10 rounded-full flex items-center justify-center border border-white/5 backdrop-blur-sm shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
                  </div>
                  <span className="text-sm font-bold tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Custom radial overlay to match design feel */}
          <div className="absolute inset-0 bg-linear-to-tr from-primary/30 to-transparent pointer-events-none" />
        </div>

        {/* Right column - Content */}
        <div className="md:w-[55%] bg-white dark:bg-slate-900 p-8 md:p-12 flex flex-col justify-center relative">
          <div className="w-full max-w-[400px] mx-auto z-10">
            <Outlet />
            
            <div className="mt-16 text-center">
              <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase opacity-50">
                © 2026 CLOUDPOS ECOSYSTEM • V4.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
