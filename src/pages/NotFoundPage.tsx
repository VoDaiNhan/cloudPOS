import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Big 404 */}
        <div className="relative mb-8">
          <div className="text-[160px] font-black text-slate-100 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl">search_off</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-3">Trang không tồn tại</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Địa chỉ bạn truy cập không tồn tại hoặc đã bị xóa.<br />
          Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chính.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Quay lại
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Về Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
