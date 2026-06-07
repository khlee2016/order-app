import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import { config } from '../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const reset = process.argv.includes('--reset')

function getDbName(databaseUrl) {
  return new URL(databaseUrl).pathname.replace(/^\//, '')
}

function getAdminUrl(databaseUrl) {
  const url = new URL(databaseUrl)
  url.pathname = '/postgres'
  return url.toString()
}

async function dropDatabase(adminPool, dbName) {
  await adminPool.query(
    `SELECT pg_terminate_backend(pid)
     FROM pg_stat_activity
     WHERE datname = $1 AND pid <> pg_backend_pid()`,
    [dbName],
  )
  await adminPool.query(`DROP DATABASE IF EXISTS "${dbName}"`)
  console.log(`Database "${dbName}" dropped.`)
}

async function createDatabase(adminPool, dbName) {
  const exists = await adminPool.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName],
  )

  if (exists.rowCount === 0) {
    await adminPool.query(`CREATE DATABASE "${dbName}"`)
    console.log(`Database "${dbName}" created.`)
  } else {
    console.log(`Database "${dbName}" already exists.`)
  }
}

async function applySchemaAndSeed(pool) {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')

  await pool.query(schema)
  await pool.query(seed)
  console.log('Schema and seed data applied.')
}

async function initDatabase() {
  const dbName = getDbName(config.databaseUrl)
  const adminUrl = getAdminUrl(config.databaseUrl)
  const adminPool = new pg.Pool({ connectionString: adminUrl })

  try {
    if (reset) {
      await dropDatabase(adminPool, dbName)
    }

    await createDatabase(adminPool, dbName)
  } finally {
    await adminPool.end()
  }

  const pool = new pg.Pool({ connectionString: config.databaseUrl })

  try {
    await applySchemaAndSeed(pool)
    console.log('Database initialization completed.')
  } finally {
    await pool.end()
  }
}

initDatabase().catch((err) => {
  console.error('Database init failed:', err.message)
  if (err.code) console.error('Error code:', err.code)
  process.exit(1)
})
