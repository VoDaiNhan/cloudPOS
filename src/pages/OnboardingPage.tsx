import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BusinessTimeOption } from '../types/onboarding'
import { SetupLayout } from '../layouts/SetupLayout'

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
    <SetupLayout>
      <div className="flex flex-1 justify-center py-10 px-4 md:px-0 animate-fade-in font-display">
        <div className="flex flex-col max-w-[800px] flex-1">

          {/* Welcome Text */}
          <div className="mb-10 text-center">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight mb-3">
              Chào mừng bạn đến với CloudPOS
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              Thiết lập các thông số cơ bản để bắt đầu tối ưu hóa việc kinh doanh của bạn
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">

            {/* Stepper */}
            <div className="flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-200 dark:border-slate-800">
              {STEPS.map((step, i) => (
                <div key={i} className="contents">
                  <div className={`flex flex-col items-center gap-2 transition-all ${i <= currentStep ? '' : 'opacity-50'}`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                      i <= currentStep
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {i < currentStep ? (
                        <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                      )}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${i <= currentStep ? 'text-primary' : 'text-slate-500'}`}>
                      Bước {i + 1}
                    </span>
                    <span className={`text-sm font-bold ${i <= currentStep ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px grow mx-4 transition-colors ${i < currentStep ? 'bg-primary/30' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="p-8">

              {/* Step 1: Business Time */}
              {currentStep === 0 && (
                <div className="animate-fade-in">
                  <h2 className="text-slate-900 dark:text-white text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black">1</span>
                    Chọn thời gian kinh doanh
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <label
                      className={`relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all ${
                        businessTime === 'ALL_DAY'
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                      onClick={() => setBusinessTime('ALL_DAY')}
                    >
                      <input
                        checked={businessTime === 'ALL_DAY'}
                        className="absolute top-4 right-4 h-5 w-5 text-primary border-slate-300 dark:border-slate-600 focus:ring-primary"
                        name="business_time"
                        type="radio"
                        onChange={() => setBusinessTime('ALL_DAY')}
                      />
                      <span className="material-symbols-outlined text-primary text-4xl mb-3">update</span>
                      <span className="text-slate-900 dark:text-white text-lg font-bold">Cả ngày (24/7)</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                        Phù hợp cho cửa hàng tiện lợi, khách sạn hoặc dịch vụ trực tuyến liên tục.
                      </span>
                    </label>
                    <label
                      className={`relative flex flex-col p-5 cursor-pointer rounded-2xl border-2 transition-all ${
                        businessTime === 'FIXED_SHIFT'
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                      onClick={() => setBusinessTime('FIXED_SHIFT')}
                    >
                      <input
                        checked={businessTime === 'FIXED_SHIFT'}
                        className="absolute top-4 right-4 h-5 w-5 text-primary border-slate-300 dark:border-slate-600 focus:ring-primary"
                        name="business_time"
                        type="radio"
                        onChange={() => setBusinessTime('FIXED_SHIFT')}
                      />
                      <span className="material-symbols-outlined text-slate-400 text-4xl mb-3">clinical_notes</span>
                      <span className="text-slate-900 dark:text-white text-lg font-bold">Theo ca cố định</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                        Kinh doanh theo khung giờ hành chính hoặc các ca làm việc cụ thể.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Sales Channels */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-slate-900 dark:text-white text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-lg font-black">2</span>
                    Chọn kênh bán hàng của bạn
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {SALES_CHANNELS.map(ch => (
                      <label
                        key={ch.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedChannels.includes(ch.id)
                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/40'
                        }`}
                      >
                        <input
                          checked={selectedChannels.includes(ch.id)}
                          className="rounded text-primary focus:ring-primary h-5 w-5 border-slate-300 dark:border-slate-600"
                          type="checkbox"
                          onChange={() => toggleChannel(ch.id)}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{ch.label}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{ch.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Info Banner */}
                  <div className="bg-blue-50 dark:bg-blue-500/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/20 mb-10 flex items-start gap-4">
                    <div className="text-blue-600 dark:text-blue-400 mt-1">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-900 dark:text-blue-300 font-bold">Bạn muốn thử nghiệm nhanh?</p>
                      <p className="text-blue-700 dark:text-blue-400/80 text-sm mt-1 font-medium leading-relaxed">
                        Chọn nút bên dưới để tự động tạo 5 sản phẩm mẫu, 2 đơn hàng và 1 báo cáo để bạn có thể trải nghiệm đầy đủ tính năng ngay lập tức.
                      </p>
                      <button
                        onClick={handleGenerateSample}
                        disabled={sampleGenerated}
                        className={`mt-4 flex items-center gap-2 px-5 py-2.5 border-2 rounded-xl font-bold text-sm transition-all shadow-sm ${
                          sampleGenerated
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 cursor-default'
                            : 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/20'
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
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6">
                    <span className="material-symbols-outlined text-[48px]">rocket_launch</span>
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-3xl font-black mb-3 tracking-tight">Sẵn sàng kinh doanh!</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md mx-auto mb-8 font-medium">
                    Bạn đã hoàn tất thiết lập cơ bản. Hệ thống CloudPOS đã sẵn sàng phục vụ.
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 max-w-sm mx-auto space-y-4 text-left border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Tóm tắt cấu hình</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Thời gian KD</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {businessTime === 'ALL_DAY' ? 'Cả ngày (24/7)' : 'Theo ca cố định'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Kênh bán</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedChannels.length} kênh
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Dữ liệu mẫu</span>
                      <span className={`text-sm font-bold ${sampleGenerated ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {sampleGenerated ? 'Đã tạo' : 'Chưa tạo'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800 mt-8">
                <button
                  onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                  className={`px-6 py-3 text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
                >
                  Quay lại
                </button>
                {currentStep < 2 ? (
                  <button
                    onClick={() => setCurrentStep(s => s + 1)}
                    className="px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    Tiếp theo
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-10 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
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
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Bảo mật SSL 256-bit
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              Hỗ trợ 24/7: 1900 1234
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  )
}

export default OnboardingPage

