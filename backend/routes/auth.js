import express from 'express'
import jwtToken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import AdminCredentials from '../models/AdminCredentials.js'
import transporter from '../utils/mail.js'
import {
  renderEmailTemplate,
  prepareSuccessLoginData,
  prepareFailedLoginData,
  prepareOtpData,
  prepareForSuccessfulPasswordChange,
} from '../utils/emailTemplates.js'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

// auth verified
router.post('/', async (request, response) => {
  const { email, password } = request.body
  const isAdmin = await AdminCredentials.findOne({ email })
  if (!isAdmin) {
    // Prepare data for failed login template
    const templateData = prepareFailedLoginData(request, email)
    const htmlContent = renderEmailTemplate('failedLoginAlert', templateData)

    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: isAdmin.email,
      subject: '🚫 Security Alert - Failed Login Attempt',
      text: `Failed login attempt detected for email: ${email}`,
      html: htmlContent,
    }
    await transporter.sendMail(mailOptions)
    console.log('Failed login alert email sent')
    response.status(401)
    response.send({ message: 'Invalid Email' })
  } else {
    const checkPassword = await bcrypt.compare(password, isAdmin.password)
    if (!checkPassword) {
      // Prepare data for failed login template (wrong password)
      const templateData = prepareFailedLoginData(request, email)
      const htmlContent = renderEmailTemplate('failedLoginAlert', templateData)

      const mailOptions = {
        from: process.env.AUTH_MAIL,
        to: isAdmin.email,
        subject: '🚫 Security Alert - Invalid Password Attempt',
        text: `Invalid password attempt for admin email: ${email}`,
        html: htmlContent,
      }
      await transporter.sendMail(mailOptions)
      console.log('Invalid password alert email sent')
      response.status(401)
      response.send({ message: 'Invalid Password' })
    } else {
      const payLoad = { email, role: 'superAdmin' }
      const token = jwtToken.sign(payLoad, process.env.MY_SECRET_KEY)

      // Prepare data for successful login template
      // const templateData = prepareSuccessLoginData(request, email)
      // const htmlContent = renderEmailTemplate('adminLoginAlert', templateData)

      // const mailOptions = {
      //   from: process.env.AUTH_MAIL,
      //   to: isAdmin.email,
      //   subject: '✅ Security Alert - Admin Login Successful',
      //   text: `Admin successfully logged in: ${email}`,
      //   html: htmlContent,
      // }
      // await transporter.sendMail(mailOptions)
      console.log('Successful login alert email sent')
      response.status(200)
      response.send({ message: 'Welcome Admin', user: payLoad, Token: token })
    }
  }
})

router.post('/register', async (request, response) => {
  const { email, password } = request.body
  const isAdmin = await AdminCredentials.findOne({ email })
  if (isAdmin) {
    response.status(401)
    response.send({ message: 'Admin Already Present' })
  } else {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const admin = new AdminCredentials({
      email: email,
      password: hashedPassword,
    })
    await admin.save()
    response.status(200)
    response.send({ message: 'Welcome Admin', token: token })
    response.send({ message: 'Admin Created' })
  }
})

router.post('/forgot-password', async (request, response) => {
  const { email } = request.body
  const admin = await AdminCredentials.findOne({ email })
  if (!admin) {
    response.status(404)
    response.send({ message: 'This is not Admins Email' })
  } else {
    const otp = crypto.randomInt(10000, 99999).toString()
    admin.passwordResetOTP = otp
    admin.passwordResetExpires = Date.now() + 600000
    await admin.save()
    const username = email
    const validMin = 10
    const templateData = prepareOtpData(request, otp, username, validMin)
    const htmlContent = renderEmailTemplate('otpVerification', templateData)
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject: 'Otp - Reset Password',
      text: 'Otp - Reset Password ',
      html: htmlContent,
    }
    await transporter.sendMail(mailOptions)
    response.send({ message: 'Email Has been Sent' })
  }
})

router.post('/verify-otp', async (request, response) => {
  const { email, otp } = request.body
  try {
    const admin = await AdminCredentials.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    })
    if (admin) {
      response.send({ message: 'Otp Verified ✅' })
    } else {
      response.send({ message: 'Invalid OTP ❌' })
    }
  } catch (error) {
    response.send({ message: error })
  }
})

router.post('/reset-password', async (request, response) => {
  const { email, password } = request.body
  const admin = await AdminCredentials.findOne({ email })
  try {
    if (!admin) {
      response.send({ message: 'Invalid user ❌' })
    } else {
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      admin.password = hashedPassword
      admin.passwordResetOTP = undefined
      admin.passwordResetExpires = undefined
      const username = admin.email
      const login = 'https://zero7technologies.com/admin'
      const templateData = prepareForSuccessfulPasswordChange(
        request,
        username,
        login,
      )
      const htmlContent = renderEmailTemplate(
        'passwordResetSuccess',
        templateData,
      )
      await admin.save()
      const mailOptions = {
        from: process.env.AUTH_MAIL,
        to: admin.email,
        subject: 'Reset Password Successful ✅',
        text: 'Reset Password ',
        html: htmlContent,
      }
      await transporter.sendMail(mailOptions)
      response.send({ message: 'Password Change Successful ✅' })
    }
  } catch (error) {
    response.send({ message: error })
  }
})

export default router
