import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import type { Product, ProductInput } from '@casa-lira/contracts'
import { buildApp } from './app.js'
import { createProductCatalog } from './application/product-catalog.js'
import { createSqliteProductRepository } from './adapters/persistence/sqlite-product-repository.js'
import { createDatabase } from './db.js'

const migration = readFileSync(new URL('../drizzle/0000_natural_aaron_stack.sql', import.meta.url), 'utf8')
const validInput: ProductInput = {
  title: '  Vaso Serra  ',
  priceCents: 19800,
  description: null,
  imageUrl: null,
}

function setup() {
  const { sqlite, db } = createDatabase(':memory:')
  sqlite.exec(migration)
  const repository = createSqliteProductRepository(db)
  const app = buildApp(createProductCatalog(repository))
  return { app, sqlite }
}

test('rascunho, publicação, edição e retirada controlam a consulta pública', async () => {
  const { app, sqlite } = setup()
  try {
    const created = await app.inject({ method: 'POST', url: '/api/admin/products', payload: validInput })
    assert.equal(created.statusCode, 201)
    const product = created.json<Product>()
    assert.equal(product.title, 'Vaso Serra')
    assert.equal(product.status, 'rascunho')
    assert.equal((await app.inject('/api/products')).json<Product[]>().length, 0)
    assert.equal((await app.inject(`/api/products/${product.id}`)).statusCode, 404)

    const published = (await app.inject({ method: 'POST', url: `/api/admin/products/${product.id}/publish` })).json<Product>()
    assert.equal(published.status, 'publicado')
    assert.ok(published.publishedAt)
    assert.equal((await app.inject('/api/products')).json<Product[]>().length, 1)

    const updated = (await app.inject({ method: 'PUT', url: `/api/admin/products/${product.id}`, payload: { ...validInput, title: 'Vaso Novo', priceCents: 20900 } })).json<Product>()
    assert.equal(updated.title, 'Vaso Novo')
    assert.equal(updated.priceCents, 20900)
    assert.equal(updated.publishedAt, published.publishedAt)
    assert.equal((await app.inject(`/api/products/${product.id}`)).json<Product>().title, 'Vaso Novo')

    const draft = (await app.inject({ method: 'POST', url: `/api/admin/products/${product.id}/unpublish` })).json<Product>()
    assert.equal(draft.status, 'rascunho')
    assert.equal(draft.publishedAt, null)
    assert.equal((await app.inject(`/api/products/${product.id}`)).statusCode, 404)
    assert.equal((await app.inject('/api/admin/products')).json<Product[]>().length, 1)
  } finally {
    await app.close()
    sqlite.close()
  }
})

test('a publicação mais recente vem primeiro e a exclusão é definitiva', async () => {
  const { app, sqlite } = setup()
  try {
    const first = (await app.inject({ method: 'POST', url: '/api/admin/products', payload: validInput })).json<Product>()
    const second = (await app.inject({ method: 'POST', url: '/api/admin/products', payload: { ...validInput, title: 'Luminária' } })).json<Product>()
    await app.inject({ method: 'POST', url: `/api/admin/products/${first.id}/publish` })
    await app.inject({ method: 'POST', url: `/api/admin/products/${second.id}/publish` })
    assert.deepEqual((await app.inject('/api/products')).json<Product[]>().map(p => p.id), [second.id, first.id])

    await app.inject({ method: 'POST', url: `/api/admin/products/${first.id}/unpublish` })
    await new Promise(resolve => setTimeout(resolve, 20))
    await app.inject({ method: 'POST', url: `/api/admin/products/${first.id}/publish` })
    assert.deepEqual((await app.inject('/api/products')).json<Product[]>().map(p => p.id), [first.id, second.id])

    const deleted = await app.inject({ method: 'DELETE', url: `/api/admin/products/${first.id}` })
    assert.equal(deleted.statusCode, 204)
    assert.equal((await app.inject(`/api/admin/products/${first.id}`)).statusCode, 404)
    assert.equal((await app.inject(`/api/products/${first.id}`)).statusCode, 404)
  } finally {
    await app.close()
    sqlite.close()
  }
})

test('a API rejeita campos inválidos', async () => {
  const { app, sqlite } = setup()
  try {
    const invalid = await app.inject({
      method: 'POST', url: '/api/admin/products',
      payload: { ...validInput, title: '   ', priceCents: 0, imageUrl: 'file:///tmp/photo.png' },
    })
    assert.equal(invalid.statusCode, 400)
    assert.deepEqual(Object.keys(invalid.json().fields).sort(), ['imageUrl', 'priceCents', 'title'])
    const malformed = await app.inject({ method: 'POST', url: '/api/admin/products', payload: { title: 'Sem preço' } })
    assert.equal(malformed.statusCode, 400)
    assert.equal(malformed.json().code, 'VALIDATION_ERROR')
    assert.equal((await app.inject('/api/admin/products')).json<Product[]>().length, 0)
  } finally {
    await app.close()
    sqlite.close()
  }
})

test('rotas administrativas tratam ids inválidos e transições repetidas', async () => {
  const { app, sqlite } = setup()
  try {
    assert.equal((await app.inject('/api/products/abc')).statusCode, 404)
    assert.equal((await app.inject('/api/admin/products/abc')).statusCode, 404)
    assert.equal((await app.inject({ method: 'PUT', url: '/api/admin/products/abc', payload: validInput })).statusCode, 404)
    assert.equal((await app.inject({ method: 'POST', url: '/api/admin/products/abc/publish' })).statusCode, 404)
    assert.equal((await app.inject({ method: 'POST', url: '/api/admin/products/abc/unpublish' })).statusCode, 404)
    assert.equal((await app.inject({ method: 'DELETE', url: '/api/admin/products/abc' })).statusCode, 404)

    const product = (await app.inject({ method: 'POST', url: '/api/admin/products', payload: validInput })).json<Product>()
    assert.equal((await app.inject(`/api/admin/products/${product.id}`)).json<Product>().id, product.id)
    const draftAgain = await app.inject({ method: 'POST', url: `/api/admin/products/${product.id}/unpublish` })
    assert.equal(draftAgain.json<Product>().status, 'rascunho')

    const published = await app.inject({ method: 'POST', url: `/api/admin/products/${product.id}/publish` })
    const publishedAgain = await app.inject({ method: 'POST', url: `/api/admin/products/${product.id}/publish` })
    assert.equal(publishedAgain.json<Product>().publishedAt, published.json<Product>().publishedAt)

    assert.equal((await app.inject('/api/admin/products/999')).statusCode, 404)
    assert.equal((await app.inject('/api/products/999')).statusCode, 404)
    assert.equal((await app.inject({ method: 'PUT', url: '/api/admin/products/999', payload: validInput })).statusCode, 404)
    assert.equal((await app.inject({ method: 'POST', url: '/api/admin/products/999/publish' })).statusCode, 404)
    assert.equal((await app.inject({ method: 'POST', url: '/api/admin/products/999/unpublish' })).statusCode, 404)
    assert.equal((await app.inject({ method: 'DELETE', url: '/api/admin/products/999' })).statusCode, 404)
  } finally {
    await app.close()
    sqlite.close()
  }
})

test('valida limites de descrição e aceita URLs HTTP e HTTPS', async () => {
  const { app, sqlite } = setup()
  try {
    const tooLong = await app.inject({
      method: 'POST', url: '/api/admin/products',
      payload: { ...validInput, description: 'x'.repeat(1001) },
    })
    assert.equal(tooLong.statusCode, 400)
    assert.deepEqual(Object.keys(tooLong.json().fields), ['description'])

    const http = await app.inject({
      method: 'POST', url: '/api/admin/products',
      payload: { ...validInput, description: '   ', imageUrl: 'http://example.com/image.png' },
    })
    assert.equal(http.statusCode, 201)
    assert.equal(http.json<Product>().description, null)
    assert.equal(http.json<Product>().imageUrl, 'http://example.com/image.png')

    const https = await app.inject({
      method: 'POST', url: '/api/admin/products',
      payload: { ...validInput, imageUrl: 'https://example.com/image.png' },
    })
    assert.equal(https.statusCode, 201)
    assert.equal(https.json<Product>().imageUrl, 'https://example.com/image.png')
  } finally {
    await app.close()
    sqlite.close()
  }
})

test('retorna erros de validação na edição e erro interno quando o banco falha', async () => {
  const { app, sqlite } = setup()
  try {
    const invalidBody = await app.inject({ method: 'POST', url: '/api/admin/products', payload: [] })
    assert.equal(invalidBody.statusCode, 400)
    assert.equal(invalidBody.json().fields.body, 'must be object')

    const invalidUpdate = await app.inject({
      method: 'PUT', url: '/api/admin/products/1',
      payload: { ...validInput, priceCents: 0 },
    })
    assert.equal(invalidUpdate.statusCode, 404)

    const product = (await app.inject({ method: 'POST', url: '/api/admin/products', payload: validInput })).json<Product>()
    const invalidExistingUpdate = await app.inject({
      method: 'PUT', url: `/api/admin/products/${product.id}`,
      payload: { ...validInput, priceCents: 0 },
    })
    assert.equal(invalidExistingUpdate.statusCode, 400)
    assert.equal(invalidExistingUpdate.json().code, 'VALIDATION_ERROR')

    sqlite.close()
    const unavailable = await app.inject('/api/admin/products')
    assert.equal(unavailable.statusCode, 500)
    assert.equal(unavailable.json().code, 'INTERNAL_ERROR')
  } finally {
    await app.close()
    if (sqlite.open) sqlite.close()
  }
})

test('createDatabase usa o caminho configurado no ambiente quando omitido', () => {
  const previousPath = process.env.CASA_LIRA_DB_PATH
  process.env.CASA_LIRA_DB_PATH = ':memory:'
  try {
    const { sqlite } = createDatabase()
    assert.equal(sqlite.open, true)
    sqlite.close()
  } finally {
    if (previousPath === undefined) delete process.env.CASA_LIRA_DB_PATH
    else process.env.CASA_LIRA_DB_PATH = previousPath
  }
})


test('createDatabase usa catalog.sqlite por padrão sem caminho no ambiente', () => {
  const previousPath = process.env.CASA_LIRA_DB_PATH
  const previousCwd = process.cwd()
  const directory = mkdtempSync(join(tmpdir(), 'casa-lira-db-'))
  delete process.env.CASA_LIRA_DB_PATH
  process.chdir(directory)
  try {
    const { sqlite } = createDatabase()
    assert.equal(sqlite.open, true)
    sqlite.close()
  } finally {
    process.chdir(previousCwd)
    rmSync(directory, { recursive: true, force: true })
    if (previousPath !== undefined) process.env.CASA_LIRA_DB_PATH = previousPath
  }
})
