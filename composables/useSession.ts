import type { AuthRequest } from '~/lib/request/user.request'

export const useSession = () => {
  const user = useState<Record<string, unknown> | null>('user', () => null)

  const refreshSession = async () => {
    const { data } = await useFetch('/api/auth/me')
    user.value = data.value && 'loggedIn' in data.value && data.value.loggedIn ? data.value : null
  }

  // Login
  const login = async (credentials: AuthRequest) => {
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
    await navigateTo('/dashboard/login')
  }

  return { user, login, logout, refreshSession }
}
