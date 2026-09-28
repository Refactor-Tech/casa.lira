export type ProductStatus = 'rascunho' | 'publicado'

export interface ProductInput {
  title: string
  priceCents: number
  description: string | null
  imageUrl: string | null
}

export interface Product extends ProductInput {
  id: number
  status: ProductStatus
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface ApiError {
  code: string
  message: string
  fields?: Record<string, string>
}
