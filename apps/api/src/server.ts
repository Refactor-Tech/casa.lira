import { buildApp } from './app.js'
import { createDatabase } from './db.js'

const { db } = createDatabase()
const app = buildApp(db)

try {
  await app.listen({ host: '127.0.0.1', port: 3000 })
  console.log('API Casa Lira em http://127.0.0.1:3000')
} catch (error) {
  app.log.error(error)
  process.exitCode = 1
}
