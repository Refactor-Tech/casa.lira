import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Product, ProductInput } from '../domain/product.js'
import type { ProductRepository } from '../ports/product-repository.js'
import { createProductCatalog } from './product-catalog.js'

class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []
  private nextId = 1

  listPublished() {
    return this.products.filter(product => product.status === 'publicado')
      .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '') || b.id - a.id)
  }

  findPublishedById(id: number) {
    return this.products.find(product => product.id === id && product.status === 'publicado')
  }

  listAll() {
    return [...this.products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.id - a.id)
  }

  findById(id: number) {
    return this.products.find(product => product.id === id)
  }

  create(input: ProductInput, now: string) {
    const product: Product = {
      ...input,
      id: this.nextId++,
      status: 'rascunho',
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    }
    this.products.push(product)
    return product
  }

  update(id: number, input: ProductInput, now: string) {
    const existing = this.findById(id)
    if (!existing) throw new Error('Product must exist before update')
    const updated = { ...existing, ...input, updatedAt: now }
    this.products = this.products.map(product => product.id === id ? updated : product)
    return updated
  }

  savePublication(product: Product) {
    this.products = this.products.map(item => item.id === product.id ? product : item)
    return product
  }

  delete(id: number) {
    const previousLength = this.products.length
    this.products = this.products.filter(product => product.id !== id)
    return this.products.length < previousLength
  }
}

const validInput: ProductInput = {
  title: '  Vaso Serra  ',
  priceCents: 19800,
  description: null,
  imageUrl: null,
}

function setup() {
  let instant = 0
  const repository = new InMemoryProductRepository()
  const catalog = createProductCatalog(repository, () => `2026-09-29T12:00:0${instant++}.000Z`)
  return { catalog }
}

test('normaliza e valida Produto sem depender do adapter HTTP', () => {
  const { catalog } = setup()
  const created = catalog.create(validInput)
  assert.equal(created.ok, true)
  if (!created.ok) return
  assert.equal(created.value.title, 'Vaso Serra')
  assert.equal(created.value.status, 'rascunho')
  assert.equal(created.value.createdAt, '2026-09-29T12:00:00.000Z')

  const invalid = catalog.create({ ...validInput, title: ' ', priceCents: 0, imageUrl: 'file:///tmp/photo.png' })
  assert.deepEqual(invalid, {
    ok: false,
    error: {
      type: 'validation',
      fields: {
        title: 'Informe um título de até 120 caracteres.',
        priceCents: 'Informe um preço maior que zero em centavos.',
        imageUrl: 'Informe uma URL http ou https válida.',
      },
    },
  })
})

test('publicação, retirada, edição e exclusão preservam as regras do catálogo', () => {
  const { catalog } = setup()
  const created = catalog.create(validInput)
  assert.equal(created.ok, true)
  if (!created.ok) return
  const id = created.value.id

  assert.deepEqual(catalog.getPublished(id), { ok: false, error: { type: 'not_found' } })
  const published = catalog.publish(id)
  assert.equal(published.ok, true)
  if (!published.ok) return
  assert.equal(published.value.publishedAt, '2026-09-29T12:00:01.000Z')
  assert.equal(catalog.publish(id).ok, true)
  assert.equal(catalog.listPublished().ok, true)

  const updated = catalog.update(id, { ...validInput, title: 'Vaso Editado' })
  assert.equal(updated.ok, true)
  if (!updated.ok) return
  assert.equal(updated.value.title, 'Vaso Editado')
  assert.equal(updated.value.publishedAt, published.value.publishedAt)

  const draft = catalog.unpublish(id)
  assert.equal(draft.ok, true)
  if (!draft.ok) return
  assert.equal(draft.value.status, 'rascunho')
  assert.equal(draft.value.publishedAt, null)
  assert.deepEqual(catalog.delete(id), { ok: true, value: undefined })
  assert.deepEqual(catalog.getById(id), { ok: false, error: { type: 'not_found' } })
})

test('edição inexistente retorna ausência antes de validar os campos', () => {
  const { catalog } = setup()
  assert.deepEqual(catalog.update(999, { ...validInput, priceCents: 0 }), {
    ok: false,
    error: { type: 'not_found' },
  })
})
