import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import type { Product, ProductInput } from '@casa-lira/contracts'
import { buildApp } from './app.js'
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
  const app = buildApp(db)
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
