import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()

let transport: nodemailer.Transporter | undefined

export const getMailTransport = () => {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }
  return transport
}
