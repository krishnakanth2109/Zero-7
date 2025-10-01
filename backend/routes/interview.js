import express from 'express'
import Interview from '../models/Interview.js'
import Candidate from '../models/Candidate.js'
import jobs from '../models/jobs.js'
import Companies from '../models/Companies.js'

const router = express.Router()

router.get('/', async (request, response) => {
  try {
    const pipeline = [
      // Stage 1: Match the specific application/interview document
      {
        $match: {
          _id: new mongoose.Types.ObjectId(applicationId),
          // For your example: _id: new mongoose.Types.ObjectId("68dd0389362ac8ea001bec1f")
        },
      },
      // Stage 2: Lookup Candidate details
      {
        $lookup: {
          from: 'candidates', // The collection name for Candidate model (usually lowercase, plural)
          localField: 'candidateId',
          foreignField: '_id',
          as: 'candidateDetails',
        },
      },
      // Stage 3: Unwind the candidateDetails array (since $lookup returns an array)
      {
        $unwind: '$candidateDetails',
      },
      // Stage 4: Lookup Job details
      {
        $lookup: {
          from: 'jobs', // The collection name for Job model
          localField: 'jobId',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      // Stage 5: Unwind jobDetails
      {
        $unwind: '$jobDetails',
      },
      // Stage 6: Lookup Company details (using the company ID from the Job document)
      {
        $lookup: {
          from: 'companies', // The collection name for Company model
          localField: 'jobDetails.company', // Reference company ID within jobDetails
          foreignField: '_id',
          as: 'companyDetails',
        },
      },
      // Stage 7: Unwind companyDetails
      {
        $unwind: '$companyDetails',
      },
      // Stage 8: Lookup Recruiter (User) details
      {
        $lookup: {
          from: 'users', // The collection name for User model
          localField: 'userId',
          foreignField: '_id',
          as: 'recruiterDetails',
        },
      },
      // Stage 9: Unwind recruiterDetails
      {
        $unwind: '$recruiterDetails',
      },
      // Stage 10: Project the desired fields into the final output shape
      {
        $project: {
          _id: 1, // Include the original application/interview ID
          status: 1,
          date: 1, // Include the original date
          // companyId: "$companyDetails._id", // If you want the companyId from the company document
          // userId: "$recruiterDetails._id", // If you want the userId from the user document

          candidate: {
            _id: '$candidateDetails._id',
            name: '$candidateDetails.name', // Combine first and last name
          },
          job: {
            _id: '$jobDetails._id',
            role: '$jobDetails.title', // "role" from job title
            description: '$jobDetails.description', // Example: include job description
            company: {
              _id: '$companyDetails._id',
              name: '$companyDetails.name',
            },
          },
          recruiter: {
            _id: '$recruiterDetails._id',
            name: '$recruiterDetails.username', // Recruiter's name (username)
          },
        },
      },
    ]
    const result = await Application.aggregate(pipeline) //
    response.send(result)
  } catch (err) {
    response.send({ err })
  }
})

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
