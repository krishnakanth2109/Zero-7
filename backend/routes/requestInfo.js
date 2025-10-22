// File: backend/routes/requestInfo.js

import express from 'express'
import RequestInfo from '../models/RequestInfo.js'
import Candidate from '../models/Candidate.js'
// import transporter from '../utils/mail.js'
// import {
//   renderEmailTemplate,
//   prepareCandidateDetailsForRequester,
// } from '../utils/emailTemplates.js'
import Notification from '../models/notifications.js' // <-- CORRECTED: Import path is singular

const router = express.Router()

/**
 * @route   GET /api/request-info
 * @desc    Get all submitted requests (for admin)
 * @access  Admin
 */
router.get('/', async (req, res) => {
  try {
    const requests = await RequestInfo.find().sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    console.error('Error fetching info requests:', err)
    res.status(500).json({ error: err.message })
  }
})

/**
 * @route   POST /api/request-info
 * @desc    Submit a new info request (from public form)
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    // 1. Create and save the new request from the request body
    const newRequest = new RequestInfo(req.body)
    await newRequest.save()

    const io = req.app.get('io')
    const message = `New candidate request from ${newRequest.companyName}`

    // 2. --- SAVE NOTIFICATION TO DATABASE ---
    const notification = new Notification({
      title: 'New Candidate Request',
      message: message,
      type: 'info',
      link: '/admin/view-requests', // Link for the admin panel
    })
    await notification.save()
    // -----------------------------------------

    // 3. Emit a real-time event to connected admin clients
    io.emit('newInfoRequest', { message })

    // 4. Send a success response to the client
    res.status(201).json({ message: 'Request submitted successfully!' })
  } catch (err) {
    console.error('Error submitting info request:', err)
    res.status(400).json({ error: err.message })
  }
})

/**
 * @route   PUT /api/request-info/:id
 * @desc    Update a request's status (approve/reject)
 * @access  Admin
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' })
    }

    const updatedRequest = await RequestInfo.findByIdAndUpdate(
      id,
      { status },
      { new: true }, // This option returns the updated document
    )

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found.' })
    }

    // --- Email Sending Logic on Approval ---
    if (status === 'approved') {
      try {
        const candidate = await Candidate.findOne({
          name: updatedRequest.candidateName,
        })

        if (candidate) {
          const templateData = prepareCandidateDetailsForRequester(
            updatedRequest,
            candidate,
          )
          const htmlContent = renderEmailTemplate(
            'candidateDetails',
            templateData,
          )
          const mailOptions = {
            from: process.env.AUTH_MAIL,
            to: updatedRequest.email,
            subject: `Candidate Information Approved: ${candidate.name}`,
            html: htmlContent,
          }
          await transporter.sendMail(mailOptions)
          console.log(
            `✅ Candidate details for '${candidate.name}' sent to ${updatedRequest.email}.`,
          )
        } else {
          console.error(
            `⚠️ Candidate '${updatedRequest.candidateName}' not found for approved request ID ${id}. Email could not be sent.`,
          )
        }
      } catch (emailError) {
        console.error(
          `❌ Failed to send candidate details email for request ID ${id}:`,
          emailError,
        )
        // We log the error but don't fail the API request, as the status update was successful.
      }
    }
    // --- End Email Logic ---

    // Emit a real-time event for status change
    const io = req.app.get('io')
    io.emit('requestStatusChange', updatedRequest)

    res.json({
      message: `Request has been ${status}.`,
      request: updatedRequest,
    })
  } catch (err) {
    console.error('Error updating request status:', err)
    res.status(500).json({ error: 'Server error while updating request.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const requestInfo = req.params.id
    const deletedRequest = await RequestInfo.deleteOne({ _id: requestInfo })
    res.send({ deletedRequest })
  } catch (err) {
    res.send(err)
  }
})

export default router
