const { logout } = useSession()

export default async function () {
  await logout()
  await navigateTo('/dashboard/login')
}
