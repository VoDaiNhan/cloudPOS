import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import type { Product, UnitConversion } from '../types/product'
import { useProductStore } from '../store/productStore'

const ProductDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const { products, saveProduct } = useProductStore()

  // Find product if edit
  const existingProduct = isEdit ? products.find(p => p.id === id) : null

  const [formData, setFormData] = useState<Partial<Product>>(
    existingProduct || {
      code: '',
      name: '',
      barcode: '',
      categoryName: '',
      price: 0,
      costPrice: 0,
      stock: 0,
      status: 'active',
      baseUnit: 'Lon',
      conversions: [],
      tax: 0,
    }
  )

  const [conversions, setConversions] = useState<UnitConversion[]>(formData.conversions || [])
  const [linkedProductId, setLinkedProductId] = useState(existingProduct?.id || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectExistingProduct = (productId: string) => {
    setLinkedProductId(productId)
    if (!productId) {
      setFormData((prev) => ({
        ...prev,
        code: '',
        name: '',
        barcode: '',
      }))
      setConversions([])
      return
    }

    const selected = products.find((product) => product.id === productId)
    if (!selected) return

    setFormData({ ...selected })
    setConversions(selected.conversions || [])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const numericFields: Array<keyof Product> = ['price', 'costPrice', 'tax', 'stock']
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name as keyof Product) ? Number(value) : value,
    }))
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
    const payload: Partial<Product> = {
      ...formData,
      id: linkedProductId || existingProduct?.id,
      conversions,
      stock: Number(formData.stock ?? existingProduct?.stock ?? 0),
      price: Number(formData.price ?? existingProduct?.price ?? 0),
      costPrice: Number(formData.costPrice ?? existingProduct?.costPrice ?? 0),
      tax: Number(formData.tax ?? existingProduct?.tax ?? 0),
      status: (formData.status ?? existingProduct?.status ?? 'active') as Product['status'],
    }
    saveProduct(payload)
    setIsLoading(false)
    navigate('/products')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-display selection:bg-primary/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 shadow-sm backdrop-blur-md bg-opacity-80">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/products')}
              className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all border border-slate-100 dark:border-slate-800"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 size-11 rounded-xl flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-2xl">inventory_2</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                  {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm mới sản phẩm'}
                </h1>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 opacity-70">CloudPOS - Quản lý kho hàng</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/products')}
              className="px-6 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Hủy
            </button>
            <Button 
              className="px-8 h-11 rounded-xl shadow-lg shadow-primary/20 text-sm font-black uppercase tracking-widest"
              onClick={handleSave}
              loading={isLoading}
              icon="save"
            >
              Lưu sản phẩm
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-10 px-6 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Thông tin cơ bản */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/20 dark:shadow-none border border-slate-200/60 dark:border-slate-800/60">
              <h2 className="text-lg font-black mb-8 flex items-center gap-3 uppercase tracking-tight text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary text-2xl">info</span>
                Thông tin cơ bản
              </h2>
              {!isEdit && (
                <div className="mb-8 p-5 rounded-2xl bg-primary/5 border border-primary/15 space-y-3">
                  <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Chọn nhanh từ tồn kho</label>
                  <select
                    value={linkedProductId}
                    onChange={(e) => handleSelectExistingProduct(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border-none bg-white dark:bg-slate-900 text-sm font-bold focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Nhập mới hoàn toàn</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.code} - {product.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">
                    Chọn sản phẩm có sẵn để tự điền dữ liệu và cập nhật trực tiếp tồn kho.
                  </p>
                </div>
              )}
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
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mã sản phẩm (SKU)</label>
                    <input
                      name="code"
                      value={formData.code || ''}
                      onChange={handleInputChange}
                      className="w-full h-14 px-5 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono font-bold uppercase text-slate-900 dark:text-white placeholder:text-slate-400"
                      placeholder="Ví dụ: SP006"
                      type="text"
                    />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Để trống hệ thống sẽ tự tạo mã</p>
                  </div>
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
                        <option value="">Chọn nhóm hàng</option>
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
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tồn đầu kỳ</label>
                  <div className="relative group">
                    <input
                      name="stock"
                      value={formData.stock ?? 0}
                      onChange={handleInputChange}
                      className="w-full h-14 px-5 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right font-black pr-20 text-slate-900 dark:text-white"
                      placeholder="0"
                      type="number"
                      min={0}
                    />
                    <span className="absolute right-5 top-4 text-slate-400 font-bold">{formData.baseUnit || 'đv'}</span>
                  </div>
                </div>
                <div className="space-y-5 pt-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái kinh doanh</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'active', label: 'Đang kinh doanh' },
                      { key: 'inactive', label: 'Tạm ngưng' },
                    ].map((statusOption) => (
                      <label key={statusOption.key} className="cursor-pointer group">
                        <input
                          type="radio"
                          name="status"
                          value={statusOption.key}
                          checked={(formData.status || 'active') === statusOption.key}
                          onChange={() => setFormData(prev => ({ ...prev, status: statusOption.key as Product['status'] }))}
                          className="peer hidden"
                        />
                        <div className="w-full text-center py-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-lg peer-checked:shadow-primary/20 transition-all text-sm font-black text-slate-500 group-hover:border-primary/30">
                          {statusOption.label}
                        </div>
                      </label>
                    ))}
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
      </main>

      {/* Mobile Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-6 lg:hidden shadow-2xl">
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/products')}
            className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest text-xs"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="flex-2 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
          >
            Lưu sản phẩm
          </button>
        </div>
      </footer>
    </div>
  )
}

export default ProductDetailPage
