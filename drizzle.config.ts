import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { defineConfig } from 'drizzle-kit'

expand(config())

if (!process.env.DATABASE_URL && typeof process.env.DATABASE_URL !== 'string') {
  throw new Error('please make sure to provide the DATABASE_URL var')
}

export default defineConfig({
  out: './drizzle',
  schema: './db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
})
