import React, { useState, useEffect } from 'react'
import api from '../api/axios'
// Import Lucide icons
import { CheckCircle, XCircle } from 'lucide-react'

const initialCandidates = [
  {
    _id: 'c1',
    name: 'Alice Johnson',
    role: 'Software Engineer',
    location: 'San Francisco, CA',
    email: 'alice@example.com',
    skills: ['React', 'Node.js', 'MongoDB'],
    status: 'pending', // 'pending', 'approved', 'rejected'
    recruiter: {
      id: 'u1',
      name: 'John Doe',
      role: 'recruiter',
    },
    userName: 'John Doe',
    userRole: 'recruiter',
  },
  {
    _id: 'c2',
    name: 'Bob Williams',
    role: 'UX Designer',
    location: 'New York, NY',
    email: 'bob@example.com',
    skills: ['Figma', 'Sketch', 'User Research'],
    status: 'pending',
    recruiter: {
      id: 'u2',
      name: 'Jane Smith',
      role: 'recruiter',
    },
    userName: 'Jane Smith',
    userRole: 'recruiter',
  },
  {
    _id: 'c3',
    name: 'Charlie Brown',
    role: 'Data Scientist',
    location: 'Seattle, WA',
    email: 'charlie@example.com',
    skills: ['Python', 'SQL', 'Machine Learning'],
    status: 'approved',
    recruiter: {
      id: 'u1',
      name: 'John Doe',
      role: 'recruiter',
    },
    userName: 'John Doe',
    userRole: 'recruiter',
  },
  {
    _id: 'c4',
    name: 'Diana Prince',
    role: 'Product Manager',
    location: 'Austin, TX',
    email: 'diana@example.com',
    skills: ['Product Strategy', 'Roadmapping', 'Agile'],
    status: 'rejected',
    recruiter: {
      id: 'u3',
      name: 'Peter Jones',
      role: 'recruiter',
    },
    userName: 'Peter Jones',
    userRole: 'recruiter',
  },
]

const AdminCandidateApprovals = () => {
  const [candidates, setCandidates] = useState([])

  const fetchData = async () => {
    const data = await api.get('/candidates/pendings')
    setCandidates(data.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- Action Handlers ---
  const handleApprove = async (candidateId) => {
    // In a real application, you'd make an API call here:
    try {
      await api.patch(`/candidates/${candidateId}/status`, {
        status: 'approved',
      })
      // Update local state only if API call is successful

      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c._id === candidateId ? { ...c, status: 'approved' } : c,
        ),
      )
    } catch (error) {
      console.error('Error approving candidate:', error)
      // Show an error message to the user
    }

    // --- Dummy State Update (Remove in real app) ---
    // console.log(`Approving candidate: ${candidateId}`)
    // setCandidates((prevCandidates) =>
    //   prevCandidates.map((c) =>
    //     c._id === candidateId ? { ...c, status: 'approved' } : c,
    //   ),
    // )
    // ------------------------------------------------
  }

  const handleReject = async (candidateId) => {
    // In a real application, you'd make an API call here:
    try {
      await api.patch(`/candidates/${candidateId}/status`, {
        status: 'rejected',
      })
      // Update local state only if API call is successful
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c._id === candidateId ? { ...c, status: 'rejected' } : c,
        ),
      )
    } catch (error) {
      console.error('Error rejecting candidate:', error)
      // Show an error message to the user
    }

    // --- Dummy State Update (Remove in real app) ---
    console.log(`Rejecting candidate: ${candidateId}`)
    setCandidates((prevCandidates) =>
      prevCandidates.map((c) =>
        c._id === candidateId ? { ...c, status: 'rejected' } : c,
      ),
    )
    // ------------------------------------------------
  }

  // --- Status Badge Styling ---
  const getStatusClasses = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }
  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8'>
      <h2 className='text-3xl font-bold text-gray-800 mb-6'>
        Candidates Waiting for Approvals
      </h2>

      {/* Responsive Table Container */}
      <div className='overflow-x-auto bg-white shadow-lg rounded-lg'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Role
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Location
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Skills
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Recruiter
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {candidates.map((candidate) => (
              <tr key={candidate._id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {candidate.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {candidate.role}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {candidate.location}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  <div className='flex flex-wrap gap-1'>
                    {candidate.skills.split(',').map((skill) => (
                      <span className='px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full'>
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {/* Assuming recruiter's name is in userName from your aggregation */}
                  {candidate.userName || 'N/A'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      candidate.status,
                    )}`}>
                    {candidate.status.charAt(0).toUpperCase() +
                      candidate.status.slice(1)}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                  {candidate.status === 'pending' ? (
                    <div className='flex justify-center space-x-2'>
                      <button
                        onClick={() => handleApprove(candidate._id)}
                        className='p-2 rounded-full text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200'
                        title='Approve'>
                        <CheckCircle className='h-5 w-5' /> {/* React Icon */}
                        {/* Or just text: Approve */}
                      </button>
                      <button
                        onClick={() => handleReject(candidate._id)}
                        className='p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200'
                        title='Reject'>
                        <XCircle className='h-5 w-5' /> {/* React Icon */}
                        {/* Or just text: Reject */}
                      </button>
                    </div>
                  ) : (
                    <span className='text-gray-500 text-xs italic'>
                      {candidate.status.charAt(0).toUpperCase() +
                        candidate.status.slice(1)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminCandidateApprovals
