export interface StoreSector {
  id: string
  title: string
  description: string
  icon: string
}

export interface CreateStoreFormData {
  sector: string
  storeName: string
  storeUrl: string
  password: string
}
