import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET_KEY = process.env.SERVER_KEY!

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    return
  }

  try {
    const user = jwt.verify(token, SECRET_KEY)
    if (!user || typeof user === 'string') {
      return createError({ statusCode: 401, message: 'Invalid token' })
    }
    if ('login' in user && 'id' in user) {
      event.context.user = {
        ...user,
        loggedIn: true
      }
      return
    }
    return createError('Invalid token type')
  } catch (_error) {
    return createError({ statusCode: 401, message: 'Invalid token' })
  }
})
