import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { DashboardLayout } from '../layouts/DashboardLayout'
import type { Product, UnitConversion } from '../types/product'
import { mockProducts } from '../mock/product'

const ProductDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  // Find product if edit
  const existingProduct = isEdit ? mockProducts.find(p => p.id === id) : null

  const [formData, setFormData] = useState<Partial<Product>>(
    existingProduct || {
      name: '',
      barcode: '',
      categoryName: '',
      price: 0,
      costPrice: 0,
      baseUnit: 'Lon',
      conversions: [],
      tax: 0,
    }
  )

  const [conversions, setConversions] = useState<UnitConversion[]>(formData.conversions || [])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addConversion = () => {
    const newConv: UnitConversion = {
      id: Math.random().toString(36).substr(2, 9),
      unitName: 'Thùng',
      value: 24
    }
    setConversions([...conversions, newConv])
  }

  const removeConversion = (id: string) => {
    setConversions(conversions.filter(c => c.id !== id))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Saved product:', { ...formData, conversions })
    setIsLoading(false)
    navigate('/products')
  }

  return (
    <DashboardLayout
      title={isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm mới sản phẩm'}
      breadcrumb={[
        { label: 'Sản phẩm', path: '/products' },
        { label: isEdit ? 'Chỉnh sửa' : 'Thêm mới' }
      ]}
      actions={
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/products')}
            className="px-6 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition-all font-display"
          >
            Hủy
          </button>
          <Button 
            className="px-8 h-11 rounded-xl shadow-lg shadow-primary/20 text-sm font-black uppercase tracking-widest font-display"
            onClick={handleSave}
            loading={isLoading}
            icon="save"
          >
            Lưu sản phẩm
          </Button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 font-display">
        {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Thông tin cơ bản */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200/60 dark:border-slate-800/60">
              <h2 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-tight text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary text-2xl">info</span>
                Thông tin cơ bản
              </h2>
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên sản phẩm *</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-14 px-5 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400" 
                    placeholder="Ví dụ: Coca Cola 330ml" 
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mã vạch (Barcode)</label>
                    <div className="relative group">
                      <input 
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleInputChange}
                        className="w-full h-14 pl-5 pr-14 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400" 
                        placeholder="Nhập hoặc quét mã" 
                        type="text"
                      />
                      <button className="absolute right-3 top-2.5 size-9 flex items-center justify-center text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-all" title="Tạo mã tự động">
                        <span className="material-symbols-outlined text-lg">barcode_scanner</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nhóm hàng</label>
                    <div className="relative">
                      <select 
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleInputChange}
                        className="w-full h-14 px-5 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-900 dark:text-white"
                      >
                        <option value="">Chọn khách hàng</option>
                        <option value="Nước giải khát">Nước giải khát</option>
                        <option value="Bánh kẹo">Bánh kẹo</option>
                        <option value="Đồ uống">Đồ uống</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-4 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Thiết lập đơn vị quy đổi */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 transition-all hover:border-primary/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black flex items-center gap-3 uppercase tracking-tight text-slate-900 dark:text-white">
                  <span className="material-symbols-outlined text-primary text-2xl">scale</span>
                  Đơn vị quy đổi
                </h2>
                <button 
                  onClick={addConversion}
                  className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Thêm quy đổi
                </button>
              </div>
              <div className="space-y-5">
                {/* Đơn vị cơ bản */}
                <div className="flex items-center gap-6 bg-primary/2 dark:bg-primary/5 p-6 rounded-2xl border-2 border-dashed border-primary/20">
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest ml-1">Đơn vị cơ bản (Nhỏ nhất)</span>
                    <input 
                      name="baseUnit"
                      value={formData.baseUnit}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 font-black text-xl text-primary placeholder:text-primary/30" 
                      placeholder="Nhập đơn vị (vd: Lon, Chai, Cái)" 
                      type="text"
                    />
                  </div>
                  <div className="text-primary opacity-30">
                    <span className="material-symbols-outlined text-4xl">anchor</span>
                  </div>
                </div>

                {/* Danh sách quy đổi */}
                <div className="space-y-4">
                  {conversions.map((conv, idx) => (
                    <div key={conv.id} className="group flex flex-wrap md:flex-nowrap items-center gap-6 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
                      <div className="w-full md:w-40 space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đơn vị quy đổi</span>
                        <input 
                          value={conv.unitName}
                          onChange={(e) => {
                            const newConvs = [...conversions]
                            newConvs[idx].unitName = e.target.value
                            setConversions(newConvs)
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/10 border-none font-bold text-slate-900 dark:text-white" 
                          type="text" 
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <span className="material-symbols-outlined text-slate-300">equal</span>
                      </div>
                      <div className="w-full md:w-32 space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá trị</span>
                        <input 
                          value={conv.value}
                          onChange={(e) => {
                            const newConvs = [...conversions]
                            newConvs[idx].value = Number(e.target.value)
                            setConversions(newConvs)
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/10 border-none font-black text-center text-slate-900 dark:text-white" 
                          type="number" 
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <span className="text-slate-900 dark:text-white font-black uppercase text-sm tracking-wider opacity-60">{formData.baseUnit || '...'}</span>
                      </div>
                      <div className="ml-auto pt-6">
                        <button 
                          onClick={() => removeConversion(conv.id)}
                          className="text-slate-300 hover:text-rose-500 size-9 flex items-center justify-center hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Pricing */}
          <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200/60 dark:border-slate-800/60">
              <h2 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-tight text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary text-2xl">payments</span>
                Giá & Thuế
              </h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Giá vốn</label>
                  <div className="relative group">
                    <input 
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleInputChange}
                      className="w-full h-14 px-5 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right font-black pr-14 text-slate-900 dark:text-white" 
                      placeholder="0" 
                      type="number"
                    />
                    <span className="absolute right-5 top-4 text-slate-400 font-bold">₫</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Giá bán</label>
                  <div className="relative group">
                    <input 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full h-14 px-5 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right font-black pr-14 text-primary text-xl" 
                      placeholder="0" 
                      type="number"
                    />
                    <span className="absolute right-5 top-4 text-primary opacity-50 font-bold">₫</span>
                  </div>
                </div>
                <div className="space-y-5 pt-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Thuế VAT (%)</label>
                  <div className="flex gap-3">
                    {[0, 5, 10].map((v) => (
                      <label key={v} className="flex-1 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="tax" 
                          value={v}
                          checked={formData.tax === v}
                          onChange={() => setFormData(prev => ({ ...prev, tax: v }))}
                          className="peer hidden"
                        />
                        <div className="w-full text-center py-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-lg peer-checked:shadow-primary/20 transition-all text-sm font-black text-slate-500 group-hover:border-primary/30">
                          {v}%
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Mẹo nhỏ */}
            <section className="bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl border border-primary/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              <h3 className="text-primary font-black mb-4 flex items-center gap-3 uppercase tracking-widest text-xs">
                <span className="material-symbols-outlined text-lg">lightbulb</span>
                Mẹo nhỏ
              </h3>
              <p className="text-sm text-primary/80 leading-relaxed font-bold opacity-80">
                Thiết lập đơn vị quy đổi giúp bạn quản lý nhập xuất kho chính xác hơn. Bạn có thể bán lẻ theo 
                <span className="text-primary underline decoration-primary/30 mx-1">Lon</span> 
                nhưng nhập hàng theo 
                <span className="text-primary underline decoration-primary/30 mx-1">Thùng</span>. 
                CloudPOS sẽ tự động tính toán tồn kho.
              </p>
            </section>

            {/* Hình ảnh */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group cursor-pointer border-dashed hover:border-primary/50">
              <div className="size-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Hình ảnh sản phẩm</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Tối đa 2MB, định dạng JPG/PNG</p>
              </div>
            </div>
          </div>
      </div>
    </DashboardLayout>
  )
}

export default ProductDetailPage
