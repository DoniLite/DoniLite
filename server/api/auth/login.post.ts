import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userService } from '~/lib/service/user.service'

const SECRET_KEY = process.env.SERVER_KEY

if (!SECRET_KEY) {
  throw new Error('Please provide the SECRET_KEY env var...')
}

export default defineEventHandler(async (event) => {
  const { login, password } = await readBody(event)
  if (typeof login !== 'string' || typeof password !== 'string' || !login || !password) {
    throw createError({
      statusCode: 400,
      message: 'Invalid fields',
      data: { fields: ['login', 'password'] }
    })
  }
  const user = (await userService.find(login))[0]
  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    throw createError({
      statusCode: 403,
      message: 'Invalid credentials'
    })
  }
  const maxAgeSeconds = 60 * 60
  const auth_token = jwt.sign({ login: user.login, id: user.id }, SECRET_KEY, {
    expiresIn: maxAgeSeconds
  })
  setCookie(event, 'auth_token', auth_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds
  })
  return {
    success: true,
    id: user.id
  }
})
