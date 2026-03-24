import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BusinessTimeOption } from '../types/onboarding'

const SALES_CHANNELS = [
  { id: 'pos', label: 'Tại quầy (POS)', description: 'Bán hàng trực tiếp', icon: 'point_of_sale' },
  { id: 'web', label: 'Online Web', description: 'Website bán hàng', icon: 'language' },
  { id: 'social', label: 'Facebook/Zalo', description: 'Mạng xã hội', icon: 'forum' },
]

const STEPS = [
  { icon: 'schedule', label: 'Thời gian' },
  { icon: 'storefront', label: 'Kênh bán' },
  { icon: 'task_alt', label: 'Hoàn tất' },
]

const OnboardingPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [businessTime, setBusinessTime] = useState<BusinessTimeOption>('ALL_DAY')
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['pos'])
  const [sampleGenerated, setSampleGenerated] = useState(false)

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleGenerateSample = () => {
    setSampleGenerated(true)
    alert('Đã khởi tạo dữ liệu mẫu thành công! Bao gồm 5 sản phẩm, 2 đơn hàng và 1 báo cáo.')
  }

  const handleComplete = () => {
    navigate('/choose-workplace')
  }

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-40">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]">cloud_done</span>
          </div>
          <h2 className="text-slate-900 text-xl font-bold tracking-tight">CloudPOS</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center py-10 px-4 md:px-0">
        <div className="flex flex-col max-w-[800px] flex-1">

          {/* Welcome Text */}
          <div className="mb-10 text-center">
            <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight mb-3">
              Chào mừng bạn đến với CloudPOS
            </h1>
            <p className="text-slate-500 text-lg">
              Thiết lập các thông số cơ bản để bắt đầu tối ưu hóa việc kinh doanh của bạn
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Stepper */}
            <div className="flex items-center justify-between bg-slate-50 px-8 py-6 border-b border-slate-200">
              {STEPS.map((step, i) => (
                <div key={i} className="contents">
                  <div className={`flex flex-col items-center gap-2 transition-all ${i <= currentStep ? '' : 'opacity-50'}`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                      i <= currentStep
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {i < currentStep ? (
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                      )}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${i <= currentStep ? 'text-primary' : 'text-slate-500'}`}>
                      Bước {i + 1}
                    </span>
                    <span className={`text-sm font-medium ${i <= currentStep ? 'text-slate-900' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px grow mx-4 transition-colors ${i < currentStep ? 'bg-primary/30' : 'bg-slate-200'}`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="p-8">

              {/* Step 1: Business Time */}
              {currentStep === 0 && (
                <div className="animate-fade-in">
                  <h2 className="text-slate-900 text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black">1</span>
                    Chọn thời gian kinh doanh
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <label
                      className={`relative flex flex-col p-5 cursor-pointer rounded-xl border-2 transition-all ${
                        businessTime === 'ALL_DAY'
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                      }`}
                      onClick={() => setBusinessTime('ALL_DAY')}
                    >
                      <input
                        checked={businessTime === 'ALL_DAY'}
                        className="absolute top-4 right-4 h-5 w-5 text-primary border-slate-300 focus:ring-primary"
                        name="business_time"
                        type="radio"
                        onChange={() => setBusinessTime('ALL_DAY')}
                      />
                      <span className="material-symbols-outlined text-primary text-4xl mb-3">update</span>
                      <span className="text-slate-900 text-lg font-bold">Cả ngày (24/7)</span>
                      <span className="text-slate-500 text-sm mt-1">
                        Phù hợp cho cửa hàng tiện lợi, khách sạn hoặc dịch vụ trực tuyến liên tục.
                      </span>
                    </label>
                    <label
                      className={`relative flex flex-col p-5 cursor-pointer rounded-xl border-2 transition-all ${
                        businessTime === 'FIXED_SHIFT'
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                      }`}
                      onClick={() => setBusinessTime('FIXED_SHIFT')}
                    >
                      <input
                        checked={businessTime === 'FIXED_SHIFT'}
                        className="absolute top-4 right-4 h-5 w-5 text-primary border-slate-300 focus:ring-primary"
                        name="business_time"
                        type="radio"
                        onChange={() => setBusinessTime('FIXED_SHIFT')}
                      />
                      <span className="material-symbols-outlined text-slate-400 text-4xl mb-3">clinical_notes</span>
                      <span className="text-slate-900 text-lg font-bold">Theo ca cố định</span>
                      <span className="text-slate-500 text-sm mt-1">
                        Kinh doanh theo khung giờ hành chính hoặc các ca làm việc cụ thể.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Sales Channels */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-slate-900 text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black">2</span>
                    Chọn kênh bán hàng của bạn
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {SALES_CHANNELS.map(ch => (
                      <label
                        key={ch.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedChannels.includes(ch.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 bg-slate-50 hover:border-primary/40'
                        }`}
                      >
                        <input
                          checked={selectedChannels.includes(ch.id)}
                          className="rounded text-primary focus:ring-primary h-5 w-5"
                          type="checkbox"
                          onChange={() => toggleChannel(ch.id)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{ch.label}</span>
                          <span className="text-xs text-slate-500">{ch.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Info Banner */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-10 flex items-start gap-4">
                    <div className="text-blue-600 mt-1">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-900 font-semibold">Bạn muốn thử nghiệm nhanh?</p>
                      <p className="text-blue-700 text-sm mt-1">
                        Chọn nút bên dưới để tự động tạo 5 sản phẩm mẫu, 2 đơn hàng và 1 báo cáo để bạn có thể trải nghiệm đầy đủ tính năng ngay lập tức.
                      </p>
                      <button
                        onClick={handleGenerateSample}
                        disabled={sampleGenerated}
                        className={`mt-4 flex items-center gap-2 px-5 py-2.5 border rounded-lg font-bold text-sm transition-all shadow-sm ${
                          sampleGenerated
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                            : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {sampleGenerated ? 'check_circle' : 'magic_button'}
                        </span>
                        {sampleGenerated ? 'Đã khởi tạo dữ liệu mẫu' : 'Khởi tạo dữ liệu mẫu'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Complete */}
              {currentStep === 2 && (
                <div className="animate-fade-in text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-6">
                    <span className="material-symbols-outlined text-[40px]">rocket_launch</span>
                  </div>
                  <h2 className="text-slate-900 text-3xl font-black mb-3 tracking-tight">Sẵn sàng kinh doanh!</h2>
                  <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
                    Bạn đã hoàn tất thiết lập cơ bản. Hệ thống CloudPOS đã sẵn sàng phục vụ.
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-6 max-w-sm mx-auto space-y-4 text-left border border-slate-100">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Tóm tắt cấu hình</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Thời gian KD</span>
                      <span className="text-sm font-bold text-slate-900">
                        {businessTime === 'ALL_DAY' ? 'Cả ngày (24/7)' : 'Theo ca cố định'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Kênh bán</span>
                      <span className="text-sm font-bold text-slate-900">
                        {selectedChannels.length} kênh
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Dữ liệu mẫu</span>
                      <span className={`text-sm font-bold ${sampleGenerated ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {sampleGenerated ? 'Đã tạo' : 'Chưa tạo'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                  className={`px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
                >
                  Quay lại
                </button>
                {currentStep < 2 ? (
                  <button
                    onClick={() => setCurrentStep(s => s + 1)}
                    className="px-10 py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    Tiếp theo
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-10 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    Bắt đầu sử dụng
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Bảo mật SSL 256-bit
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              Hỗ trợ 24/7: 1900 1234
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 md:px-40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2024 CloudPOS Ecosystem. Một sản phẩm của TechFlow JSC.</p>
          <div className="flex gap-6">
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Điều khoản dịch vụ</a>
            <a className="text-slate-400 hover:text-primary text-sm transition-colors" href="#">Chính sách bảo mật</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default OnboardingPage

