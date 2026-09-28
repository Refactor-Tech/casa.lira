import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.js'

export function createDatabase(file = process.env.CASA_LIRA_DB_PATH ?? './catalog.sqlite') {
  const sqlite = new Database(file)
  const db = drizzle({ client: sqlite, schema })
  return { sqlite, db }
}

export type CatalogDatabase = ReturnType<typeof createDatabase>['db']
