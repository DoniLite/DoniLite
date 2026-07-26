export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain')
  return 'ok'
})
