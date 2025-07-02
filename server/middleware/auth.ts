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
    event.context.user = {
      ...(user as Record<string, unknown>),
      loggedIn: true
    } // On stocke le user pour les routes protégées
  } catch (_error) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }
})
