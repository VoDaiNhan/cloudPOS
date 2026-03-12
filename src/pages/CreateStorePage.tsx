import { useState } from 'react'
import { InputField } from '../components/InputField'
import { Button } from '../components/Button'
import { mockStoreSectors } from '../mock/store'
import type { StoreSector } from '../types/store'
import { SetupLayout } from '../layouts/SetupLayout'

const SectorCard = ({
  sector,
  selected,
  onSelect,
}: {
  sector: StoreSector
  selected: boolean
  onSelect: (id: string) => void
}) => {
  return (
    <label className="flex flex-col items-center gap-3 cursor-pointer group">
      <input
        type="radio"
        name="sector"
        value={sector.id}
        className="peer hidden"
        checked={selected}
        onChange={() => onSelect(sector.id)}
      />
      <div className="w-full h-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 peer-checked:border-primary peer-checked:bg-primary/2 peer-checked:shadow-primary/10 group-hover:border-primary/50 group-hover:shadow-md relative overflow-hidden">
        <div className="aspect-square w-full rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
          <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-5xl">
              {sector.icon}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-900 dark:text-white text-lg font-bold">{sector.title}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{sector.description}</p>
          </div>
          <div className="size-5 rounded-full border-2 border-slate-300 dark:border-slate-600 peer-checked:border-primary flex items-center justify-center bg-white dark:bg-slate-800">
            <div className="size-2.5 rounded-full bg-primary hidden peer-checked:block" />
          </div>
        </div>
      </div>
      <span className="absolute top-3 right-3 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
        <span className="material-symbols-outlined">check_circle</span>
      </span>
    </label>
  )
}

const CreateStorePage = () => {
  const [formData, setFormData] = useState({
    sector: 'tap-hoa',
    storeName: '',
    storeUrl: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSectorSelect = (id: string) => {
    setFormData((prev) => ({ ...prev, sector: id }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Success - redirect to onboarding
    window.location.href = '/onboarding'
  }

  return (
    <SetupLayout>
      <div className="flex flex-1 justify-center py-10 px-4 animate-fade-in">
        <div className="flex flex-col max-w-[640px] flex-1">
          {/* Title Section */}
          <div className="flex flex-col gap-2 mb-8 text-center sm:text-left">
            <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight font-display">
              Thiết lập cửa hàng
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              Chỉ mất 30 giây để bắt đầu quản lý kinh doanh của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Step 1: Sector Selection */}
            <section>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                  1
                </span>
                Chọn ngành hàng kinh doanh
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockStoreSectors.map((sector) => (
                  <SectorCard
                    key={sector.id}
                    sector={sector}
                    selected={formData.sector === sector.id}
                    onSelect={handleSectorSelect}
                  />
                ))}
              </div>
            </section>

            {/* Step 2: Store Details */}
            <section className="flex flex-col gap-5">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold flex items-center gap-2">
                <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                  2
                </span>
                Thông tin cửa hàng
              </h3>
              <div className="grid gap-5">
                <InputField
                  label="Tên cửa hàng"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Tạp hóa Minh Anh"
                  required
                />

                <InputField
                  label="Địa chỉ truy cập (.cloudpos.vn)"
                  name="storeUrl"
                  value={formData.storeUrl}
                  onChange={handleInputChange}
                  placeholder="minhanhstore"
                  suffix=".cloudpos.vn"
                  required
                />
                <p className="-mt-3 text-xs text-slate-500 font-medium">
                  Đây là đường dẫn duy nhất để bạn truy cập vào trang quản trị.
                </p>

                <InputField
                  label="Mật khẩu cửa hàng"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập ít nhất 6 ký tự"
                  endIcon={showPassword ? 'visibility_off' : 'visibility'}
                  onEndIconClick={() => setShowPassword(!showPassword)}
                  required
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col gap-4">
              <Button type="submit" loading={isLoading} fullWidth icon="arrow_forward" className="h-14 font-bold text-base shadow-lg shadow-primary/20">
                Hoàn tất khởi tạo
              </Button>
              <p className="text-center text-sm text-slate-500 font-medium">
                Bằng cách nhấn nút, bạn đồng ý với{' '}
                <a href="#" className="text-primary font-bold hover:underline">
                  Điều khoản dịch vụ
                </a>{' '}
                của chúng tôi.
              </p>
            </div>
          </form>
        </div>
      </div>
    </SetupLayout>
  )
}

export default CreateStorePage
