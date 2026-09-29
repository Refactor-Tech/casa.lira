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

export interface ProductValidationError {
  type: 'validation'
  fields: Record<string, string>
}

export function normalizeProductInput(input: ProductInput): ProductInput | ProductValidationError {
  const fields: Record<string, string> = {}
  const title = input.title.trim()
  const description = input.description?.trim() || null
  const imageUrl = input.imageUrl?.trim() || null

  if (!title || title.length > 120) fields.title = 'Informe um título de até 120 caracteres.'
  if (!Number.isSafeInteger(input.priceCents) || input.priceCents <= 0) {
    fields.priceCents = 'Informe um preço maior que zero em centavos.'
  }
  if (description && description.length > 1000) {
    fields.description = 'A descrição deve ter até 1.000 caracteres.'
  }
  if (imageUrl) {
    try {
      const url = new URL(imageUrl)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('invalid protocol')
    } catch {
      fields.imageUrl = 'Informe uma URL http ou https válida.'
    }
  }

  if (Object.keys(fields).length) return { type: 'validation', fields }
  return { title, priceCents: input.priceCents, description, imageUrl }
}

export function isProductValidationError(value: ProductInput | ProductValidationError): value is ProductValidationError {
  return 'type' in value && value.type === 'validation'
}
