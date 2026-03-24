import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { posProducts, posCategories } from '../mock/pos'
import type { POSProduct, CartItem, PaymentMethod, DiscountType } from '../types/posProduct'
import VoiceOverlay from '../components/VoiceOverlay'
import { DashboardLayout } from '../layouts/DashboardLayout'

// ── Product Card ──────────────────────────────────
const ProductCard = ({ product, onAdd }: { product: POSProduct; onAdd: (p: POSProduct) => void }) => (
  <button
    onClick={() => onAdd(product)}
    className="group cursor-pointer rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 transition-all hover:border-primary hover:bg-white hover:shadow-md text-left"
  >
    <div
      className="mb-3 aspect-square w-full rounded-xl bg-slate-200 bg-cover bg-center"
      style={{ backgroundImage: `url('${product.image}')` }}
    />
    <p className="text-sm font-black line-clamp-1 text-slate-900 dark:text-white">{product.name}</p>
    <div className="mt-1.5 flex items-center justify-between">
      <span className="text-sm font-black text-primary">{product.price.toLocaleString('vi-VN')}đ</span>
      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">SL: {product.stock}</span>
    </div>
  </button>
)

const POSPage = () => {
  // ── State ──────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [vatRate, setVatRate] = useState(5)
  const [invoiceDiscountValue, setInvoiceDiscountValue] = useState(0)
  const [invoiceDiscountType, setInvoiceDiscountType] = useState<DiscountType>('fixed')
  const [cashReceived, setCashReceived] = useState(0)
  const [customerSearch, setCustomerSearch] = useState('')
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<string | null>(null)
  const [customVat, setCustomVat] = useState(false)

  // ── Refs ───────────────────────────────────────
  const productSearchRef = useRef<HTMLInputElement>(null)
  const customerSearchRef = useRef<HTMLInputElement>(null)

  // ── Keyboard Shortcuts ─────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is inside an input, unless it's a specific function key
      if (e.key === 'F1') {
        e.preventDefault()
        productSearchRef.current?.focus()
      } else if (e.key === 'F2') {
        e.preventDefault()
        customerSearchRef.current?.focus()
      } else if (e.key === 'F8') {
        e.preventDefault()
        // Trigger Payment
        if (cart.length > 0) alert('Thực hiện Thanh toán thành công!')
      } else if (e.key === 'F10') {
        e.preventDefault()
        // Save Draft
        if (cart.length > 0) alert('Đã lưu nháp đơn hàng!')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cart])

  // ── Refs for scroll-spy ─────────────────────────
  const productScrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const isUserScrolling = useRef(true)

  // ── Categories (without 'Tất cả') ──────────────
  const actualCategories = useMemo(() => posCategories.filter(c => c !== 'Tất cả'), []) 

  // ── Products grouped by category ───────────────
  const groupedProducts = useMemo(() => {
    const groups: Record<string, typeof posProducts> = {}
    for (const cat of actualCategories) {
      const items = posProducts.filter(p => p.category === cat)
      if (items.length > 0) groups[cat] = items
    }
    return groups
  }, [actualCategories])

  // ── Filtered (for search) ──────────────────────
  const searchFiltered = useMemo(() => {
    if (!searchTerm) return null
    const term = searchTerm.toLowerCase()
    return posProducts.filter(p => p.name.toLowerCase().includes(term))
  }, [searchTerm])

  // ── IntersectionObserver scroll-spy ─────────────
  useEffect(() => {
    const scrollContainer = productScrollRef.current
    if (!scrollContainer) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!isUserScrolling.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cat = entry.target.getAttribute('data-category')
            if (cat) setActiveCategory(cat)
          }
        }
      },
      {
        root: scrollContainer,
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0,
      }
    )

    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [groupedProducts])

  // ── Click tab → scroll to section ──────────────
  const scrollToCategory = useCallback((cat: string) => {
    if (cat === 'Tất cả') {
      setActiveCategory('Tất cả')
      productScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      // Re-enable scroll-spy after animation
      isUserScrolling.current = false
      setTimeout(() => { isUserScrolling.current = true }, 600)
      return
    }
    const el = sectionRefs.current.get(cat)
    if (el && productScrollRef.current) {
      isUserScrolling.current = false
      setActiveCategory(cat)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => { isUserScrolling.current = true }, 600)
    }
  }, [])

  // ── Cart Operations ────────────────────────────
  const addToCart = useCallback((product: POSProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1, discountValue: 0, discountType: 'fixed' as DiscountType }]
    })
  }, [])

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }, [])

  const updateItemDiscount = useCallback((productId: string, value: number, type?: DiscountType) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              discountValue: type === 'percent' ? Math.min(100, Math.max(0, value)) : Math.max(0, value),
              discountType: type ?? item.discountType,
            }
          : item
      )
    )
  }, [])

  const toggleItemDiscountType = useCallback((productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, discountType: item.discountType === 'percent' ? 'fixed' : 'percent', discountValue: 0 }
          : item
      )
    )
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // ── Discount Calculations ───────────────────────
  const calcItemDiscount = useCallback((item: CartItem) => {
    const lineTotal = item.product.price * item.quantity
    if (item.discountType === 'percent') {
      return Math.round(lineTotal * item.discountValue / 100)
    }
    return Math.min(item.discountValue, lineTotal)
  }, [])

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  )

  const totalItemDiscount = useMemo(
    () => cart.reduce((sum, item) => sum + calcItemDiscount(item), 0),
    [cart, calcItemDiscount]
  )

  const afterItemDiscount = subtotal - totalItemDiscount

  const invoiceDiscountAmount = useMemo(() => {
    if (invoiceDiscountType === 'percent') {
      return Math.round(afterItemDiscount * invoiceDiscountValue / 100)
    }
    return Math.min(invoiceDiscountValue, afterItemDiscount)
  }, [afterItemDiscount, invoiceDiscountValue, invoiceDiscountType])

  const vatAmount = Math.round((afterItemDiscount - invoiceDiscountAmount) * vatRate / 100)
  const total = afterItemDiscount - invoiceDiscountAmount + vatAmount
  const change = cashReceived > 0 ? cashReceived - total : 0

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // ── Payment methods ────────────────────────────
  const paymentMethods: { key: PaymentMethod; icon: string; label: string }[] = [
    { key: 'cash', icon: 'payments', label: 'Tiền mặt' },
    { key: 'transfer', icon: 'qr_code_2', label: 'Chuyển khoản' },
    { key: 'debt', icon: 'credit_card', label: 'Ghi nợ' },
  ]

  return (
    <DashboardLayout title="Bán hàng (POS)" breadcrumb={[{ label: 'Giao dịch' }, { label: 'Bán hàng (POS)' }]}>
      {/* ═══ Main 3-Column Layout ═══ */}
      <div className="flex overflow-hidden gap-4 font-display" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* ─── LEFT: Product Browser (30%) ─────── */}
        <section className="flex w-[30%] flex-col gap-4 overflow-hidden rounded-2xl bg-white dark:bg-slate-950 p-4 shadow-sm border border-slate-200/60 dark:border-slate-800/60 relative">
          <VoiceOverlay
            isOpen={voiceOpen}
            onClose={() => setVoiceOpen(false)}
            subtitle="Hãy nói tên sản phẩm bạn muốn tìm"
            onResult={(text) => setSearchTerm(text)}
            simulatedResult="Cà phê"
          />
          {/* Search */}
          <div className="flex gap-2">
            <label className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <button
                onClick={() => setVoiceOpen(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors z-10"
              >
                <span className="material-symbols-outlined text-xl">mic</span>
              </button>
              <input
                ref={productSearchRef}
                className="w-full rounded-xl border-none bg-slate-50 dark:bg-slate-900 pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-primary/20 text-sm font-bold placeholder:text-slate-400"
                placeholder="Tìm sản phẩm (F1)..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
            </button>
          </div>

          {/* Category Filter — scroll-spy tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
            {posCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid — grouped by category with scroll-spy */}
          <div ref={productScrollRef} className="overflow-y-auto pr-1 flex-1 scroll-smooth">
            {searchFiltered ? (
              /* Search results — flat grid */
              <div className="grid grid-cols-2 gap-3">
                {searchFiltered.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center justify-center py-12 text-slate-300">
                    <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                    <p className="text-sm font-bold">Không tìm thấy sản phẩm</p>
                  </div>
                ) : (
                  searchFiltered.map((product) => (
                    <ProductCard key={product.id} product={product} onAdd={addToCart} />
                  ))
                )}
              </div>
            ) : (
              /* Grouped by category */
              Object.entries(groupedProducts).map(([category, products]) => (
                <div
                  key={category}
                  data-category={category}
                  ref={(el) => { if (el) sectionRefs.current.set(category, el) }}
                >
                  <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm py-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {category}
                      <span className="text-slate-300 font-bold">({products.length})</span>
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} onAdd={addToCart} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ─── CENTER: Cart (40%) ──────────────── */}
        <section className="flex w-[40%] flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-950 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 shrink-0">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Giỏ hàng hiện tại</h3>
              {totalItems > 0 && (
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                  {totalItems}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:underline"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Cart Table */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 dark:text-slate-600 gap-3">
                <span className="material-symbols-outlined text-6xl">shopping_cart</span>
                <p className="text-sm font-bold">Chưa có sản phẩm nào</p>
                <p className="text-xs text-slate-400">Chọn sản phẩm bên trái để thêm vào giỏ</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Sản phẩm</th>
                    <th className="px-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Số lượng</th>
                    <th className="px-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Giảm giá</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Thành tiền</th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {cart.map((item) => {
                    const itemDiscountAmt = calcItemDiscount(item)
                    const lineTotal = item.product.price * item.quantity - itemDiscountAmt
                    return (
                    <tr key={item.product.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.product.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{item.product.price.toLocaleString('vi-VN')}đ</p>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="size-6 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-slate-100 transition-all"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="size-6 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-slate-100 transition-all text-primary"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        {editingDiscount === item.product.id ? (
                          <div className="flex items-center gap-1 justify-end">
                            <input
                              autoFocus
                              className="w-16 text-right rounded-lg border border-primary/30 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                              type="text"
                              value={item.discountValue > 0 ? item.discountValue : ''}
                              placeholder="0"
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '')
                                updateItemDiscount(item.product.id, Number(raw))
                              }}
                              onBlur={() => setEditingDiscount(null)}
                              onKeyDown={(e) => { if (e.key === 'Enter') setEditingDiscount(null) }}
                            />
                            <button
                              onClick={() => toggleItemDiscountType(item.product.id)}
                              className="shrink-0 h-6 px-1.5 rounded-md bg-primary/10 text-primary text-[10px] font-black hover:bg-primary/20 transition-all"
                              title="Chuyển đổi % / đ"
                            >
                              {item.discountType === 'percent' ? '%' : 'đ'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingDiscount(item.product.id)}
                            className="w-full text-right group/disc"
                          >
                            {itemDiscountAmt > 0 ? (
                              <span className="text-xs font-bold text-rose-500">
                                -{itemDiscountAmt.toLocaleString('vi-VN')}đ
                                <span className="text-[9px] text-slate-400 ml-1">({item.discountValue}{item.discountType === 'percent' ? '%' : 'đ'})</span>
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300 group-hover/disc:text-primary transition-colors flex items-center justify-end gap-0.5">
                                <span className="material-symbols-outlined text-[14px]">add_circle</span>
                                Giảm
                              </span>
                            )}
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {lineTotal.toLocaleString('vi-VN')}đ
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Shortcut Hints */}
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 p-4 shrink-0">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-sm text-primary">info</span>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Phím tắt: F1: Tìm SP | F2: Chọn KH | F8: Thanh toán | F10: Lưu đơn
              </p>
            </div>
          </div>
        </section>

        {/* ─── RIGHT: Customer & Payment (30%) ── */}
        <section className="flex w-[30%] flex-col gap-4 overflow-hidden">
          {/* Customer Section */}
          <div className="rounded-2xl bg-white dark:bg-slate-950 p-4 shadow-sm border border-slate-200/60 dark:border-slate-800/60 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Khách hàng</h3>
              <button className="text-[10px] font-black text-primary flex items-center gap-1 uppercase tracking-widest hover:underline">
                <span className="material-symbols-outlined text-xs">add_circle</span>
                Thêm mới
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person_search</span>
              <input
                ref={customerSearchRef}
                className="w-full rounded-xl border-none bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary/20 text-sm font-bold placeholder:text-slate-400"
                placeholder="Tìm tên hoặc SĐT (F2)..."
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
            </div>
            {/* Selected Customer */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-primary/5 p-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs">KV</div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Khách vãng lai</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Điểm tích lũy: 0</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-all">
                <span className="material-symbols-outlined text-xl">edit</span>
              </button>
            </div>
          </div>

          {/* Payment Section */}
          <div className="flex flex-1 flex-col rounded-2xl bg-white dark:bg-slate-950 p-4 shadow-sm border border-slate-200/60 dark:border-slate-800/60 overflow-y-auto">
            {/* Summary */}
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold">Tổng tiền hàng</span>
                <span className="font-black text-slate-900 dark:text-white">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              {totalItemDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-bold">Giảm giá sản phẩm</span>
                  <span className="font-black text-rose-500">-{totalItemDiscount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold">Giảm giá hóa đơn</span>
                <div className="flex items-center gap-1">
                  <input
                    className="w-20 text-right rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    type="text"
                    value={invoiceDiscountValue > 0 ? invoiceDiscountValue.toLocaleString('vi-VN') : ''}
                    placeholder="0"
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '')
                      const val = Number(raw)
                      setInvoiceDiscountValue(invoiceDiscountType === 'percent' ? Math.min(100, val) : val)
                    }}
                  />
                  <button
                    onClick={() => {
                      setInvoiceDiscountType(prev => prev === 'percent' ? 'fixed' : 'percent')
                      setInvoiceDiscountValue(0)
                    }}
                    className="shrink-0 h-6 px-2 rounded-md bg-primary/10 text-primary text-[10px] font-black hover:bg-primary/20 transition-all"
                    title="Chuyển đổi % / đ"
                  >
                    {invoiceDiscountType === 'percent' ? '%' : 'đ'}
                  </button>
                  {invoiceDiscountAmount > 0 && (
                    <span className="text-xs font-black text-rose-500 ml-1 whitespace-nowrap">-{invoiceDiscountAmount.toLocaleString('vi-VN')}đ</span>
                  )}
                </div>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Thuế VAT</span>
                  <span className="font-black text-slate-900 dark:text-white">{vatAmount > 0 && '+'}{vatAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex items-center gap-1">
                  {[0, 5, 8, 10].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => { setVatRate(rate); setCustomVat(false) }}
                      className={`h-7 px-2.5 rounded-lg text-[11px] font-black transition-all ${
                        vatRate === rate && !customVat
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                  <button
                    onClick={() => setCustomVat(!customVat)}
                    className={`h-7 px-2 rounded-lg text-[11px] font-black transition-all flex items-center gap-0.5 ${
                      customVat
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title="Nhập thuế suất tùy chỉnh"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                  </button>
                  {customVat && (
                    <div className="flex items-center gap-1 ml-1">
                      <input
                        autoFocus
                        className="w-12 text-right rounded-lg border border-primary/30 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        type="text"
                        value={vatRate > 0 ? vatRate : ''}
                        placeholder="0"
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^\d.]/g, '')
                          const val = parseFloat(raw) || 0
                          setVatRate(Math.min(100, Math.max(0, val)))
                        }}
                      />
                      <span className="text-[10px] font-black text-slate-400">%</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-end pt-3">
                <span className="text-base font-black text-slate-900 dark:text-white">Tổng cộng</span>
                <span className="text-3xl font-black text-primary tracking-tight">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="py-4">
              <h4 className="mb-3 text-sm font-black text-slate-900 dark:text-white">Phương thức thanh toán</h4>
              <div className="flex gap-1 rounded-xl bg-slate-50 dark:bg-slate-900 p-1">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.key}
                    onClick={() => setPaymentMethod(pm.key)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${
                      paymentMethod === pm.key
                        ? 'bg-white dark:bg-slate-800 text-primary shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{pm.icon}</span>
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Cash Payment Details */}
              {paymentMethod === 'cash' && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiền khách đưa</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 pr-12 text-right font-black text-xl text-primary py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        type="text"
                        value={cashReceived > 0 ? cashReceived.toLocaleString('vi-VN') : ''}
                        placeholder="0"
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '')
                          setCashReceived(Number(raw))
                        }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">đ</span>
                    </div>
                  </div>
                  {cashReceived > 0 && (
                    <div className="flex justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
                      <span className="text-sm font-black text-slate-500">Tiền thừa trả khách</span>
                      <span className={`text-lg font-black ${change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {change.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Transfer */}
              {paymentMethod === 'transfer' && (
                <div className="mt-4 text-center space-y-4 animate-fade-in">
                  <div className="mx-auto size-48 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300">qr_code_2</span>
                  </div>
                  <p className="text-sm text-slate-400 font-bold">Quét mã QR để thanh toán</p>
                  <p className="text-2xl font-black text-primary">{total.toLocaleString('vi-VN')}đ</p>
                </div>
              )}

              {/* Debt */}
              {paymentMethod === 'debt' && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 p-4 border border-amber-100 dark:border-amber-900/30">
                    <span className="material-symbols-outlined text-amber-500">warning</span>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                      Đơn hàng sẽ được ghi nợ cho khách hàng hiện tại
                    </p>
                  </div>
                  <p className="text-sm text-slate-400 font-bold text-center">
                    Số tiền ghi nợ: <span className="text-primary font-black text-lg">{total.toLocaleString('vi-VN')}đ</span>
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
              <button 
                onClick={() => { if (cart.length > 0) alert('Đã lưu nháp đơn hàng!') }}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-primary py-4 font-black text-primary hover:bg-primary/5 transition-all text-sm uppercase tracking-widest"
              >
                <span className="material-symbols-outlined">print</span>
                In nháp (F10)
              </button>
              <button 
                onClick={() => { if (cart.length > 0) alert('Thực hiện Thanh toán thành công!') }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-black text-white shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95 text-sm uppercase tracking-widest"
              >
                <span className="material-symbols-outlined">check_circle</span>
                Thanh toán (F8)
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default POSPage
