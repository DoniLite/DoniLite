export const useSession = () => {
  const user = useState('user', () => null)

  // Récupérer le user
  const refreshSession = async () => {
    const data = await $fetch('/api/auth/me')
    user.value = data.loggedIn ? data : null
  }

  // Login
  const login = async (credentials: Record<string, unknown>) => {
    const result = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })

    if ('success' in result && result.success) {
      await refreshSession()
      return true
    }
    return false
  }

  // Logout
  const logout = async () => {
    await $fetch('/api/auth/logout')
    user.value = null
    await navigateTo('/login')
  }

  return { user, login, logout, refreshSession }
}
