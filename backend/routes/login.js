import express from 'express'
import Users from '../models/User.js'
import jwtToken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import dotenv from 'dotenv'
import {
  prepareSuccessLoginData,
  prepareFailedLoginData,
  prepareForSuccessfulPasswordChange,
  prepareOtpData,
  renderEmailTemplate,
} from '../utils/emailTemplates.js'
import transporter from '../utils/mail.js'
dotenv.config()

const router = express.Router()

router.post('/register', async (request, response) => {
  const { name, email, role, employeeId, password } = request.body
  const checkUserExists = await Users.findOne({ employeeId })
  if (checkUserExists) {
    response.send({
      message: `User Already Exists of role: ${checkUserExists.role}`,
    })
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new Users({
      name: name,
      email: email,
      role: role,
      employeeId: employeeId,
      password: hashedPassword,
    })
    await newUser.save()
    response.status(201)
    response.send({ message: 'User Created' })
  }
})

// Login authentication

router.post('/login', async (request, response) => {
  const { email, password } = request.body
  const user = await Users.findOne({ email })
  if (!user) {
    response.status(400)
    response.send({ message: 'User does not exists' })
  } else {
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      const templateData = prepareFailedLoginData(
        request,
        user.email,
        user.role,
      )
      const htmlContent = renderEmailTemplate('failedLoginAlert', templateData)

      const mailOptions = {
        from: process.env.AUTH_MAIL,
        to: user.email,
        subject: '🚫 Security Alert - Invalid Password Attempt',
        text: `Invalid password attempt for ${user.role} email: ${email}`,
        html: htmlContent,
      }
      await transporter.sendMail(mailOptions)
      response.send({ message: 'User Password is Invalid' })
    } else {
      const payload = {
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      }
      const jwt = jwtToken.sign(payload, process.env.MY_SECRET_KEY)
      const templateData = prepareSuccessLoginData(
        request,
        user.email,
        user.role,
      )
      const htmlContent = renderEmailTemplate('loginAlert', templateData)

      const mailOptions = {
        from: process.env.AUTH_MAIL,
        to: user.email,
        subject: `✅ Security Alert - ${user.role} Login Successful`,
        text: `${user.role} successfully logged in: ${user.email}`,
        html: htmlContent,
      }
      await transporter.sendMail(mailOptions)
      response.send({ payload, token: jwt })
    }
  }
})

router.post('/forgot-password', async (request, response) => {
  const { email } = request.body
  const user = await Users.findOne({ email })
  if (!user) {
    response.status(404)
    response.send({ message: 'Invalid Email' })
  } else {
    const otp = crypto.randomInt(10000, 99999).toString()
    user.passwordResetOTP = otp
    user.passwordResetExpires = Date.now() + 600000
    await user.save()
    const username = user.name
    const validMin = 10
    const templateData = prepareOtpData(request, otp, username, validMin)
    const htmlContent = renderEmailTemplate('otpVerification', templateData)
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: user.email,
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
    const user = await Users.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    })
    if (user) {
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
  const user = await Users.findOne({ email })
  try {
    if (!user) {
      response.send({ message: 'Invalid user ❌' })
    } else {
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      user.password = hashedPassword
      user.passwordResetOTP = undefined
      user.passwordResetExpires = undefined
      const username = user.email
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
      await user.save()
      const mailOptions = {
        from: process.env.AUTH_MAIL,
        to: user.email,
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
