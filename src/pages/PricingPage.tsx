import { useState } from 'react'
import { Link } from 'react-router-dom'

interface PricingFeature {
  text: string
  bold?: boolean
}

interface PricingPlan {
  name: string
  description: string
  price: string
  priceYearly: string
  period?: string
  features: PricingFeature[]
  cta: string
  ctaLink: string
  highlighted?: boolean
  ctaStyle: 'primary' | 'secondary' | 'dark'
}

interface FaqItem {
  question: string
  answer: string
}

const plans: PricingPlan[] = [
  {
    name: 'Gói Khởi Tạo',
    description: 'Dành cho cửa hàng nhỏ, mới bắt đầu.',
    price: '150.000đ',
    priceYearly: '120.000đ',
    period: '/tháng',
    cta: 'Dùng thử miễn phí',
    ctaLink: '/register',
    ctaStyle: 'secondary',
    features: [
      { text: 'Quản lý 1 cửa hàng' },
      { text: 'Giới hạn số lượng sản phẩm' },
      { text: 'Tính năng POS cơ bản' },
      { text: 'Báo cáo doanh thu tiêu chuẩn' },
    ],
  },
  {
    name: 'Gói Chuyên Nghiệp',
    description: 'Cho doanh nghiệp đang phát triển.',
    price: '350.000đ',
    priceYearly: '280.000đ',
    period: '/tháng',
    cta: 'Đăng ký ngay',
    ctaLink: '/checkout?plan=pro',
    highlighted: true,
    ctaStyle: 'primary',
    features: [
      { text: 'Không giới hạn sản phẩm', bold: true },
      { text: 'Tích hợp Voice POS thông minh' },
      { text: 'Quản lý kho hàng chuyên sâu' },
      { text: 'Phân tích & Báo cáo nâng cao' },
      { text: 'Bán hàng đa kênh (Omnichannel)' },
    ],
  },
  {
    name: 'Gói Doanh Nghiệp',
    description: 'Giải pháp tùy chỉnh cho chuỗi lớn.',
    price: 'Liên hệ',
    priceYearly: 'Liên hệ',
    cta: 'Liên hệ tư vấn',
    ctaLink: '/#contact',
    ctaStyle: 'dark',
    features: [
      { text: 'Quản lý đa cửa hàng/chuỗi' },
      { text: 'Tính năng thiết kế theo yêu cầu' },
      { text: 'Hỗ trợ kỹ thuật 24/7 tận nơi' },
      { text: 'Tích hợp API không giới hạn' },
      { text: 'Hệ thống quản lý nhân sự HRM' },
    ],
  },
]

const faqItems: FaqItem[] = [
  {
    question: 'Tôi có thể thay đổi gói dịch vụ không?',
    answer:
      'Có, bạn hoàn toàn có thể nâng cấp hoặc hạ cấp gói dịch vụ bất kỳ lúc nào. Chi phí sẽ được tính toán lại dựa trên thời gian sử dụng thực tế.',
  },
  {
    question: 'CloudPOS có hỗ trợ thiết bị phần cứng không?',
    answer:
      'Chúng tôi hỗ trợ hầu hết các loại máy in hóa đơn, ngăn kéo đựng tiền và máy quét mã vạch trên thị trường. Bạn cũng có thể mua trọn bộ phần cứng từ CloudPOS.',
  },
  {
    question: 'Thời gian dùng thử miễn phí là bao lâu?',
    answer:
      'Bạn có 14 ngày dùng thử miễn phí toàn bộ các tính năng của gói Chuyên Nghiệp để trải nghiệm hệ thống trước khi quyết định mua.',
  },
]

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="max-w-5xl w-full mx-auto px-6 py-16 text-center">
        <h1 className="text-slate-900 text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4">
          Bảng giá dịch vụ
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Chọn gói giải pháp phù hợp với quy mô cửa hàng của bạn. Tối ưu chi phí, nâng cao hiệu suất kinh doanh.
        </p>

        {/* Billing Toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex h-12 items-center rounded-xl bg-slate-100 p-1.5 shadow-inner">
            <button
              className={`flex h-full items-center justify-center rounded-lg px-6 text-sm font-bold transition-all ${
                !isYearly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-primary'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Thanh toán tháng
            </button>
            <button
              className={`flex h-full items-center justify-center rounded-lg px-6 text-sm font-bold transition-all ${
                isYearly ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-primary'
              }`}
              onClick={() => setIsYearly(true)}
            >
              Thanh toán năm
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                -20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== PRICING GRID ===== */}
      <section className="max-w-7xl w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl p-8 transition-shadow ${
                plan.highlighted
                  ? 'relative border-2 border-primary bg-white shadow-xl md:scale-105 z-10'
                  : 'border border-slate-200 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Phổ biến nhất
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-slate-900 text-lg font-bold mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-900 text-4xl font-black tracking-tight">
                    {isYearly ? plan.priceYearly : plan.price}
                  </span>
                  {plan.period && <span className="text-slate-500 text-sm font-medium">{plan.period}</span>}
                </div>
              </div>

              <Link
                to={plan.ctaLink}
                className={`w-full rounded-xl h-12 mb-8 font-bold flex items-center justify-center transition-all ${
                  plan.ctaStyle === 'primary'
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                    : plan.ctaStyle === 'dark'
                      ? 'bg-slate-900 text-white hover:opacity-90'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="flex flex-col gap-4">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="material-symbols-outlined text-primary text-xl shrink-0">check_circle</span>
                    <span className={feature.bold ? 'font-semibold' : ''}>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="max-w-4xl w-full mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-slate-900 text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
          <p className="text-slate-600">Mọi thắc mắc về dịch vụ CloudPOS sẽ được giải đáp tại đây.</p>
        </div>
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white border border-slate-200 transition-all"
            >
              <button
                className="w-full flex items-center justify-between text-left"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <h4 className="font-bold text-slate-900">{faq.question}</h4>
                <span
                  className={`material-symbols-outlined text-slate-400 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {openFaq === index && (
                <div className="mt-4 text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="w-full bg-primary/5 py-20 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-slate-900 text-3xl font-bold mb-6">
            Sẵn sàng để số hóa cửa hàng của bạn?
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            Hơn 10.000 chủ cửa hàng đã tin dùng CloudPOS để vận hành kinh doanh mỗi ngày.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="h-14 px-10 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/30 flex items-center justify-center transition-all hover:-translate-y-0.5"
            >
              Dùng thử 14 ngày miễn phí
            </Link>
            <Link
              to="/#contact"
              className="h-14 px-10 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-bold text-lg hover:border-primary transition-colors flex items-center justify-center"
            >
              Yêu cầu demo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default PricingPage
