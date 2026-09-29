import type { Product, ProductInput } from '../domain/product.js'

export interface ProductRepository {
  listPublished(): Product[]
  findPublishedById(id: number): Product | undefined
  listAll(): Product[]
  findById(id: number): Product | undefined
  create(input: ProductInput, now: string): Product
  update(id: number, input: ProductInput, now: string): Product
  savePublication(product: Product): Product
  delete(id: number): boolean
}
