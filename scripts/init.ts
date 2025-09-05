/* eslint-disable no-console */
import 'dotenv/config'
import { existsSync, writeFileSync } from 'fs'
import path from 'path'

interface EnVVariables {
  [key: string]: string | undefined
}

const requiredEnvVariables: EnVVariables = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  DEFAULT_AUTH: process.env.DEFAULT_AUTH,
  DEFAULT_AUTH_PASSWORD: process.env.DEFAULT_AUTH_PASSWORD,
  SERVER_KEY: process.env.SERVER_KEY,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN
}

const envFilePath = '.env'

const defaultEnvVariables: EnVVariables = {
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://doni:donidb1234thisisanexample@localhost:5454/doni_db',
  SERVER_KEY: 'add-a-strong-access-token-here'
}

export function checkMissingEnv() {
  const missingEnvVariables = Object.entries(requiredEnvVariables)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)

  if (missingEnvVariables.length > 0) {
    console.error(
      `Error: Missing required environment variables: ${missingEnvVariables.join(', ')}`
    )
    process.exit(1)
  }
}

function initEnv() {
  // Initialize environment variables
  const envs: EnVVariables = {}
  for (const [key, value] of Object.entries(requiredEnvVariables)) {
    if (typeof value === 'string') {
      process.env[key] = value
      envs[key] = value
      continue
    }
    const checkedEnv = defaultEnvVariables[key]
    if (typeof checkedEnv === 'string') {
      envs[key] = checkedEnv
      continue
    }
    envs[key] = undefined
  }
  const envPath = path.resolve(process.cwd(), envFilePath)

  if (!existsSync(envPath)) {
    let fileContent: string = '#Here are the app env variables'

    for (const [key, value] of Object.entries(envs)) {
      if (typeof value === 'string') {
        console.log(`initializing an env var with ${key} and value ${value}`)
        fileContent += `\n${key}=${value}`
      } else {
        console.log(`initializing an empty env var with ${key}`)
        console.warn('make sure to fill it after initializing')
        fileContent += `\n${key}=`
      }
    }

    console.log('writing env file content')
    writeFileSync(envPath, fileContent)
    console.log('Environment variables initialized successfully.')
  }
  console.log('Is looks like you have a .env file in your path please remove it and try again')
}

initEnv()
