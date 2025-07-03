export default defineEventHandler((event) => {
  console.log('Context ======>', event.context)
  console.log('User context =======>', event.context.user)
  return event.context.user || { loggedIn: false }
})
