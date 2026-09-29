import {
  isProductValidationError,
  normalizeProductInput,
  type Product,
  type ProductInput,
} from '../domain/product.js'
import type { ProductRepository } from '../ports/product-repository.js'

export type CatalogError =
  | { type: 'validation'; fields: Record<string, string> }
  | { type: 'not_found' }

export type Result<T> = { ok: true; value: T } | { ok: false; error: CatalogError }

const notFound = (): Result<never> => ({ ok: false, error: { type: 'not_found' } })

export function createProductCatalog(repository: ProductRepository, clock: () => string = () => new Date().toISOString()) {
  return {
    listPublished(): Result<Product[]> {
      return { ok: true, value: repository.listPublished() }
    },

    getPublished(id: number): Result<Product> {
      const product = repository.findPublishedById(id)
      return product ? { ok: true, value: product } : notFound()
    },

    listAll(): Result<Product[]> {
      return { ok: true, value: repository.listAll() }
    },

    getById(id: number): Result<Product> {
      const product = repository.findById(id)
      return product ? { ok: true, value: product } : notFound()
    },

    create(input: ProductInput): Result<Product> {
      const normalized = normalizeProductInput(input)
      if (isProductValidationError(normalized)) return { ok: false, error: normalized }
      return { ok: true, value: repository.create(normalized, clock()) }
    },

    update(id: number, input: ProductInput): Result<Product> {
      const existing = repository.findById(id)
      if (!existing) return notFound()
      const normalized = normalizeProductInput(input)
      if (isProductValidationError(normalized)) return { ok: false, error: normalized }
      return { ok: true, value: repository.update(id, normalized, clock()) }
    },

    publish(id: number): Result<Product> {
      const existing = repository.findById(id)
      if (!existing) return notFound()
      if (existing.status === 'publicado') return { ok: true, value: existing }
      const now = clock()
      return {
        ok: true,
        value: repository.savePublication({ ...existing, status: 'publicado', publishedAt: now, updatedAt: now }),
      }
    },

    unpublish(id: number): Result<Product> {
      const existing = repository.findById(id)
      if (!existing) return notFound()
      if (existing.status === 'rascunho') return { ok: true, value: existing }
      return {
        ok: true,
        value: repository.savePublication({
          ...existing,
          status: 'rascunho',
          publishedAt: null,
          updatedAt: clock(),
        }),
      }
    },

    delete(id: number): Result<void> {
      return repository.delete(id) ? { ok: true, value: undefined } : notFound()
    },
  }
}

export type ProductCatalog = ReturnType<typeof createProductCatalog>
