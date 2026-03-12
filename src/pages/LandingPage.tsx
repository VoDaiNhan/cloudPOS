import { Link } from 'react-router-dom'
import '../styles/landing.css'

const LandingPage = () => {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left landing-hero-text">
            <div className="landing-badge inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              Nền tảng Cloud POS hàng đầu Việt Nam
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tight text-slate-900">
              Giải pháp quản lý bán hàng <span className="landing-gradient-text">thông minh</span> trên nền tảng Cloud
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0">
              Khám phá công nghệ quản lý hiện đại, giúp bạn vận hành cửa hàng mọi lúc mọi nơi với độ chính xác tuyệt đối và chi phí tối ưu nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                Bắt đầu ngay <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <a
                href="#features"
                className="bg-white border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Xem Demo
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 relative landing-hero-image">
            <div className="landing-hero-glow absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
              <img
                alt="CloudPOS Dashboard"
                className="w-full h-auto"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDgQFyhQipeG7WB8ROTE0_p7dzgqfx_PU1WCKNhR6o6pip6D5fRuHF4xfEd9Qvhpc8umzytA_E5rzcDHqtW7Kpfoc60RGEN0klMOsRSa4eE_fpnFXzyYeUx0SKFUnEcMbDrSpW88VpfdXNBTRwvtthqKL4URsz8rzpD_pum9g1PdRUMmINSNsUitcwt-GoqN6Z3EPj5ZPsBr1k8XG-K-MAfpdjfTNubBO-7U6ITQYeRlit3ngw4pypwBzqpzrxSJ047tEs0Igm9gE"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Tính năng đột phá</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">CloudPOS cung cấp đầy đủ công cụ để bạn tối ưu hóa quy trình vận hành và tăng trưởng doanh thu vượt bậc.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="landing-feature-card p-8 rounded-2xl border border-primary/10 bg-background hover:border-primary">
              <div className="landing-feature-icon w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Bán hàng nhanh</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Giao diện POS tối ưu, hỗ trợ quét mã vạch, thanh toán đa kênh chỉ trong vài giây.</p>
            </div>
            <div className="landing-feature-card p-8 rounded-2xl border border-primary/10 bg-background hover:border-primary">
              <div className="landing-feature-icon w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">inventory_2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Quản lý kho</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Tự động quy đổi đơn vị, cảnh báo tồn kho an toàn và quản lý nhập xuất chi tiết.</p>
            </div>
            <div className="landing-feature-card p-8 rounded-2xl border border-primary/10 bg-background hover:border-primary">
              <div className="landing-feature-icon w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">mic_none</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Voice POS</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Sử dụng giọng nói để tìm kiếm sản phẩm và lên đơn hàng, tiết kiệm thời gian thao tác.</p>
            </div>
            <div className="landing-feature-card p-8 rounded-2xl border border-primary/10 bg-background hover:border-primary">
              <div className="landing-feature-icon w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">query_stats</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Báo cáo real-time</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Theo dõi doanh thu, lợi nhuận và hiệu quả kinh doanh mọi lúc mọi nơi qua di động.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">Giải pháp tối ưu cho mọi mô hình kinh doanh</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Tối ưu chi phí</h4>
                    <p className="text-slate-600">Tiết kiệm chi phí đầu tư hạ tầng phần cứng và nhân sự vận hành hệ thống.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg">public</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Quản lý mọi nơi</h4>
                    <p className="text-slate-600">Truy cập dữ liệu cửa hàng từ bất kỳ thiết bị nào: Laptop, Tablet, Smartphone.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg">security</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">An toàn dữ liệu</h4>
                    <p className="text-slate-600">Hệ thống bảo mật đa tầng, sao lưu dữ liệu tự động hàng ngày trên Cloud.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg h-48 bg-slate-200">
                  <img
                    className="w-full h-full object-cover"
                    alt="Cửa hàng tạp hóa"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQcPx1xdApsx6hM2i3NCeD7JXktKSLggwAj7638rfztxpiCXo_XiUNaRtLBrHLmPBIbwlRoho8Ua4BSNPaMG5csKYAv7M5BJvLobxPg0VUyv2S4p3IphnE9KeuiYDw5NPiO_74v8YTVyQgcE-hgFnVNJaAQotGnGiHS56VpSYSHFuAA0nrmTxhChaZoVsQzLSiseIXaBRrWWKL11YKsfDblC5UGOtQPQXr2W6gDu7TYVIPzrxWhkezf7mvZPDJDfbbaBV3D17PmjA"
                  />
                </div>
                <div className="bg-primary p-6 rounded-2xl text-white landing-stat">
                  <h4 className="text-2xl font-black mb-1">5000+</h4>
                  <p className="text-sm opacity-80">Cửa hàng tin dùng</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                  <span className="material-symbols-outlined text-primary text-4xl mb-4">storefront</span>
                  <h5 className="font-bold">Mọi mô hình</h5>
                  <p className="text-xs text-slate-500 mt-2">Từ tạp hóa đến siêu thị mini</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg h-48 bg-slate-200">
                  <img
                    className="w-full h-full object-cover"
                    alt="Khách hàng thanh toán"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4Rwl07Rbti351k1cL3LAFex5F58AmKooW0roZ3cBWU3Q6SSiwDewau6QH2NXO41unVGsZxxYa_xOZ4Tk6g8rPVNyoWuVfHgL2OWi1T2URsLDXXiMEh7LjMKD-xxXAB1rneJCB9k-gOqWS2By3B0kbH6gXVgbRCOA-PC1mdz2QGn48vbL2N2IWFOKlsi7w50yO_Da49rBEYSNw2c9AvN4NT9cGzMYVAa2jao8tzIaU1r89j-_BJarZ_ofi27o2ODnuL4GZUkrSFJI"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CUSTOMER SEGMENTS ===== */}
      <section className="py-24 bg-primary/5" id="partners">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Dành cho ai?</h2>
            <p className="text-slate-600">CloudPOS được tùy biến để phù hợp hoàn hảo với nhu cầu đặc thù của bạn</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="landing-segment-card bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">local_convenience_store</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Tạp hóa</h3>
              <p className="text-sm text-slate-600">Quản lý hàng ngàn mã hàng, giá bán linh hoạt và công nợ khách hàng.</p>
            </div>
            <div className="landing-segment-card bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">store</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Siêu thị mini</h3>
              <p className="text-sm text-slate-600">Kiểm soát tồn kho chính xác, tích hợp cân điện tử và in tem nhãn.</p>
            </div>
            <div className="landing-segment-card bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">shopping_bag</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Cửa hàng tiện lợi</h3>
              <p className="text-sm text-slate-600">Thanh toán nhanh, quản lý date hàng hóa và các chương trình khuyến mãi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="landing-cta-bg rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10">Sẵn sàng chuyển đổi số ngay hôm nay?</h2>
            <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto relative z-10">
              Gia nhập cộng đồng hơn 5.000 chủ cửa hàng đã thành công cùng CloudPOS. Đăng ký để nhận 15 ngày trải nghiệm đầy đủ tính năng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                to="/register"
                className="bg-white text-primary hover:bg-slate-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:-translate-y-0.5"
              >
                Dùng thử miễn phí
              </Link>
              <a
                href="#contact"
                className="bg-white/10 border border-white/30 backdrop-blur-sm hover:bg-white/20 px-10 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Liên hệ tư vấn
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LandingPage
