import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SetupLayout } from '../layouts/SetupLayout'

const WorkModeCard = ({
  title,
  description,
  icon,
  actionText,
  onClick,
  shortcut,
}: {
  title: string
  description: string
  icon: string
  actionText: string
  onClick: () => void
  shortcut: string
}) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-primary hover:shadow-xl transition-all duration-300 p-8 relative overflow-hidden"
    >
      <div className="mb-6 size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-slate-900 text-2xl font-bold mb-3">{title}</h3>
        <p className="text-slate-500 text-base leading-relaxed mb-8">
          {description}
        </p>
      </div>
      <button className="w-full py-4 px-6 bg-slate-100 text-slate-900 font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2">
        <span>{actionText}</span>
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
      <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-300 border border-slate-200 rounded px-1.5 py-0.5 group-hover:border-primary/30 group-hover:text-primary/50">
        {shortcut}
      </div>
    </div>
  )
}

const ChooseWorkplacePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') navigate('/dashboard')
      if (e.key === '2') navigate('/pos')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <SetupLayout hideFooter>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 lg:px-20">
        <div className="max-w-[1000px] w-full">
          <div className="text-center mb-16">
            <h1 className="text-slate-900 text-3xl md:text-5xl font-black leading-tight tracking-tight mb-4">
              Chào mừng trở lại!
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Vui lòng chọn chế độ làm việc để tiếp tục. Bạn có thể thay đổi lựa chọn này bất cứ lúc nào trong phần cài đặt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WorkModeCard
              title="Quản lý"
              description="Công cụ toàn diện để quản lý hàng hóa, theo dõi đơn hàng và xem các báo cáo phân tích kinh doanh chuyên sâu."
              icon="bar_chart"
              actionText="Truy cập Dashboard"
              onClick={() => navigate('/dashboard')}
              shortcut="PHÍM 1"
            />
            <WorkModeCard
              title="Bán hàng - POS"
              description="Giao diện được tối ưu hóa cho tốc độ xử lý nhanh, hỗ trợ các thao tác bán hàng tại quầy và in hóa đơn tức thì."
              icon="point_of_sale"
              actionText="Mở màn hình POS"
              onClick={() => navigate('/pos')}
              shortcut="PHÍM 2"
            />
          </div>

          {/* Footer Info */}
          <div className="mt-20 flex flex-col items-center gap-8">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span className="material-symbols-outlined text-base">info</span>
              <span>Mẹo: Bạn có thể sử dụng phím tắt (1) và (2) để chọn nhanh</span>
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  )
}


export default ChooseWorkplacePage
