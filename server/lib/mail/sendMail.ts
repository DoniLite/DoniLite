import { getMailTransport } from './transport'

export interface SendMailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendMail = async (payload: SendMailPayload) => {
  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP is not configured (missing SMTP_HOST)')
  }

  await getMailTransport().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text
  })
}
