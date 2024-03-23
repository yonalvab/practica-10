import { createPool } from 'mysql2/promise'
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USERNAME, DB_PORT } from './config.js'

export const pool = createPool({
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  user: DB_USERNAME,
  port: DB_PORT
})
