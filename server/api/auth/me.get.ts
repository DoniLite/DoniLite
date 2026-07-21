import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET_KEY = process.env.SERVER_KEY!

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    return {
      loggedIn: false
    }
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    if (typeof decoded !== 'object' || !decoded) {
      throw createError({ statusCode: 401, message: 'Invalid token payload' })
    }

    if (!('id' in decoded) || !('login' in decoded)) {
      throw createError({ statusCode: 401, message: 'Token missing required fields' })
    }

    return {
      ...decoded,
      loggedIn: true
    }
  } catch (err) {
    const message =
      process.env.NODE_ENV === 'development' ? (err as Error).message : 'Invalid token'
    throw createError({ statusCode: 401, message })
  }
})
