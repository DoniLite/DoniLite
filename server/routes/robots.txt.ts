export default defineEventHandler((event) => {
  const siteUrl = (process.env.SITE_URL || 'http://localhost:4040').replace(/\/$/, '')

  setHeader(event, 'content-type', 'text/plain')
  return [
    'User-agent: *',
    'Allow: /',
    'Allow: /__og-image__/*',
    'Disallow: /dashboard',
    '',
    `Sitemap: ${siteUrl}/sitemap_index.xml`,
    ''
  ].join('\n')
})
