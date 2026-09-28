import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  priceCents: integer('price_cents').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  status: text('status', { enum: ['rascunho', 'publicado'] }).notNull().default('rascunho'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  publishedAt: text('published_at'),
})
