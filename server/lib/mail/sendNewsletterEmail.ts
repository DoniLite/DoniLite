import dotenv from 'dotenv'
import { sendMail } from './sendMail'
import { renderNewsletterArticleEmail } from './templates/newsletterArticle.template'
dotenv.config()

export interface NewsletterArticlePayload {
  to: string
  title: string
  description: string
  articlePath: string
  unsubscribeToken: string
}

const getSiteUrl = () => (process.env.SITE_URL || 'http://localhost:4040').replace(/\/$/, '')

export const sendNewsletterEmail = async (payload: NewsletterArticlePayload) => {
  const siteUrl = getSiteUrl()
  const html = renderNewsletterArticleEmail({
    title: payload.title,
    description: payload.description,
    url: `${siteUrl}${payload.articlePath}`,
    logoUrl: `${siteUrl}/avatar.jpeg`,
    unsubscribeUrl: `${siteUrl}/newsletter/unsubscribe?token=${payload.unsubscribeToken}`
  })

  await sendMail({
    to: payload.to,
    subject: `New article: ${payload.title}`,
    html,
    text: `${payload.title}\n\n${payload.description}\n\nRead it here: ${siteUrl}${payload.articlePath}`
  })
}
