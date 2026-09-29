import Fastify, { type FastifyError, type FastifyReply } from 'fastify'
import type { ApiError, Product as ApiProduct, ProductInput } from '@casa-lira/contracts'
import type { Product } from './domain/product.js'
import type { ProductCatalog, Result } from './application/product-catalog.js'

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

function validationError(fields: Record<string, string>): ApiError {
  return { code: 'VALIDATION_ERROR', message: 'Revise os campos informados.', fields }
}

function notFound(): ApiError {
  return { code: 'NOT_FOUND', message: 'Produto não encontrado.' }
}

function toContractProduct(product: Product): ApiProduct {
  return {
    id: product.id,
    title: product.title,
    priceCents: product.priceCents,
    description: product.description,
    imageUrl: product.imageUrl,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    publishedAt: product.publishedAt,
  }
}

function mapResult<T, U>(result: Result<T>, map: (value: T) => U): Result<U> {
  return result.ok ? { ok: true, value: map(result.value) } : result
}

function sendResult<T>(reply: FastifyReply, result: Result<T>, successStatus = 200) {
  if (!result.ok) {
    if (result.error.type === 'validation') return reply.code(400).send(validationError(result.error.fields))
    return reply.code(404).send(notFound())
  }
  if (result.value === undefined) return reply.code(successStatus).send()
  return reply.code(successStatus).send(result.value)
}

function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export function buildApp(catalog: ProductCatalog) {
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

  app.get('/api/products', async (_request, reply) => sendResult<ApiProduct[]>(reply, mapResult(catalog.listPublished(), products => products.map(toContractProduct))))

  app.get<{ Params: { id: string } }>('/api/products/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    return id ? sendResult<ApiProduct>(reply, mapResult(catalog.getPublished(id), toContractProduct)) : reply.code(404).send(notFound())
  })

  app.get('/api/admin/products', async (_request, reply) => sendResult<ApiProduct[]>(reply, mapResult(catalog.listAll(), products => products.map(toContractProduct))))

  app.get<{ Params: { id: string } }>('/api/admin/products/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    return id ? sendResult<ApiProduct>(reply, mapResult(catalog.getById(id), toContractProduct)) : reply.code(404).send(notFound())
  })

  app.post<{ Body: ProductInput }>('/api/admin/products', { schema: { body: inputSchema } }, async (request, reply) =>
    sendResult<ApiProduct>(reply, mapResult(catalog.create(request.body), toContractProduct), 201))

  app.put<{ Params: { id: string }; Body: ProductInput }>('/api/admin/products/:id', { schema: { body: inputSchema } }, async (request, reply) => {
    const id = parseId(request.params.id)
    return id ? sendResult<ApiProduct>(reply, mapResult(catalog.update(id, request.body), toContractProduct)) : reply.code(404).send(notFound())
  })

  app.post<{ Params: { id: string } }>('/api/admin/products/:id/publish', async (request, reply) => {
    const id = parseId(request.params.id)
    return id ? sendResult<ApiProduct>(reply, mapResult(catalog.publish(id), toContractProduct)) : reply.code(404).send(notFound())
  })

  app.post<{ Params: { id: string } }>('/api/admin/products/:id/unpublish', async (request, reply) => {
    const id = parseId(request.params.id)
    return id ? sendResult<ApiProduct>(reply, mapResult(catalog.unpublish(id), toContractProduct)) : reply.code(404).send(notFound())
  })

  app.delete<{ Params: { id: string } }>('/api/admin/products/:id', async (request, reply) => {
    const id = parseId(request.params.id)
    return id ? sendResult<void>(reply, catalog.delete(id), 204) : reply.code(404).send(notFound())
  })

  return app
}
