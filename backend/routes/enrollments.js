// File: backend/routes/enrollments.js

import express from 'express' // <-- Changed from require to import
const router = express.Router()

import Enrollment from '../models/Enrollment.js'
import {
  renderEmailTemplate,
  prepareCandidateEnrollForAdmin,
  prepareStudentAcknowledgment,
} from '../utils/emailTemplates.js'
import transporter from '../utils/mail.js'

// POST a new enrollment
router.post('/', async (req, res) => {
  try {
    const { name, contact, email, location } = req.body
    // Add a check to make sure a file was uploaded
    const emailCheck = await Enrollment.findOne({ email })
    if (emailCheck) {
      res.send({ message: 'You are Already Enrolled' })
    } else {
      const newEnrollment = new Enrollment({
        name,
        contact,
        email,
        location,
      })
      const savedEnrollment = await newEnrollment.save()
      const templateData = prepareCandidateEnrollForAdmin(newEnrollment)
      const htmlContent = renderEmailTemplate('enrollmentAlert', templateData)

      const mailOptions = {
        from: process.env.AUTH_MAIL,
        to: process.env.AUTH_MAIL,
        subject: 'Candidate Enrollment Form Alert',
        html: htmlContent,
      }
      await transporter.sendMail(mailOptions)
      const template = prepareStudentAcknowledgment(newEnrollment.name)
      const html = renderEmailTemplate(
        'enrollmentStudentConfirmation',
        template,
      )
      const mail = {
        from: process.env.AUTH_MAIL,
        to: newEnrollment.email,
        subject: 'Thank You for Your Response',
        html: html,
      }
      await transporter.sendMail(mail)
      res.status(201).json(savedEnrollment)
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// (Add GET route for admin)
export default router
