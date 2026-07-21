import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SECRET_KEY = process.env.SERVER_KEY!

export function assertAuthenticated(event: Parameters<typeof getCookie>[0]) {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }

  try {
    return jwt.verify(token, SECRET_KEY)
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid authentication token' })
  }
}
