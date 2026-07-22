export default defineNuxtRouteMiddleware(async () => {
  const { user, refreshSession } = useSession()

  await refreshSession()

  if (!user.value) {
    return navigateTo('/dashboard/login')
  }
})
