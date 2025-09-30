import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true, // ensure certificate validation
  },
})

transporter.verify((error, success) => {
  if (error) {
    console.error('Mail transporter configuration error:', error)
  } else {
    console.log('Mail transporter is ready to send messages')
  }
})

export default transporter
