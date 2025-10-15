import React, { useState, useEffect } from 'react'
import api from '../api/axios' // <-- CORRECT: Imports the central API connection
import './AdminManageJobs.css' // Import the new CSS file
import * as XLSX from 'xlsx'
import { FilePenLine, FileText, Trash } from 'lucide-react'

const AdminManageJobs = () => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [company, SetCompany] = useState([])
  
  // --- UPDATED: 'industry' field is now included in the form state ---
  const [formState, setFormState] = useState({
    companyId: '',
    role: '',
    exp: '',
    skills: '',
    salary: '',
    location: '',
    industry: 'Information Technology', // Added with a default value
    status: 'active',
  })
  
  const [showPopup, setShowPopup] = useState(false) // State for controlling the pop-up
  const [editPopup, setEditPopup] = useState(false)

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/jobs')
      setJobs(response.data)
    } catch (err) {
      setError('Could not fetch jobs. Please try again later.')
      console.error('Error fetching jobs:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  const fetchCompanies = async () => {
    try {
      const response = await api.get('/company')
      SetCompany(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchJobs()
    fetchCompanies()
  }, []) // Dependency array is now empty to prevent re-fetching on popup state change

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState((prevState) => ({ ...prevState, [name]: value }))
  }
  
  const handleCompanySelectChange = (e) => {
    const selectedCompanyId = e.target.value
    setFormState((prevState) => ({
      ...prevState,
      companyId: selectedCompanyId,
    }))
  }

  const handleAddJob = async (e) => {
    e.preventDefault()
    try {
      await api.post('/jobs', formState)
      fetchJobs() // Refresh the list from the server
      setShowPopup(false)
      // Reset form to its initial state
      setFormState({
        companyId: '', role: '', exp: '', skills: '', salary: '', location: '', industry: 'Information Technology', status: 'active'
      });
    } catch (err) {
      alert(err.response.data)
      console.error('Error adding job:', err)
    }
  }

  const handleEditPopup = (job) => {
    setFormState(job)
    setEditPopup(true)
  }

  const handleEditJob = async (e) => {
    e.preventDefault()
    try {
      await api.patch(`jobs/${formState._id}`, formState)
      setEditPopup(false)
      fetchJobs() // Refresh the list from the server
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await api.delete(`/jobs/${jobId}`)
        setJobs(jobs.filter((job) => job._id !== jobId))
        alert('Job deleted successfully!')
      } catch (err) {
        alert('Failed to delete job. Check console for details.')
        console.error('Error deleting job:', err)
      }
    }
  }

  const handleExportToExcel = () => {
    // --- UPDATED: Excel export now includes the 'industry' field ---
    const jobsToExport = jobs.map(({ _id, __v, companyId, ...rest }) => ({
        ...rest,
        industry: rest.industry || 'N/A' // Ensure industry is included
    }));
    const worksheet = XLSX.utils.json_to_sheet(jobsToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs')
    XLSX.writeFile(workbook, 'JobListings.xlsx')
  }

  const handleImportFromExcel = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const binaryString = event.target.result
        const workbook = XLSX.read(binaryString, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)

        // Post each job sequentially and wait for all to complete
        for (const job of data) {
          // Ensure imported job has an industry or set a default
          const jobPayload = { ...job, industry: job.industry || 'Information Technology' };
          await api.post('/jobs', jobPayload)
        }

        alert('Jobs imported successfully!')
        fetchJobs() // Refresh the job list from the server
      } catch (err) {
        alert(
          'Failed to import jobs. Please check the file format and console for details.',
        )
        console.error('Error importing jobs:', err)
      }
    }
    reader.readAsBinaryString(file)
    e.target.value = ''
  }

  return (
    <div className='admin-manage-jobs'>
      <div className='bg-[#267edc] rounded-xl shadow-lg p-6 mb-8 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='bg-white bg-opacity-20 p-3 rounded-full'>
            <FileText />
          </div>
          <div>
            <h3 className='text-3xl font-bold text-white'>
              Manage Job Postings
            </h3>
            <p className='text-blue-100 text-sm'>
              Add, update, or remove job listings from the system
            </p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-5xl font-extrabold text-white'>{jobs.length}</p>
          <p className='text-blue-100 text-sm'>Total Jobs Posted</p>
        </div>
      </div>

      <button onClick={() => setShowPopup(true)} className='add-new-job-button'>
        Add New Job Posting
      </button>

      <div className='excel-actions-container'>
        <label htmlFor='import-excel' className='excel-action-link'>
          Import from Excel
        </label>
        <input
          id='import-excel'
          type='file'
          accept='.xlsx, .xls'
          onChange={handleImportFromExcel}
          style={{ display: 'none' }}
        />
        <button onClick={handleExportToExcel} className='excel-action-link'>
          Export to Excel
        </button>
      </div>

      {showPopup && (
        <div className='popup-overlay'>
          <div className='popup-content w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] bg-white p-6 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto'>
            <button
              className='close-popup-button'
              onClick={() => setShowPopup(false)}>
              &times;
            </button>
            <h2>Add New Job Posting</h2>
            <form onSubmit={handleAddJob} className='add-job-form'>
              <div className='form-group'>
                <label htmlFor='companyId'>Company</label>
                <select id='companyId' name='companyId' value={formState.companyId} onChange={handleCompanySelectChange} required className='form-select'>
                  <option value=''>Select a Company</option>
                  {company.map((comp) => (<option key={comp._id} value={comp._id}>{comp.name}</option>))}
                </select>
              </div>
              <div className='form-group'><label htmlFor='role'>Job Role</label><input id='role' name='role' value={formState.role} onChange={handleInputChange} placeholder='e.g., Frontend Developer' required /></div>
              <div className='form-group'><label htmlFor='exp'>Experience</label><input id='exp' name='exp' value={formState.exp} onChange={handleInputChange} placeholder='e.g., 0-2 yrs' required /></div>
              <div className='form-group'><label htmlFor='skills'>Skills</label><input id='skills' name='skills' value={formState.skills} onChange={handleInputChange} placeholder='e.g., React, JS, HTML' required /></div>
              <div className='form-group'><label htmlFor='salary'>Salary</label><input id='salary' name='salary' value={formState.salary} onChange={handleInputChange} placeholder='e.g., 3-4 LPA' required /></div>
              <div className='form-group'><label htmlFor='location'>Location</label><input id='location' name='location' value={formState.location} onChange={handleInputChange} placeholder='e.g., Hyderabad' required /></div>
              {/* --- ADDED: Industry field in Add form --- */}
              <div className='form-group'><label htmlFor='industry'>Industry</label><input id='industry' name='industry' value={formState.industry} onChange={handleInputChange} placeholder='e.g., Information Technology' required /></div>
              <div className='form-group'><label htmlFor='jobStatus'>Job Status</label><select name='status' onChange={handleInputChange} value={formState.status} id='jobStatus'><option value='active'>Active</option><option value='in active'>In Active</option></select></div>
              <button type='submit' className='post-job-button'>Post Job</button>
            </form>
          </div>
        </div>
      )}
      
      {editPopup && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
          <div className='relative p-8 border w-11/12 max-w-lg shadow-lg rounded-md bg-white h-auto max-h-[90vh] overflow-y-auto'>
            <button className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-semibold' onClick={() => setEditPopup(false)}>&times;</button>
            <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Edit Job Posting</h2>
            <form onSubmit={handleEditJob} className='space-y-4'>
              <div><label htmlFor='companyId' className='block text-sm font-medium text-gray-700 mb-1'>Company</label><select id='companyId' name='companyId' value={formState.companyId} onChange={handleCompanySelectChange} required className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'><option value=''>Select a Company</option>{company.map((comp) => (<option key={comp._id} value={comp._id}>{comp.name}</option>))}</select></div>
              <div><label htmlFor='role' className='block text-sm font-medium text-gray-700 mb-1'>Job Role</label><input id='role' name='role' type='text' value={formState.role} onChange={handleInputChange} required className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm' /></div>
              <div><label htmlFor='exp' className='block text-sm font-medium text-gray-700 mb-1'>Experience</label><input id='exp' name='exp' type='text' value={formState.exp} onChange={handleInputChange} required className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm' /></div>
              <div><label htmlFor='skills' className='block text-sm font-medium text-gray-700 mb-1'>Skills</label><input id='skills' name='skills' type='text' value={formState.skills} onChange={handleInputChange} required className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm' /></div>
              <div><label htmlFor='salary' className='block text-sm font-medium text-gray-700 mb-1'>Salary</label><input id='salary' name='salary' type='text' value={formState.salary} onChange={handleInputChange} required className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm' /></div>
              <div><label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-1'>Location</label><input id='location' name='location' type='text' value={formState.location} onChange={handleInputChange} required className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm' /></div>
              {/* --- ADDED: Industry field in Edit form --- */}
              <div><label htmlFor='industry' className='block text-sm font-medium text-gray-700 mb-1'>Industry</label><input id='industry' name='industry' type='text' value={formState.industry} onChange={handleInputChange} required className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm' /></div>
              <div><label htmlFor='jobStatus'>Job Status</label><select name='status' onChange={handleInputChange} value={formState.status} id='jobStatus' className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'><option value='active'>Active</option><option value='in active'>In Active</option></select></div>
              <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 mt-6'>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      <div className='listings-container card'>
        <h2>Current Job Listings</h2>
        {isLoading && <p>Loading jobs...</p>}
        {error && <p className='error-message'>{error}</p>}
        {!isLoading && !error && (
          <div className='table-responsive'>
            <table className='jobs-table'>
              <thead>
                {/* --- UPDATED: Added 'Industry' column to table header --- */}
                <tr>
                  <th>Job Id</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Experience</th>
                  <th>Skills</th>
                  <th>Salary</th>
                  <th>Location</th>
                  <th>Industry</th>
                  <th>Job Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job._id}>
                      <td>{job._id}</td>
                      <td>{job.companyName}</td>
                      <td>{job.role}</td>
                      <td>{job.exp}</td>
                      <td>{job.skills}</td>
                      <td>{job.salary}</td>
                      <td>{job.location}</td>
                      {/* --- ADDED: Displaying industry data in table row --- */}
                      <td>{job.industry || 'N/A'}</td>
                      <td>{job.status || 'N/A'}</td>
                      <td className='flex align-center justify-center gap-3 p-5 '>
                        <button onClick={() => handleEditPopup(job)} className='text-indigo-600 hover:text-indigo-900 text-sm'><FilePenLine /></button>
                        <button onClick={() => handleDeleteJob(job._id)} className='text-rose-600 hover:text-rose-900 text-sm'><Trash /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan='10' className='no-jobs-found'>No job positions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminManageJobs