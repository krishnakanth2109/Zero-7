import express from 'express'
import Interview from '../models/Interview.js'
import Candidate from '../models/Candidate.js'
import jobs from '../models/jobs.js'
import Companies from '../models/Companies.js'

const router = express.Router()

router.get('/', async (request, response) => {
  try {
    const pipeline = [
      // Stage 1: Convert String IDs to ObjectId for lookups where target _id is ObjectId
      {
        $addFields: {
          candidateObjectId: { $toObjectId: '$candidateId' },
          jobObjectId: { $toObjectId: '$jobId' }, // <--- NEW: Convert jobId to ObjectId
          // userObjectId: { $toObjectId: '$userId' }, // Also convert userId if you need recruiter details
        },
      },
      // Stage 2: Lookup Candidate details (using converted ObjectId)
      {
        $lookup: {
          from: 'candidates', // Collection name for the Candidate model
          localField: 'candidateObjectId',
          foreignField: '_id',
          as: 'candidateInfo',
        },
      },
      // Stage 3: Unwind candidateInfo (to get the candidate object directly)
      {
        $unwind: '$candidateInfo',
      },
      // Stage 4: Lookup Job details (using converted jobObjectId) <--- NEW STAGE
      {
        $lookup: {
          from: 'jobs', // Collection name for the Job model
          localField: 'jobObjectId',
          foreignField: '_id',
          as: 'jobInfo',
        },
      },
      // Stage 5: Unwind jobInfo (to get the job object directly) <--- NEW STAGE
      {
        $unwind: '$jobInfo',
      },
      // Stage 6: Lookup Company details (using the string companyId from Interview, matching on Company.name)
      // This is based on your specific document, where companyId might be a string like "Vg07"
      {
        $lookup: {
          from: 'companies', // Collection name for the Company model
          localField: 'companyId', // Interview's companyId (e.g., "Vg07")
          foreignField: '_id', // Company's name field (assuming your Company model has a 'name' field)
          as: 'companyInfo',
        },
      },
      // Stage 7: Unwind companyInfo (to get the company object directly)
      // Use preserveNullAndEmptyArrays: true if a company name might not always match,
      // and you still want the interview in the result.
      {
        $unwind: {
          path: '$companyInfo',
          preserveNullAndEmptyArrays: true, // Keep the interview even if company isn't found
        },
      },
      // Stage 8: Project the desired fields, including new ones and original ones
      {
        $project: {
          // Include all original fields from the Interview document
          _id: 1,
          candidateId: 1,
          jobId: 1,
          status: 1,
          companyId: 1,
          userId: 1,
          date: 1,
          // If you have timestamps in Interview schema, include them
          createdAt: 1,
          updatedAt: 1,

          // Add the derived names and role
          candidateName: '$candidateInfo.name', // Candidate's 'name' field
          // Use ternary operator with $ifNull to handle cases where companyInfo might be null
          companyName: '$companyInfo.name',
          jobRole: '$jobInfo.role', // <--- NEW: Job's 'role' field
        },
      },
      // Stage 9: Sort the results (optional)
      { $sort: { date: -1 } }, // Assuming you want to sort by interview date
    ]
    const result = await Interview.aggregate(pipeline)
    response.send(result)
  } catch (err) {
    response.send({ err })
  }
})

router.post('/', async (request, response) => {
  const { candidateId, jobId, status, companyId, date } = request.body
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

router.get('/search', async (request, response) => {
  try {
    const candidates = await Candidate.find({}, { _id: 1, name: 1 })
    const companies = await Companies.find({}, { _id: 1, name: 1 })
    response.send({ candidates, companies })
  } catch (error) {
    console.error('Error fetching enriched interviews:', error)
    response.status(500).json({ message: 'Internal server error.' })
  }
})

export default router
