import { useState, useEffect } from 'react'
import api from '../api/axios'
import { CheckCircle, XCircle } from 'lucide-react'

const AdminInterviewApprovals = () => {
  const [interviews, setInterviews] = useState([])

  const fetchData = async () => {
    const data = await api.get('/interview/approvals')
    setInterviews(data.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- Action Handlers ---
  const handleApprove = async (interviewId) => {
    // In a real application, you'd make an API call here:
    try {
      await api.patch(`/interview/${interviewId}`, {
        approvalStatus: 'approved',
      })
      // Update local state only if API call is successful

      setInterviews((prevInterviews) =>
        prevInterviews.map((c) =>
          c._id === interviewId ? { ...c, approvalStatus: 'approved' } : c,
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

  const handleReject = async (interviewId) => {
    // In a real application, you'd make an API call here:
    try {
      await api.patch(`/candidates/${interviewId}/status`, {
        approvalStatus: 'rejected',
      })
      // Update local state only if API call is successful
      setInterviews((prevInterviews) =>
        prevInterviews.map((c) =>
          c._id === interviewId ? { ...c, approvalStatus: 'rejected' } : c,
        ),
      )
    } catch (error) {
      console.error('Error rejecting candidate:', error)
      // Show an error message to the user
    }

    // --- Dummy State Update (Remove in real app) ---
    console.log(`Rejecting candidate: ${interviewId}`)
    setInterviews((prevInterviews) =>
      prevInterviews.map((c) =>
        c._id === interviewId ? { ...c, approvalStatus: 'rejected' } : c,
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
        Interivew Candidates Waiting for Approvals
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
                Company Name
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Role
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Interview Level
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
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Approval Status
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {interviews.map((interview) => (
              <tr key={interview._id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {interview.candidateName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {interview.companyName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {interview.jobRole}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {interview.interviewLevel}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                  {/* Assuming recruiter's name is in userName from your aggregation */}
                  {interview.userName || 'N/A'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      interview.status,
                    )}`}>
                    {interview.status.charAt(0).toUpperCase() +
                      interview.status.slice(1)}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      interview.approvalStatus,
                    )}`}>
                    {interview.approvalStatus.charAt(0).toUpperCase() +
                      interview.approvalStatus.slice(1)}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                  {interview.approvalStatus === 'pending' ? (
                    <div className='flex justify-center space-x-2'>
                      <button
                        onClick={() => handleApprove(interview._id)}
                        className='p-2 rounded-full text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200'
                        title='Approve'>
                        <CheckCircle className='h-5 w-5' /> {/* React Icon */}
                        {/* Or just text: Approve */}
                      </button>
                      <button
                        onClick={() => handleReject(interview._id)}
                        className='p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200'
                        title='Reject'>
                        <XCircle className='h-5 w-5' /> {/* React Icon */}
                        {/* Or just text: Reject */}
                      </button>
                    </div>
                  ) : (
                    <span className='text-gray-500 text-xs italic'>
                      {interview.approvalStatus.charAt(0).toUpperCase() +
                        interview.approvalStatus.slice(1)}
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

export default AdminInterviewApprovals
