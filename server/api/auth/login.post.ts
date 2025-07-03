import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userService } from '~/lib/service/user.service'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET_KEY = process.env.SERVER_KEY!

export default defineEventHandler(async (event) => {
  const { login, password } = await readBody(event)
  if (!login && !password && typeof login !== 'string' && typeof password !== 'string') {
    return createError({
      statusCode: 400,
      message: 'Invalid fields',
      data: { fields: ['login', 'password'] }
    })
  }
  const user = (await userService.find(login))[0]
  if (!user) {
    return createError({
      statusCode: 404,
      message: 'User not found'
    })
  }
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return createError({
      statusCode: 403,
      message: 'Invalid credentials'
    })
  }
  const cookieExpiration = new Date()
  cookieExpiration.setHours(cookieExpiration.getHours() + 1)
  const auth_token = jwt.sign({ login: user.login, id: user.id }, SECRET_KEY, {
    expiresIn: cookieExpiration.getTime()
  })
  setCookie(event, 'auth_token', auth_token, {
    httpOnly: true,
    expires: cookieExpiration,
    secure: process.env.NODE_ENV === 'production'
  })
  return {
    success: true,
    id: user.id
  }
})
