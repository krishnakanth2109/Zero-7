import express from 'express'
import Interview from '../models/Interview.js'
import Candidate from '../models/Candidate.js'
import jobs from '../models/jobs.js'
import Companies from '../models/Companies.js'

const router = express.Router()

router.post('/', async (request, response) => {
  const { candidateId, jobId, status, companyId, userId, date } = request.body
  const interviewPosted = await Interview.findOne({
    candidateId: candidateId,
    jobId: jobId,
  })
  if (interviewPosted) {
    response.status(400).send('Interview Already Scheduled for Cadidate')
  } else {
    const candidateName = await Candidate.find(
      { _id: candidateId },
      { name: 1 },
    )
    if (!candidateName) {
      response.status(404).send('candidate does not exists')
    }
    const jobRole = await jobs.find({ _id: jobId }, { role: 1 })
    if (!jobRole) {
      response.status(404).send('Job not found')
    }
    const companyName = await Companies.find({ _id: companyId }, { name: 1 })
    if (!companyName) {
      response.status(404).send('Company not found')
    }
    const newInterview = new Interview({
      candidateId: candidateId,
      jobId: jobId,
      status: status,
      companyId: companyId,
      userId: userId,
      date: date,
    })
    await newInterview.save()
    const payload = {
      candidateName: candidateName,
      companyName: companyName,
      status: newInterview.status,
      date: newInterview.date,
    }
    response.status(201).send({ payload })
  }
})

export default router
