import { and, desc, eq } from 'drizzle-orm'
import type { Product, ProductInput } from '../../domain/product.js'
import type { CatalogDatabase } from '../../db.js'
import type { ProductRepository } from '../../ports/product-repository.js'
import { products } from '../../schema.js'

type Row = typeof products.$inferSelect

function toProduct(row: Row): Product {
  return {
    id: row.id,
    title: row.title,
    priceCents: row.priceCents,
    description: row.description,
    imageUrl: row.imageUrl,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishedAt: row.publishedAt,
  }
}

export function createSqliteProductRepository(db: CatalogDatabase): ProductRepository {
  return {
    listPublished() {
      return db.select().from(products)
        .where(eq(products.status, 'publicado'))
        .orderBy(desc(products.publishedAt), desc(products.id)).all().map(toProduct)
    },

    findPublishedById(id) {
      const row = db.select().from(products)
        .where(and(eq(products.id, id), eq(products.status, 'publicado'))).get()
      return row ? toProduct(row) : undefined
    },

    listAll() {
      return db.select().from(products).orderBy(desc(products.updatedAt), desc(products.id)).all().map(toProduct)
    },

    findById(id) {
      const row = db.select().from(products).where(eq(products.id, id)).get()
      return row ? toProduct(row) : undefined
    },

    create(input: ProductInput, now: string) {
      const row = db.insert(products).values({
        ...input,
        status: 'rascunho',
        createdAt: now,
        updatedAt: now,
      }).returning().get()
      return toProduct(row)
    },

    update(id, input, now) {
      const row = db.update(products).set({ ...input, updatedAt: now })
        .where(eq(products.id, id)).returning().get()
      return toProduct(row)
    },

    savePublication(product) {
      const row = db.update(products).set({
        status: product.status,
        publishedAt: product.publishedAt,
        updatedAt: product.updatedAt,
      }).where(eq(products.id, product.id)).returning().get()
      return toProduct(row)
    },

    delete(id) {
      return Boolean(db.delete(products).where(eq(products.id, id)).returning().get())
    },
  }
}
