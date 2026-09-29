import { createProductCatalog } from './application/product-catalog.js'
import { buildApp } from './app.js'
import { createSqliteProductRepository } from './adapters/persistence/sqlite-product-repository.js'
import { createDatabase } from './db.js'

const { db } = createDatabase()
const repository = createSqliteProductRepository(db)
const catalog = createProductCatalog(repository)
const app = buildApp(catalog)

try {
  await app.listen({ host: '127.0.0.1', port: 3000 })
  console.log('API Casa Lira em http://127.0.0.1:3000')
} catch (error) {
  app.log.error(error)
  process.exitCode = 1
}
