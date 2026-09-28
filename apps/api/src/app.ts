import Fastify, { type FastifyError } from 'fastify'
import { and, desc, eq } from 'drizzle-orm'
import type { ApiError, Product, ProductInput } from '@casa-lira/contracts'
import type { CatalogDatabase } from './db.js'
import { products } from './schema.js'

const inputSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'priceCents', 'description', 'imageUrl'],
  properties: {
    title: { type: 'string' },
    priceCents: { type: 'integer' },
    description: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    imageUrl: { anyOf: [{ type: 'string' }, { type: 'null' }] },
  },
} as const

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

function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

function validationError(fields: Record<string, string>): ApiError {
  return { code: 'VALIDATION_ERROR', message: 'Revise os campos informados.', fields }
}

function normalizeInput(input: ProductInput): { value?: ProductInput; error?: ApiError } {
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

  if (Object.keys(fields).length) return { error: validationError(fields) }
  return { value: { title, priceCents: input.priceCents, description, imageUrl } }
}

function notFound(): ApiError {
  return { code: 'NOT_FOUND', message: 'Produto não encontrado.' }
}

export function buildApp(db: CatalogDatabase) {
  const app = Fastify({ logger: false })

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error.validation) {
      const fields: Record<string, string> = {}
      for (const issue of error.validation) {
        const key = issue.instancePath.split('/').filter(Boolean)[0]
          ?? String(issue.params.missingProperty ?? 'body')
        fields[key] = issue.message ?? 'Valor inválido.'
      }
      reply.code(400).send(validationError(fields))
      return
    }
    app.log.error(error)
    reply.code(500).send({ code: 'INTERNAL_ERROR', message: 'Não foi possível concluir a operação.' } satisfies ApiError)
  })

  app.setNotFoundHandler((_request, reply) => reply.code(404).send(notFound()))

  app.get('/api/products', async () => {
    const rows = db.select().from(products)
      .where(eq(products.status, 'publicado'))
      .orderBy(desc(products.publishedAt), desc(products.id)).all()
    return rows.map(toProduct)
  })

  app.get<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    if (!id) return reply.code(404).send(notFound())
    const row = db.select().from(products)
      .where(and(eq(products.id, id), eq(products.status, 'publicado'))).get()
    return row ? toProduct(row) : reply.code(404).send(notFound())
  })

  app.get('/api/admin/products', async () => {
    const rows = db.select().from(products).orderBy(desc(products.updatedAt), desc(products.id)).all()
    return rows.map(toProduct)
  })

  app.get<{ Params: { id: string } }>('/api/admin/products/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    const row = id ? db.select().from(products).where(eq(products.id, id)).get() : undefined
    return row ? toProduct(row) : reply.code(404).send(notFound())
  })

  app.post<{ Body: ProductInput }>('/api/admin/products', { schema: { body: inputSchema } }, async (request, reply) => {
    const { value, error } = normalizeInput(request.body)
    if (error || !value) return reply.code(400).send(error)
    const now = new Date().toISOString()
    const row = db.insert(products).values({ ...value, status: 'rascunho', createdAt: now, updatedAt: now })
      .returning().get()
    return reply.code(201).send(toProduct(row))
  })

  app.put<{ Params: { id: string }; Body: ProductInput }>('/api/admin/products/:id', { schema: { body: inputSchema } }, async (request, reply) => {
    const id = parseId(request.params.id)
    const existing = id ? db.select().from(products).where(eq(products.id, id)).get() : undefined
    if (!existing || !id) return reply.code(404).send(notFound())
    const { value, error } = normalizeInput(request.body)
    if (error || !value) return reply.code(400).send(error)
    const row = db.update(products).set({ ...value, updatedAt: new Date().toISOString() })
      .where(eq(products.id, id)).returning().get()
    return toProduct(row)
  })

  app.post<{ Params: { id: string } }>('/api/admin/products/:id/publish', async (request, reply) => {
    const id = parseId(request.params.id)
    const existing = id ? db.select().from(products).where(eq(products.id, id)).get() : undefined
    if (!existing || !id) return reply.code(404).send(notFound())
    if (existing.status === 'publicado') return toProduct(existing)
    const now = new Date().toISOString()
    const row = db.update(products).set({ status: 'publicado', publishedAt: now, updatedAt: now })
      .where(eq(products.id, id)).returning().get()
    return toProduct(row)
  })

  app.post<{ Params: { id: string } }>('/api/admin/products/:id/unpublish', async (request, reply) => {
    const id = parseId(request.params.id)
    const existing = id ? db.select().from(products).where(eq(products.id, id)).get() : undefined
    if (!existing || !id) return reply.code(404).send(notFound())
    if (existing.status === 'rascunho') return toProduct(existing)
    const row = db.update(products).set({ status: 'rascunho', publishedAt: null, updatedAt: new Date().toISOString() })
      .where(eq(products.id, id)).returning().get()
    return toProduct(row)
  })

  app.delete<{ Params: { id: string } }>('/api/admin/products/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    const row = id ? db.delete(products).where(eq(products.id, id)).returning().get() : undefined
    return row ? reply.code(204).send() : reply.code(404).send(notFound())
  })

  return app
}
