import api from './api'

// ── Types ──

export interface RecipeItem {
  id: string
  finishedProductId: string
  finishedProductName?: string
  materialProductId: string
  materialProductName?: string
  quantity: number
  wastePercent: number
  effectiveQuantity: number
  unitId?: string
  unitName?: string
  notes?: string
  sortOrder: number
  materialStockQuantity: number
  materialCostPrice: number
  estimatedCost: number
}

export interface RecipeSummary {
  finishedProductId: string
  finishedProductName?: string
  productType?: string
  materialCount: number
  estimatedTotalCost: number
  items: RecipeItem[]
}

export interface RecipeItemRequest {
  materialProductId: string
  quantity: number
  wastePercent: number
  unitId?: string
  notes?: string
  sortOrder: number
}

export interface CreateRecipeRequest {
  finishedProductId: string
  items: RecipeItemRequest[]
}

// ── Service ──

export const recipeService = {
  getAll: async (): Promise<RecipeSummary[]> => {
    const { data } = await api.get('/recipes')
    return data as RecipeSummary[]
  },

  getByProduct: async (productId: string): Promise<RecipeItem[]> => {
    const { data } = await api.get(`/recipes/product/${productId}`)
    return data as RecipeItem[]
  },

  save: async (request: CreateRecipeRequest): Promise<RecipeSummary> => {
    const { data } = await api.post('/recipes', request)
    return data as RecipeSummary
  },

  delete: async (productId: string): Promise<void> => {
    await api.delete(`/recipes/product/${productId}`)
  },
}
