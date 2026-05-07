import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { recipeService, type RecipeSummary, type RecipeItem, type RecipeItemRequest } from '../services/recipeService'
import { productService } from '../services/productService'
import type { Product } from '../types/product'

const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.round(n))

const RecipeManagementPage = () => {
  const { productId } = useParams<{ productId?: string }>()
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<RecipeSummary[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [recipeItems, setRecipeItems] = useState<RecipeItemRequest[]>([])
  const [editingRecipe, setEditingRecipe] = useState<RecipeSummary | null>(null)
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [recipesData, productsData] = await Promise.all([
        recipeService.getAll(),
        productService.getAll(),
      ])
      setRecipes(recipesData)
      setProducts(productsData)
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // Auto-open modal when productId is in URL
  useEffect(() => {
    if (productId && productId !== 'new' && products.length > 0 && !loading) {
      const existingRecipe = recipes.find(r => r.finishedProductId === productId)
      if (existingRecipe) {
        handleOpenEdit(existingRecipe)
      } else {
        // New recipe for this product
        setEditingRecipe(null)
        setSelectedProductId(productId)
        setRecipeItems([{ materialProductId: '', quantity: 1, wastePercent: 0, sortOrder: 0 }])
        setIsModalOpen(true)
      }
      // Clear URL after opening modal
      navigate('/recipes', { replace: true })
    }
  }, [productId, products, recipes, loading, navigate])

  const compositeProducts = products.filter(p => {
    const r = recipes.find(r => r.finishedProductId === p.id)
    return r && r.materialCount > 0
  })
  const availableMaterials = products

  const handleOpenAdd = () => {
    setEditingRecipe(null)
    setSelectedProductId('')
    setRecipeItems([{ materialProductId: '', quantity: 1, wastePercent: 0, sortOrder: 0 }])
    setIsModalOpen(true)
  }

  const handleOpenEdit = async (summary: RecipeSummary) => {
    setEditingRecipe(summary)
    setSelectedProductId(summary.finishedProductId)
    try {
      const items = await recipeService.getByProduct(summary.finishedProductId)
      setRecipeItems(items.map((it: RecipeItem, i: number) => ({
        materialProductId: it.materialProductId,
        quantity: it.quantity,
        wastePercent: it.wastePercent,
        unitId: it.unitId,
        notes: it.notes,
        sortOrder: i,
      })))
    } catch {
      setRecipeItems([{ materialProductId: '', quantity: 1, wastePercent: 0, sortOrder: 0 }])
    }
    setIsModalOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Xóa toàn bộ công thức cho sản phẩm này?')) return
    await recipeService.delete(productId)
    loadData()
  }

  const handleSave = async () => {
    if (!selectedProductId || recipeItems.length === 0) return
    const validItems = recipeItems.filter(it => it.materialProductId)
    if (validItems.length === 0) return
    setSaving(true)
    try {
      await recipeService.save({ finishedProductId: selectedProductId, items: validItems })
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      console.error('Save error:', err)
      alert('Lỗi khi lưu công thức!')
    } finally {
      setSaving(false)
    }
  }

  const addItem = () => setRecipeItems(prev => [...prev, { materialProductId: '', quantity: 1, wastePercent: 0, sortOrder: prev.length }])
  const removeItem = (i: number) => setRecipeItems(prev => prev.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, value: string | number) => {
    setRecipeItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it))
  }

  const estimatedCost = recipeItems.reduce((sum, it) => {
    const mat = products.find(p => p.id === it.materialProductId)
    if (!mat) return sum
    const effectiveQty = it.quantity * (1 + (it.wastePercent || 0) / 100)
    return sum + effectiveQty * (mat.costPrice || 0)
  }, 0)

  const filtered = searchTerm
    ? recipes.filter(r => r.finishedProductName?.toLowerCase().includes(searchTerm.toLowerCase()))
    : recipes

  return (
    <DashboardLayout title="Định mức Công thức" breadcrumb={[{ label: 'Hàng hóa' }, { label: 'Định mức' }]}>
      <div className="bg-surface-container-low min-h-[calc(100vh-8rem)] rounded-xl -mt-8 -mx-8 px-10 pt-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
              Quản lý Định mức / Công thức
            </h2>
            <p className="text-on-surface-variant text-sm max-w-xl leading-relaxed">
              Thiết lập công thức nguyên liệu cho thành phẩm. Khi bán hàng, hệ thống sẽ tự động trừ tồn kho nguyên liệu theo định mức FIFO.
            </p>
          </div>
          <button onClick={handleOpenAdd} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg ghost-shadow hover:brightness-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">add</span>
            Thêm công thức
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest rounded-xl p-5 ghost-shadow">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">menu_book</span>
              </div>
              <div>
                <p className="text-2xl font-black text-on-surface">{recipes.length}</p>
                <p className="text-xs text-on-surface-variant">Công thức</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 ghost-shadow">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">blender</span>
              </div>
              <div>
                <p className="text-2xl font-black text-on-surface">{compositeProducts.length}</p>
                <p className="text-xs text-on-surface-variant">Thành phẩm</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 ghost-shadow">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">science</span>
              </div>
              <div>
                <p className="text-2xl font-black text-on-surface">{products.length}</p>
                <p className="text-xs text-on-surface-variant">Sản phẩm / Nguyên liệu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              placeholder="Tìm công thức theo tên thành phẩm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
        </div>

        {/* Recipe List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-12 text-center ghost-shadow">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4 block">menu_book</span>
            <p className="text-on-surface-variant font-medium">Chưa có công thức nào.</p>
            <p className="text-sm text-on-surface-variant/60 mt-1">Bấm "Thêm công thức" để bắt đầu.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(recipe => {
              const isExpanded = expandedId === recipe.finishedProductId
              return (
                <div key={recipe.finishedProductId} className="bg-surface-container-lowest rounded-xl ghost-shadow overflow-hidden">
                  <div
                    className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-surface-container-highest/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : recipe.finishedProductId)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-tertiary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">restaurant</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-on-surface">{recipe.finishedProductName}</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {recipe.materialCount} nguyên liệu · Giá vốn ước tính: <span className="font-bold text-primary">{fmt(recipe.estimatedTotalCost)}đ</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-tertiary-container text-on-tertiary-container">
                        Thành phẩm
                      </span>
                      <button onClick={e => { e.stopPropagation(); handleOpenEdit(recipe) }} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(recipe.finishedProductId) }} className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                      <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-surface-container">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-surface-container-low/50">
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nguyên liệu</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Định mức</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Hao hụt</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Thực dùng</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Đơn giá NVL</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Thành tiền</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Tồn kho</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                          {recipe.items.map(item => (
                            <tr key={item.id} className="hover:bg-surface-container-highest/30 transition-colors">
                              <td className="px-6 py-3 text-sm font-semibold text-on-surface">{item.materialProductName}</td>
                              <td className="px-6 py-3 text-sm text-right text-on-surface-variant">{item.quantity}</td>
                              <td className="px-6 py-3 text-sm text-right text-on-surface-variant">{item.wastePercent}%</td>
                              <td className="px-6 py-3 text-sm text-right font-bold text-on-surface">{item.effectiveQuantity.toFixed(2)}</td>
                              <td className="px-6 py-3 text-sm text-right text-on-surface-variant">{fmt(item.materialCostPrice)}đ</td>
                              <td className="px-6 py-3 text-sm text-right font-bold text-primary">{fmt(item.estimatedCost)}đ</td>
                              <td className="px-6 py-3 text-sm text-right">
                                <span className={`font-bold ${item.materialStockQuantity > 0 ? 'text-green-600' : 'text-error'}`}>
                                  {fmt(item.materialStockQuantity)}
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-surface-container-low/50 font-black">
                            <td colSpan={5} className="px-6 py-3 text-sm text-right text-on-surface">Tổng giá vốn / 1 đơn vị:</td>
                            <td className="px-6 py-3 text-sm text-right text-primary">{fmt(recipe.estimatedTotalCost)}đ</td>
                            <td />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-surface-container-lowest w-full max-w-2xl rounded-xl overflow-hidden ghost-shadow relative animate-fade-in max-h-[90vh] flex flex-col">
              <div className="px-8 py-6 flex justify-between items-center border-b border-surface-container shrink-0">
                <h3 className="text-xl font-bold text-on-surface">
                  {editingRecipe ? 'Chỉnh sửa công thức' : 'Thêm công thức mới'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto flex-1">
                {/* Select finished product */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant block">Thành phẩm</label>
                  <div className="relative">
                    <select
                      value={selectedProductId}
                      onChange={e => setSelectedProductId(e.target.value)}
                      disabled={!!editingRecipe}
                      className="w-full appearance-none bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-container outline-none pr-10 text-on-surface disabled:opacity-60"
                    >
                      <option value="">-- Chọn sản phẩm thành phẩm --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                {/* Ingredient list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">Nguyên liệu</label>
                    <button onClick={addItem} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">add</span> Thêm dòng
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recipeItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-surface-container-low rounded-lg p-4">
                        <div className="flex-1 space-y-3">
                          <div className="relative">
                            <select
                              value={item.materialProductId}
                              onChange={e => updateItem(i, 'materialProductId', e.target.value)}
                              className="w-full appearance-none bg-white border-none rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-container outline-none pr-8 text-on-surface"
                            >
                              <option value="">-- Chọn nguyên liệu --</option>
                              {availableMaterials.filter(p => p.id !== selectedProductId).map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">expand_more</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Định mức</label>
                              <input type="number" min="0" step="0.01" value={item.quantity}
                                onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border-none rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary-container outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase">Hao hụt (%)</label>
                              <input type="number" min="0" max="100" step="0.5" value={item.wastePercent}
                                onChange={e => updateItem(i, 'wastePercent', parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border-none rounded-lg px-3 py-2 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary-container outline-none"
                              />
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeItem(i)} className="p-1.5 mt-1 text-error hover:bg-error-container/20 rounded-lg transition-colors" disabled={recipeItems.length <= 1}>
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost preview */}
                {estimatedCost > 0 && (
                  <div className="bg-primary-fixed/20 p-4 rounded-lg border border-primary-fixed flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Giá vốn ước tính / 1 đơn vị</p>
                      <p className="text-2xl font-black text-primary">{fmt(estimatedCost)}đ</p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>calculate</span>
                  </div>
                )}
              </div>

              <div className="px-8 py-6 bg-surface-container-low flex gap-3 justify-end border-t border-surface-container shrink-0">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-slate-200/50 rounded-lg transition-colors">Hủy bỏ</button>
                <button onClick={handleSave} disabled={saving || !selectedProductId}
                  className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-lg shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                  {saving ? 'Đang lưu...' : (editingRecipe ? 'Cập nhật' : 'Lưu công thức')}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </DashboardLayout>
  )
}

export default RecipeManagementPage
